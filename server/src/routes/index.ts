import express from "express";
import userRouter from "./userRouter.js";
import accountRouter from "./account.js";

const router = express.Router();

router.use("/user", userRouter);
router.use("/account", accountRouter);

export default router;