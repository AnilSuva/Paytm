import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import mongoose from 'mongoose';
import { Account, Transaction } from '../db.js';
import zod from 'zod';

const router = express.Router();

router.get("/balance", authMiddleware, async (req, res) => {
    try {
        //@ts-ignore
        const account = await Account.findOne({ userId: req.userId });

        if (!account) {
            return res.status(400).json({ message: "Account not found" });
        }

        res.json({ balance: account.balance });
    } catch (error) {
        res.status(500).json({ message: "Server error fetching balance" });
    }
});

const transferSchema = zod.object({
    to: zod.string(),
    amount: zod.number()
});

router.post("/transfer", authMiddleware, async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { amount, to } = req.body;
        
        const validData = transferSchema.safeParse({ amount, to });

        if (!validData.success) {
            return res.status(411).json({ message: "Invalid inputs" });
        }

        // Fetch the accounts within the transaction
        //@ts-ignore
        const fromAccount = await Account.findOne({ userId: req.userId }).session(session);
        
        if (!fromAccount) {
            await session.abortTransaction();
            return res.status(400).json({ message: "Invalid account" });
        }

        if (fromAccount.balance < amount) {
            await session.abortTransaction();
            return res.status(400).json({ message: "Insufficient balance" });
        }
        
        const toAccount = await Account.findOne({ userId: to }).session(session);

        if (!toAccount) {
            await session.abortTransaction();
            return res.status(400).json({ message: "Invalid receiving account" });
        }

        // $inc for safe, atomic math operations at the database level
        await Account.updateOne(
            //@ts-ignore
            { userId: req.userId }, 
            { $inc: { balance: -amount } }
        ).session(session);
        
        await Account.updateOne(
            { userId: to }, 
            { $inc: { balance: amount } }
        ).session(session);

        await Transaction.create([{
            //@ts-ignore
            senderId: req.userId,
            receiverId: to,
            amount: amount
        }],{session: session})

        // Commit the transfer
        await session.commitTransaction();
        res.json({ message: "Transfer successful" });

    } catch (error) {
        await session.abortTransaction();
        res.status(500).json({ message: "Transfer failed due to an internal error" });
    } finally {
        session.endSession();
    }
});

router.get("/recent-contacts", authMiddleware, async(req, res)=>{
    try{
        //@ts-ignore
        const userId = req.userId;

        const transaction = await Transaction.find({senderId: userId})
            .sort({createdAt: -1})
            .populate('receiverId', 'firstName lastName username _id')
            .limit(30);

        const recentContanctsMap = new Map();

        transaction.forEach(t=>{
            const receiver: any = t.receiverId;
            if(receiver && !recentContanctsMap.has(receiver._id.toString())){
                recentContanctsMap.set(receiver._id.toString(), receiver);
            }
        });

        const recentContacts = Array.from(recentContanctsMap.values());

        res.json({recentContacts});
    }catch(e) {
        res.status(500).json({message: "Error fetching recent contacts"});
    }
});

export default router;