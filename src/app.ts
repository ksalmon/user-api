import express, { json } from 'express';
import helmet from 'helmet';
import { v1Routes } from './v1/routes';

const app = express();
app.use(json());
app.use(helmet());

app.use("/api/v1", v1Routes)
export { app };
