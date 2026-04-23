import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export interface UploadResult {
  url: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

export async function uploadImage(
  file: string,
  folder: string = "rr-auto-revamp/products"
): Promise<UploadResult> {
  const result = await cloudinary.uploader.upload(file, {
    folder,
    transformation: [
      { quality: "auto:best", fetch_format: "auto" },
      { width: 1200, height: 1200, crop: "limit" },
    ],
    resource_type: "image",
  });

  return {
    url: result.secure_url,
    publicId: result.public_id,
    width: result.width,
    height: result.height,
    format: result.format,
    bytes: result.bytes,
  };
}

export async function deleteImage(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId);
}

export function getOptimizedUrl(
  url: string,
  options: { width?: number; height?: number; quality?: string } = {}
): string {
  if (!url || !url.includes("cloudinary.com")) return url;
  const { width, height, quality = "auto" } = options;
  const transforms = [`q_${quality}`, "f_auto"];
  if (width) transforms.push(`w_${width}`);
  if (height) transforms.push(`h_${height}`, "c_fill");
  return url.replace("/upload/", `/upload/${transforms.join(",")}/`);
}

export function getThumbnailUrl(url: string): string {
  return getOptimizedUrl(url, { width: 400, height: 400, quality: "auto:good" });
}

export function getFullUrl(url: string): string {
  return getOptimizedUrl(url, { width: 1200, quality: "auto:best" });
}

export { cloudinary };
