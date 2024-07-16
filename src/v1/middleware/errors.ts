import { NextFunction, Request, Response } from "express";

export const genericErrorHandler = (
  err: { status: number, data: string },
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (!isNaN(err.status) && err.status < 500) {
    return res.status(err.status).send(err.data);
  }

  res.status(500).send({ errors: [{ message: "Something went wrong" }] });
};
