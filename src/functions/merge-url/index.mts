import type { Config } from '@netlify/functions';
import MergeUrlDto from './merge-url-dto.mjs';
import { getClassSchema } from 'joi-class-decorators';
import Joi from 'joi';
import fetch from 'node-fetch';

async function fetchParametersFromUrl(
  baseUrl: string,
  partialUrl: string,
  maxDepth: number
): Promise<any> {
  if (maxDepth <= 0) return {};

  // Prepend the base URL if the partial URL doesn't start with "http://" or "https://"
  const fullUrl = partialUrl.startsWith('http')
    ? partialUrl
    : `${baseUrl}${partialUrl}`;

  const response = await fetch(fullUrl);
  if (!response.ok)
    throw new Error(`Failed to fetch parameters from URL: ${fullUrl}`);

  const data: any = await response.json();
  if (data.ConfigUrl && maxDepth > 1) {
    const nestedData = await fetchParametersFromUrl(
      baseUrl,
      data.ConfigUrl,
      maxDepth - 1
    );
    return { ...nestedData, ...data };
  }

  return data;
}

export default async (req: Request) => {
  const body = await req.json();

  // Extract base URL from the request
  const baseUrl = new URL(req.url).origin;

  let externalParams = {};
  const MAX_DEPTH = parseInt(process.env.MAX_DEPTH || '3');

  if (body.ConfigUrl) {
    externalParams = await fetchParametersFromUrl(
      baseUrl,
      body.ConfigUrl,
      MAX_DEPTH
    );
  }

  // Merge parameters: externalParams first, then body to overwrite
  const mergedParams = { ...externalParams, ...body };

  try {
    const model = (await getClassSchema(MergeUrlDto).validateAsync(
      mergedParams
    )) as MergeUrlDto;

    const responseParts = [
      `I found an adorable ${model.TypeOfAnimal} called ${model.Name}!`,
      model.Age ? `It is ${model.Age} years old.` : ''
    ].filter(part => part.length > 0);

    return new Response(responseParts.join(' '), { status: 200 });
  } catch (error) {
    if (error instanceof Joi.ValidationError) {
      return new Response(
        error.details.map(detail => detail.message).join(', '),
        { status: 400 }
      );
    }
    throw error;
  }
};

export const config: Config = {
  path: '/merge-url'
};
