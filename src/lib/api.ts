import { authClient } from "./auth-client";


export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const { data } = await authClient.token(); 

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(data?.token ? { Authorization: `Bearer ${data.token}` } : {}),
      ...options.headers,
    },
  });

  const body = await res.json().catch(() => null);
  if (!res.ok) {
    
    throw new Error(body?.message ?? "Request failed");
  }
  return body as T;
}