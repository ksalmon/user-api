const express = require("express");
import helmet from "helmet";
import { v1Routes } from "./v1/routes";
import { errorHandler } from "./v1/middleware/errors";

const app = express();
app.use(express.json());
app.use(helmet());

app.use("/api/v1", v1Routes);

app.use(errorHandler);
export { app };
