import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";

export interface CustomRequest extends Request {
    userId?: string;
}

export default function authMiddleware(req: CustomRequest, res: Response, next: NextFunction){
    const token = req.cookies.token;

    if(!token){
        return res.status(403).json({
            message: "Authorization token is required"
        });
    }

    try {
        const decoded = jwt.verify(token as string, process.env.JWT_SECRET as string);
        // @ts-ignore
        req.userId = decoded.userId as string;
        next();
    } catch (error) {
        return res.status(403).json({
            message: "Invalid token"
        });
    }
}
