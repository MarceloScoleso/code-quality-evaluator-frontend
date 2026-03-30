export const API_URL = process.env.NEXT_PUBLIC_API_URL;
 
if (!API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL não está definida");
}
 
export async function apiFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const lang = typeof window !== "undefined" ? (localStorage.getItem("lang") ?? "pt") : "pt";
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
 
  return fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      "Accept-Language": lang,
      ...(options.headers as Record<string, string> | undefined),
    },
  });
}
 