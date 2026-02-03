import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(userData: Partial<User>): Promise<User> {
    const user = new this.userModel(userData);
    return user.save();
  }

  async findByGithubId(githubId: string): Promise<User | null> {
    return this.userModel.findOne({ githubId }).exec();
  }

  async findOrCreate(userData: { githubId: string; handle: string; walletAddress?: string; ensName?: string }): Promise<User> {
    let user = await this.findByGithubId(userData.githubId);
    
    if (!user) {
      user = await this.create(userData);
    } else {
      // Update existing user with new data
      Object.assign(user, userData);
      await user.save();
    }
    
    return user;
  }

  async findById(id: string): Promise<User | null> {
    return this.userModel.findById(id).exec();
  }

  async updateWalletAddress(userId: string, walletAddress: string): Promise<User | null> {
    return this.userModel.findByIdAndUpdate(
      userId,
      { walletAddress },
      { new: true }
    ).exec();
  }

  async updateENSName(userId: string, ensName: string): Promise<User | null> {
    return this.userModel.findByIdAndUpdate(
      userId,
      { ensName },
      { new: true }
    ).exec();
  }
}
