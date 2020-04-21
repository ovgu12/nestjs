import * as mongoose from 'mongoose';

export const CustomerSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    createdAt: { type: Date, default: Date.now }
})