import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProjectDocument = Project & Document;

@Schema()
export class Project extends Document {
  @Prop({ required: true })
  walletAddress: string;

  @Prop({ required: true })
  projectName: string;

  @Prop()
  bio: string;

  @Prop()
  githubUrl: string;

  @Prop()
  twitterUrl: string;

  @Prop()
  websiteUrl: string;

  @Prop()
  projectIdOnchain: number;

  @Prop([{ type: String }])
  recipients: string[];

  @Prop([{ type: Number }])
  splits: number[];

  @Prop()
  ensName: string;

  @Prop()
  treasuryAddress: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  // Legacy field for backward compatibility
  @Prop()
  ownerId: string;

  @Prop()
  githubRepoUrl: string;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
