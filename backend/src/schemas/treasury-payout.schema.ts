import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class TreasuryPayout extends Document {
  @Prop({ required: true })
  projectId: number;

  @Prop({ required: true })
  totalDistributed: string;

  @Prop([{ type: String }])
  recipients: string[];

  @Prop()
  circleBatchId: string;

  @Prop({ default: Date.now })
  executedAt: Date;
}

export const TreasuryPayoutSchema = SchemaFactory.createForClass(TreasuryPayout);
