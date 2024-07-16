import * as Joi from '@hapi/joi';

const CreateUserSchema = Joi.object().keys({
  email: Joi.string().email().required(),
  name: Joi.string().min(6).max(30).required(),
  dob: Joi.date().iso().required().raw()
});

const UpdateUserSchema = Joi.object().keys({
  email: Joi.string().email(),
  name: Joi.string().min(6).max(30),
  dob: Joi.date().iso().raw()
});

export { CreateUserSchema, UpdateUserSchema }
