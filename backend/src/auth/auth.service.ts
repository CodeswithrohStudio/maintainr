import { Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async githubLogin(req: Request, res: Response) {
    // GitHub OAuth will be handled by passport strategy
    return { message: 'GitHub OAuth initiated' };
  }

  async githubCallback(req: Request, res: Response) {
    const user = req.user as any;
    
    if (!user) {
      return res.status(400).json({ error: 'Authentication failed' });
    }

    // Find or create user in database
    const dbUser = await this.usersService.findOrCreate({
      githubId: user.id,
      handle: user.username,
      walletAddress: user.walletAddress || null,
      ensName: user.ensName || null,
    });

    // Generate JWT token
    const token = this.jwtService.sign({
      sub: dbUser._id,
      githubId: dbUser.githubId,
      handle: dbUser.handle,
    });

    // Return token and user data
    return res.json({
      token,
      user: {
        _id: dbUser._id,
        githubId: dbUser.githubId,
        handle: dbUser.handle,
        walletAddress: dbUser.walletAddress,
        ensName: dbUser.ensName,
        createdAt: dbUser.createdAt,
      }
    });
  }

  async validateUser(githubId: string): Promise<any> {
    return this.usersService.findByGithubId(githubId);
  }
}
