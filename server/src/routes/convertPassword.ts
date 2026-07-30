import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { User } from "../db.js";
import dotenv from "dotenv";

dotenv.config();

async function convertPasswords() {
    try {
        console.log("Starting password conversion...");
        const users = await User.find({});
        let convertedCount = 0;

        for (const user of users) {
            // bcrypt hashes usually start with $2b$, $2a$, or $2y$. If it doesn't, we assume it's plain text.
            if (!user.password.startsWith("$2b$") && !user.password.startsWith("$2a$") && !user.password.startsWith("$2y$")) {
                const saltRound = 10;
                const hashedPassword = await bcrypt.hash(user.password, saltRound);
                user.password = hashedPassword;
                await user.save();
                convertedCount++;
                console.log(`Converted password for user: ${user.username}`);
            }
        }

        console.log(`Finished converting ${convertedCount} passwords.`);
        process.exit(0);
    } catch (error) {
        console.error("Error during password conversion:", error);
        process.exit(1);
    }
}

convertPasswords();
