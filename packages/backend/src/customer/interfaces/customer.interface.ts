import { Document } from 'mongoose';

export interface Customer extends Document {
    readonly firstName: string;
    readonly lastName: string;
    readonly email: string;
    readonly createdAt: Date;
}