import express, { Request, Response } from "express";
import userRoutes from "./routes/user/userRoutes";

const app = express();
app.use(express.json());
app.use("/api/users", userRoutes);

app.get("/api/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "ok" });
});

export default app;
