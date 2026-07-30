import express from "express";
import zod from 'zod'
import jwt from "jsonwebtoken";
import { Account, User } from "../db.js";
import authMiddleware from "../middleware/authMiddleware.js";
import bcrypt from 'bcrypt';
import cookieParser from 'cookie-parser';

const userRouter = express.Router();

const signupSchema = zod.object({
    username: zod.string().min(3).max(25),
    password: zod.string().min(3).max(25),
    firstName: zod.string().min(3).max(25),
    lastName: zod.string().min(3).max(25),
})

userRouter.get("/me", authMiddleware, async (req, res)=>{
    try{
        //@ts-ignore
        const user = await User.findOne({_id: req.userId});

        if(!user){
            return res.status(404).json({message: "User not found"});
        }

        res.json({
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username
        });
    } catch(error){
        res.status(500).json({message: "Error fetching user details"});
    }
})

userRouter.post("/signup", async (req, res) => {
    const body = req.body;
    const validData = signupSchema.safeParse(body);

    if(!validData.success){
        return res.status(411).json({ message: "Incorrect Inputs"});
    }

    const existingUser = await User.findOne({
        username: body.username
    });

    if (existingUser) {
        return res.status(411).json({ message: "Username already taken" });
    }

    const saltRound = 10;
    const hashPassword = await bcrypt.hash(body.password, saltRound);

    const dbUser = await User.create({
        username: body.username,
        password: hashPassword,
        firstName: body.firstName,
        lastName: body.lastName,
    });

    const account = await Account.create({
        userId: dbUser._id,
        balance: 1 + Math.random() * 10000
    });

    const token = jwt.sign({
        userId: dbUser._id
    }, process.env.JWT_SECRET as string, {expiresIn: '7d'});

    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(200).json({ 
        message: "User Created successfully",
    });
});


const signinSchema = zod.object({
    username: zod.string().min(3).max(25),
    password: zod.string().min(3).max(25),
});

userRouter.post("/signin", async (req, res) => {
    const body = req.body;
    const validData = signinSchema.safeParse(body);

    if(!validData.success){
        return res.status(411).json({ message: "Incorrect Inputs" });
    }

    const user = await User.findOne({
        username: body.username,
    });

    if(!user){
        return res.status(411).json({ message: "Invalid Credentials" });
    }

    const isPasswordValid = await bcrypt.compare(body.password, user.password);
    if (!isPasswordValid) {
        return res.status(411).json({ message: "Invalid Credentials" });
    }

    const token = jwt.sign({
        userId: user._id
    }, process.env.JWT_SECRET as string, {expiresIn: '7d'});

    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(200).json({
        message: "User Signed in successfully",
    });
});

userRouter.get("/bulk", async (req, res) => {
    const filter = (req.query.filter as string) || "";

    const users = await User.find({
        username: {$regex: filter, $options: "i"}
    });

    res.json({
        user: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })
});


// update user details
const updateBody = zod.object({
    password: zod.string().min(3).max(25).optional(),
    firstName: zod.string().min(3).max(25).optional(),
    lastName: zod.string().min(3).max(25).optional(),
});

userRouter.put("/update", authMiddleware, async (req, res) => {
    const body = req.body;
    const validData = updateBody.safeParse(body);

    if (!validData.success) {
        return res.status(411).json({ message: "Incorrect Inputs" });
    }

    if (body.password) {
        const saltRound = 10;
        body.password = await bcrypt.hash(body.password, saltRound);
    }
 
    // @ts-ignore
    await User.updateOne({ _id: req.userId }, body);

    res.json({
        message: "User Updated successfully"
    });
});

export default userRouter;