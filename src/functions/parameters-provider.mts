import type fetchJson from './fetch-json.mjs';
import type NestedParameterDto from './nested-parameter-dto.mjs';

async function fetchParametersFromUrl<T extends NestedParameterDto>(
  baseUrl: string,
  partialUrl: string,
  maxDepth: number,
  client: typeof fetchJson<T>
): Promise<T | null> {
  if (maxDepth <= 0) return null;

  const fullUrl = partialUrl.startsWith('http')
    ? partialUrl
    : `${baseUrl}${partialUrl}`;

  const data = await client(fullUrl);

  if (data.ConfigUrl != null && maxDepth > 1) {
    const nestedData = await fetchParametersFromUrl<T>(
      baseUrl,
      data.ConfigUrl,
      maxDepth - 1,
      client
    );
    return { ...data, ...nestedData };
  }

  return data;
}

export default fetchParametersFromUrl;
