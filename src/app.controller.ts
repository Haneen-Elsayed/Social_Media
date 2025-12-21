import express, {
  type Express,
  type Request,
  type Response,
  type NextFunction,
} from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import path from "node:path";
import { config } from "dotenv";

import authRouter from "./Modules/Auth/auth.controller";

config({ path: path.resolve("./config/.env.dev") });

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  message: {
    status: 429,
    message: "Too Many Requests, Please try again later",
  },
});

export const bootstrap = () => {
  const app: Express = express();
  const port: number = Number(process.env.PORT) || 5000;

  /* Middlewares */
  app.use(cors());
  app.use(express.json());
  app.use(helmet());
  app.use(limiter);

  /* Routes */
  app.use("/api/v1/auth", authRouter);

  app.use((_req: Request, res: Response) => {
    res.status(404).json({ message: "Not Found Handler" });
  });

  /*  Error Handler */
  app.use(
    (err: Error, _req: Request, res: Response, _next: NextFunction) => {
      return res.status(500).json({
        message: err.message || "Something went wrong",
        stack: err.stack,
        casue: err.cause,
      });
    }
  );

  app.listen(port, () => {
    console.log(`Server is Running on http://localhost:${port}`);
  });
};


