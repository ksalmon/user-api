import express from "express";
import { HealthController } from "./entities/health/health.controller"
import { UserController } from "./entities/user/user.controller";

const router = express.Router();
router.use("/health", HealthController);
router.use("/users", UserController);

export { router as v1Routes };
