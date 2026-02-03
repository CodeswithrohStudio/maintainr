import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProjectDocument = Project & Document;

@Schema()
export class Project extends Document {
  @Prop({ required: true })
  ownerId: string;

  @Prop({ required: true })
  githubRepoUrl: string;

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
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
