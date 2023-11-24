import fetch from 'node-fetch';

export default async function <T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch json from URL: ${url}`);

  const data = (await response.json()) as T;
  return data;
}
