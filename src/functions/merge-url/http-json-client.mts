import fetch from 'node-fetch';

export default async function (url: string): Promise<{}> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch json from URL: ${url}`);

  const data: any = await response.json();
  return data;
}
