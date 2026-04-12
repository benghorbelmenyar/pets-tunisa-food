import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Role } from '../entities/role.enum';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
    @Prop({ required: true })
    firstName!: string;

    @Prop({ required: true })
    lastName!: string;

    @Prop({ required: true, unique: true })
    email!: string;

    @Prop({ required: true })
    passwordHash!: string;

    @Prop({ type: String, enum: Role, default: Role.CLIENT })
    role!: Role;

    @Prop({ type: String, default: null })
    resetCode!: string | null;

    @Prop({ type: Date, default: null })
    resetCodeExpiry!: Date | null;
}

export const UserSchema = SchemaFactory.createForClass(User);