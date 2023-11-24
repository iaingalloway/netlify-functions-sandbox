import fetch from 'node-fetch';
import MergeUrlDto from './merge-url-dto.mjs';
import httpJsonClient from './http-json-client.mjs';

async function fetchParametersFromUrl(
  baseUrl: string,
  partialUrl: string,
  maxDepth: number,
  client: typeof httpJsonClient
): Promise<{}> {
  if (maxDepth <= 0) return {};

  const fullUrl = partialUrl.startsWith('http')
    ? partialUrl
    : `${baseUrl}${partialUrl}`;

  const data = (await client(fullUrl)) as MergeUrlDto;

  if (data.ConfigUrl && maxDepth > 1) {
    const nestedData = await fetchParametersFromUrl(
      baseUrl,
      data.ConfigUrl,
      maxDepth - 1,
      client
    );
    return { ...nestedData, ...data };
  }

  return data as MergeUrlDto;
}

export default fetchParametersFromUrl;
