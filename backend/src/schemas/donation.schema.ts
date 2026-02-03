import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Donation extends Document {
  @Prop({ required: true })
  projectId: number;

  @Prop({ required: true })
  donorAddress: string;

  @Prop()
  donorENS: string;

  @Prop({ required: true })
  amount: string;

  @Prop()
  message: string;

  @Prop()
  txHash: string;

  @Prop({ default: Date.now })
  timestamp: Date;

  @Prop({ enum: ["onchain", "yellow"], default: "onchain" })
  source: string;
}

export const DonationSchema = SchemaFactory.createForClass(Donation);
