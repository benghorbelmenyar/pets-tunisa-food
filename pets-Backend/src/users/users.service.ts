import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email, password, firstName, lastName, role } = createUserDto;

    const existing = await this.userModel.findOne({ email }).exec();
    if (existing) {
      throw new ConflictException('User with this email already exists');
    }

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new this.userModel({
      email,
      passwordHash,
      firstName,
      lastName,
      role,
    });

    return newUser.save();
  }

  async findAll(): Promise<UserDocument[]> {
    return this.userModel.find().select('-passwordHash').exec();
  }

  async findOneByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).exec();
  }
  // Ajoutez dans users.service.ts

  async setResetCode(email: string, code: string, expiry: Date) {
    return this.userModel.findOneAndUpdate(
      { email },
      { resetCode: code, resetCodeExpiry: expiry },
      { returnDocument: 'after' }
      ,
    );
  }



  async updatePassword(email: string, newPasswordHash: string) {
    return this.userModel.findOneAndUpdate(
      { email },
      {
        passwordHash: newPasswordHash,
        resetCode: null,
        resetCodeExpiry: null,
      },
      { returnDocument: 'after' }
      ,
    );
  }
}
