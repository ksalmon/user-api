import { Request, Response, NextFunction, Router } from "express";
import { validationMiddleware } from "../../middleware/validations";
import { CreateUserSchema, UpdateUserSchema } from "./user.schema";
import { UserService } from "./user.service";

const router = Router();
const userService = new UserService();

router.get(
  "/:userId",
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    try {
      const user = await userService.find(userId);
      res.status(200).send(user);
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  "/",
  validationMiddleware(CreateUserSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    const { body } = req;
    try {
      const newUser = await userService.create(body);
      res.status(201).send(newUser);
    } catch (err) {
      next(err);
    }
  }
);

router.put(
  "/:userId",
  validationMiddleware(UpdateUserSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    const { body } = req;
    try {
      const updatedUser = await userService.update(userId, body);
      res.status(200).send(updatedUser);
    } catch (err) {
      next(err);
    }
  }
);

router.delete(
  "/:userId",
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;

    try {
      await userService.delete(userId);
      res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  }
);

export { router as UserController };
