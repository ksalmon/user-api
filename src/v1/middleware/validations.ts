import { Request, Response, NextFunction } from "express";
import { ObjectSchema } from "@hapi/joi";

export const validationMiddleware =
  (validationSchema: ObjectSchema<any>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const { value, error } = validationSchema.validate(req.body, {
      abortEarly: false,
      allowUnknown: false,
      stripUnknown: true,
    });

    if (error) {
      return res
        .status(400)
        .send({ errors: error.details.map((err) => err.message) });
    }

    req.body = value;
    next();
  };
