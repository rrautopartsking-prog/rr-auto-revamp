self.addEventListener("push", (event) => {
  const data = event.data?.json() || {};
  const title = data.title || "New Inquiry — RR Auto Revamp";
  const options = {
    body: data.body || "A new inquiry has been submitted.",
    icon: "/manifest-icon.png",
    badge: "/manifest-icon.png",
    tag: "new-lead",
    renotify: true,
    data: { url: data.url || "/admin/leads" },
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data?.url || "/admin/leads")
  );
});
