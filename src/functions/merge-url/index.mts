import type { Config } from '@netlify/functions';
import MergeUrlDto from './merge-url-dto.mjs';
import { getClassSchema } from 'joi-class-decorators';
import Joi from 'joi';
import parametersProvider from '../parameters-provider.mjs';
import fetchJson from '../fetch-json.mjs';

export default async (
  req: Request,
  provider: typeof parametersProvider<MergeUrlDto> = parametersProvider<MergeUrlDto>,
  client = fetchJson<MergeUrlDto>
): Promise<Response> => {
  const body = (await req.json()) as { ConfigUrl: string };

  let externalParams = {};

  if (body.ConfigUrl?.length > 0) {
    const baseUrl = new URL(req.url).origin;
    const MAX_DEPTH = parseInt(process.env.MAX_DEPTH ?? '3');

    externalParams =
      (await provider(baseUrl, body.ConfigUrl, MAX_DEPTH, client)) ?? {};
  }

  const mergedParams = { ...externalParams, ...body };

  const promise = getClassSchema(MergeUrlDto).validateAsync(mergedParams);

  try {
    const model = (await promise) as MergeUrlDto;

    const responseParts = [
      `I found an adorable ${model.TypeOfAnimal} called ${model.Name}!`,
      model.Age != null ? `It is ${model.Age} years old.` : ''
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
