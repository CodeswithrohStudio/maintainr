import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class YellowSession extends Document {
  @Prop({ required: true })
  projectId: number;

  @Prop({ required: true })
  sessionId: string;

  @Prop({ required: true })
  donorAddress: string;

  @Prop({ required: true })
  totalAmount: string;

  @Prop({ enum: ["open", "settled"], default: "open" })
  status: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const YellowSessionSchema = SchemaFactory.createForClass(YellowSession);
export type YellowSessionDocument = YellowSession & Document;
