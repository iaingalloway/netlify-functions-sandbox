import fetchJson from './fetch-json.mjs';
import NestedParameterDto from './nested-parameter-dto.mjs';

async function fetchParametersFromUrl<T extends NestedParameterDto>(
  baseUrl: string,
  partialUrl: string,
  maxDepth: number,
  client: typeof fetchJson<T>
): Promise<T> {
  if (maxDepth <= 0) return {} as T;

  const fullUrl = partialUrl.startsWith('http')
    ? partialUrl
    : `${baseUrl}${partialUrl}`;

  const data = await client(fullUrl);

  if (data.ConfigUrl && maxDepth > 1) {
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
