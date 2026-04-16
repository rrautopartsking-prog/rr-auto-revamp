import { v2 as cloudinary } from "cloudinary";
// next-cloudinary is used for client-side components via CldImage

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function uploadImage(
  file: string,
  folder: string = "rr-auto-revamp"
): Promise<{ url: string; publicId: string }> {
  if (!process.env.CLOUDINARY_API_KEY) {
    throw new Error("Cloudinary is not configured. Set CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, and NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME.");
  }
  const result = await cloudinary.uploader.upload(file, {
    folder,
    transformation: [{ quality: "auto", fetch_format: "auto" }],
  });
  return { url: result.secure_url, publicId: result.public_id };
}

export async function deleteImage(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId);
}

export function getOptimizedUrl(url: string, width?: number, height?: number): string {
  if (!url.includes("cloudinary.com")) return url;
  const transforms = ["q_auto", "f_auto"];
  if (width) transforms.push(`w_${width}`);
  if (height) transforms.push(`h_${height}`);
  return url.replace("/upload/", `/upload/${transforms.join(",")}/`);
}

export { cloudinary };
