import { Request, Response, NextFunction, Router } from 'express';

const router = Router();

router.get('/', (_req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(200).json({
      status: "Service is available",
      now: new Date()
    });
  } catch (e) {
    next(e);
  }
});
export { router as HealthController };
