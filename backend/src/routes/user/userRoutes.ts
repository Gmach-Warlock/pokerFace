import { Router, Request, Response } from "express";

const router = Router();

router.post("/register", (req: Request, res: Response) => {
  const { username, email } = req.body;

  // For now, we "mock" the database save.
  // We will connect Prisma here in the Refactor phase.
  res.status(201).json({
    id: 1,
    username,
    email,
    xp: 0,
    level: 1,
  });
});

export default router;
