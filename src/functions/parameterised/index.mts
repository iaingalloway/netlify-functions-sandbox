import type { Config } from "@netlify/functions";
import type { MyParameters } from './types.mjs';

export default async (req: Request) => {
  const body = await req.json() as MyParameters;

  if (!body)
  {
    return new Response("No parameters provided.", { status: 400 });
  }

  if (typeof body.Name !== "string")
  {
    return new Response("Invalid Name.", { status: 400 });
  }

  if (typeof body.FavouriteNumber !== "number")
  {
    return new Response("Invalid Favourite Number.", { status: 400 });
  }

  if (typeof body.HighFive !== "boolean")
  {
    return new Response("Invalid High Five.", { status: 400 });
  }

  if (body.DateOfBirth !== undefined) {
    if (typeof body.DateOfBirth === "string") {
      body.DateOfBirth = new Date(body.DateOfBirth);
      if (isNaN(body.DateOfBirth.getTime())) {
        return new Response("Invalid Date of Birth.", { status: 400 });
      }
    }
  }

  const params = body as MyParameters;

  const responseParts = [
    `Hello ${params.Name}!`,
    `Your favourite number is ${params.FavouriteNumber}.`,
  ]

  if (params.HighFive) {
    responseParts.push("High five! Awesome!");
  }

  if (params.DateOfBirth) {
    responseParts.push(`You were born on ${params.DateOfBirth.toISOString().split('T')[0]}.`);
  }

  return new Response(responseParts.join(" "));
};

export const config: Config = {
  path: "/parameterised"
};
