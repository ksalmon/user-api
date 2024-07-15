import { Request, Response, NextFunction, Router } from "express";
import { validationMiddleware } from "../../middleware/validations";
import { CreateUserSchema, UpdateUserSchema } from "./user.schema";
import { UserService } from "./user.service";

const router = Router();
const userService = new UserService();

router.get("/:userId", (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;
  userService
    .find(userId)
    .then((data) => {
      if (!data) {
        res.sendStatus(404);
      } else {
        res.status(200).send(data);
      }
    })
    .catch((err) => {
      if (!isNaN(err.status) && err.status < 500) {
        res.status(err.status).send(err.data);
      } else {
        next(err);
      }
    });
});

router.post(
  "/",
  validationMiddleware(CreateUserSchema),
  (req: Request, res: Response, next: NextFunction) => {
    userService
      .create(req.body)
      .then((data) => {
        if (!data) {
          res.sendStatus(404);
        } else {
          res.status(201).send(data);
        }
      })
      .catch((err) => {
        if (!isNaN(err.status) && err.status < 500) {
          res.status(err.status).send(err.data);
        } else {
          next(err);
        }
      });
  }
);

router.put(
  "/:userId",
  validationMiddleware(UpdateUserSchema),
  (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    userService
      .update(userId, req.body)
      .then((data) => {
        if (!data) {
          res.sendStatus(404);
        } else {
          res.status(200).send(data);
        }
      })
      .catch((err) => {
        if (!isNaN(err.status) && err.status < 500) {
          res.status(err.status).send(err.data);
        } else {
          next(err);
        }
      });
  }
);

router.delete("/:userId", (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;
  userService
    .delete(userId)
    .then(({ success }) => {
      if (success) {
        res.sendStatus(204);
      } else {
        res.sendStatus(404);
      }
    })
    .catch((err) => {
      if (!isNaN(err.status) && err.status < 500) {
        res.status(err.status).send(err.data);
      } else {
        next(err);
      }
    });
});

export { router as UserController };
