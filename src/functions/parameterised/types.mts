import { JoiSchema, JoiSchemaOptions } from 'joi-class-decorators';
import Joi from 'joi';

@JoiSchemaOptions({
  allowUnknown: false,
  abortEarly: false
})
export class MyParameters {
  @JoiSchema(Joi.string().required())
  Name!: string;

  @JoiSchema(Joi.number().required())
  FavouriteNumber!: number;

  @JoiSchema(Joi.boolean().required())
  HighFive!: boolean;

  @JoiSchema(Joi.date().optional())
  DateOfBirth?: Date;
}
