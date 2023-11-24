import type { Config } from '@netlify/functions';
import ParameterisedFunctionDto from './parameterised-dto.mjs';
import { getClassSchema } from 'joi-class-decorators';
import Joi from 'joi';

export default async (req: Request): Promise<Response> => {
  const body = await req.json();

  const promise = getClassSchema(ParameterisedFunctionDto).validateAsync(body);

  try {
    const model = (await promise) as ParameterisedFunctionDto;

    const responseParts = [
      `Hello ${model.Name}!`,
      `Your favourite number is ${model.FavouriteNumber}.`,
      model.HighFive ? 'High five! Awesome!' : '',
      model.DateOfBirth != null
        ? `You were born on ${model.DateOfBirth.toISOString().split('T')[0]}.`
        : ''
    ].filter(part => part.length > 0);

    return new Response(responseParts.join(' '));
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
  path: '/parameterised'
};
