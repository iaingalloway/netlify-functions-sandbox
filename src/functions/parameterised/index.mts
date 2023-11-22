import type { Config } from '@netlify/functions';
import { MyParameters } from './types.mjs';
import { getClassSchema } from 'joi-class-decorators';
import Joi from 'joi'

export default async (req: Request) => {
  const body = await req.json();

  try {
    const model = await getClassSchema(MyParameters).validateAsync(body) as MyParameters;

    const responseParts = [
      `Hello ${model.Name}!`,
      `Your favourite number is ${model.FavouriteNumber}.`,
      model.HighFive ? "High five! Awesome!" : "",
      model.DateOfBirth ? `You were born on ${model.DateOfBirth.toISOString().split('T')[0]}.` : ""
    ].filter(part => part.length > 0);

    return new Response(responseParts.join(" "));
  }
  catch (error) {
    if (error instanceof Joi.ValidationError) {
      return new Response(error.details.map(detail => detail.message).join(", "), { status: 400 });
    }
    throw error;
  }
};

export const config: Config = {
  path: "/parameterised"
};
