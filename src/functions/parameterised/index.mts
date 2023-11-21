import type { Config } from "@netlify/functions";
import type { MyParameters } from './types.mjs';

function validateType<T>(value: T, type: string, fieldName: string): string | null {
  if (typeof value !== type) {
    return `Invalid ${fieldName}.`;
  }
  return null;
}

function validateDate(dateString: string, fieldName: string): string | null {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return `Invalid ${fieldName}.`;
  }
  return null;
}

export default async (req: Request) => {
  const body = await req.json();

  const errors = [
    validateType(body.Name, 'string', 'Name'),
    validateType(body.FavouriteNumber, 'number', 'Favourite Number'),
    validateType(body.HighFive, 'boolean', 'High Five'),
    body.DateOfBirth !== undefined ? validateDate(body.DateOfBirth, 'Date of Birth') : null
  ].filter(e => e !== null);

  if (errors.length > 0) {
    return new Response(errors.join(", "), { status: 400 });
  }

  if (typeof body.DateOfBirth === "string") {
    body.DateOfBirth = new Date(body.DateOfBirth);
  }

  const model = body as MyParameters;

  const responseParts = [
    `Hello ${model.Name}!`,
    `Your favourite number is ${model.FavouriteNumber}.`,
    model.HighFive ? "High five! Awesome!" : "",
    model.DateOfBirth ? `You were born on ${model.DateOfBirth.toISOString().split('T')[0]}.` : ""
  ].filter(part => part.length > 0);

  return new Response(responseParts.join(" "));
};

export const config: Config = {
  path: "/parameterised"
};
