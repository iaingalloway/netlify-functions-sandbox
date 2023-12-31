import { JoiSchema, JoiSchemaOptions } from 'joi-class-decorators';
import Joi from 'joi';
import type NestedParameterDto from '../nested-parameter-dto.mjs';

@JoiSchemaOptions({
  allowUnknown: false,
  abortEarly: false
})
export default class MergeUrlDto implements NestedParameterDto {
  @JoiSchema(Joi.string().uri({ allowRelative: true }).optional())
  ConfigUrl!: string;

  @JoiSchema(Joi.string().valid('cat', 'dog', 'fish').required())
  TypeOfAnimal!: string;

  @JoiSchema(Joi.string().required())
  Name!: string;

  @JoiSchema(Joi.number().optional())
  Age?: number;
}
