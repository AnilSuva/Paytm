import mongoose from "mongoose";
const { Schema, model } = mongoose;
mongoose.connect('mongodb+srv://suvaanil80_db_user:RZXcsJTYbcrRKtNL@cluster0.aap1dxu.mongodb.net/paytm');

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        miniLength: 3,
        maxLength: 30
    },
    password: {
        type: String,
        required: true,
        minLength: 6,
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
    }
},
    {
        timestamps: true
    }
);

const AccountSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    balance: {
        type: Number,
        required: true
    }
});

const TransactionSchema = new Schema({
    senderId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiverId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: true
    }
},{
    timestamps: true
});

export const User = model('User', UserSchema);
export const Account = model('Account', AccountSchema);
export const Transaction = model('Transaction', TransactionSchema);


