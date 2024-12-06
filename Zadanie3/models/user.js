import mongoose from "mongoose";
const { Schema } = mongoose;

const UserSchema = new Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    role: {
        type: String,
        enum: ['KLIENT', 'PRACOWNIK'],
        required: [true, 'User role is required'],
    }
})

export const User = mongoose.model('User', UserSchema);