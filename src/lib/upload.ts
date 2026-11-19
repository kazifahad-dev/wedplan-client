export async function uploadImage(file: File): Promise<string> {
  const form = new FormData();
  form.append("image", file);

  const res = await fetch("/api/upload", { method: "POST", body: form });
  const data = await res.json().catch(() => null);

  if (!res.ok || !data?.url) {
    throw new Error(data?.message ?? "Image upload failed");
  }
  return data.url as string;
}