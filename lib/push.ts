export interface PushSubscriptionData {
  endpoint: string;
  keys: { p256dh: string; auth: string };
}

// In-memory store (resets on cold start — acceptable for now)
const subscriptions = new Set<string>();

export function saveSubscription(sub: PushSubscriptionData) {
  subscriptions.add(JSON.stringify(sub));
}

export function removeSubscription(endpoint: string) {
  const found = Array.from(subscriptions).find((s) => JSON.parse(s).endpoint === endpoint);
  if (found) subscriptions.delete(found);
}

export async function sendPushToAll(payload: { title: string; body: string; url?: string }) {
  const VAPID_PUBLIC = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const VAPID_PRIVATE = process.env.VAPID_PRIVATE_KEY;
  const VAPID_EMAIL = process.env.ADMIN_EMAIL || "rrautopartsking@gmail.com";

  if (!VAPID_PUBLIC || !VAPID_PRIVATE || subscriptions.size === 0) return;

  try {
    // Lazy import to avoid module-load issues in serverless
    const webpush = (await import("web-push")).default;
    webpush.setVapidDetails(`mailto:${VAPID_EMAIL}`, VAPID_PUBLIC, VAPID_PRIVATE);

    const dead: string[] = [];

    for (const raw of Array.from(subscriptions)) {
      const sub = JSON.parse(raw) as PushSubscriptionData;
      try {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: sub.keys },
          JSON.stringify(payload)
        );
      } catch (err: unknown) {
        const status = (err as { statusCode?: number }).statusCode;
        if (status === 404 || status === 410) dead.push(raw);
      }
    }

    dead.forEach((s) => subscriptions.delete(s));
  } catch (err) {
    console.error("Push notification error:", err);
  }
}
