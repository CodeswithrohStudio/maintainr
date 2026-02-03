import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project, ProjectDocument } from '../schemas/project.schema';
import { createPublicClient, http, parseAbi } from 'viem';
import { baseSepolia } from 'viem/chains';

@Injectable()
export class ProjectsService {
  constructor(@InjectModel(Project.name) private projectModel: Model<ProjectDocument>) {}

  async create(projectData: Partial<Project>): Promise<Project> {
    const project = new this.projectModel(projectData);
    return project.save();
  }

  async registerProject(data: {
    ownerId: string;
    githubRepoUrl: string;
    recipients: string[];
    splits: number[];
    ensName?: string;
  }) {
    // First register on-chain
    const projectIdOnchain = await this.registerOnChain(data);

    // Then save to database
    const project = await this.create({
      ...data,
      projectIdOnchain,
    });

    return project;
  }

  private async registerOnChain(data: {
    githubRepoUrl: string;
    recipients: string[];
    splits: number[];
    ensName?: string;
  }) {
    // TODO: Implement smart contract interaction
    // For now, return a mock project ID
    return Math.floor(Math.random() * 1000000);
  }

  async findByOwnerId(ownerId: string): Promise<Project[]> {
    return this.projectModel.find({ ownerId }).exec();
  }

  async findByHandle(handle: string): Promise<Project | null> {
    // Extract handle from github repo URL or match by ensName
    return this.projectModel
      .findOne({
        $or: [
          { githubRepoUrl: { $regex: handle, $options: 'i' } },
          { ensName: handle },
        ],
      })
      .populate('ownerId')
      .exec();
  }

  async findById(id: string): Promise<Project | null> {
    return this.projectModel.findById(id).exec();
  }
}
