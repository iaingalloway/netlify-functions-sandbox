import type { Config } from "@netlify/functions";
import type { MyParameters } from './types.mjs';

export default async (req: Request) => {
  const params = await req.json() as MyParameters;

  const responseParts = [
    `Hello ${params.Name}!`,
    `Your favourite number is ${params.FavouriteNumber}.`,
  ]

  if (params.HighFive) {
    responseParts.push("High five! Awesome!");
  }

  if (params.DateOfBirth) {
    responseParts.push(`You were born on ${params.DateOfBirth}.`);
  }

  return new Response(responseParts.join(" "));
};

export const config: Config = {
  path: "/parameterised"
};
