import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../schemas/user.schema';
import { Project, ProjectSchema } from '../schemas/project.schema';
import { Donation, DonationSchema } from '../schemas/donation.schema';
import { YellowSession, YellowSessionSchema } from '../schemas/yellow-session.schema';
import { TreasuryPayout, TreasuryPayoutSchema } from '../schemas/treasury-payout.schema';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/maintainr'),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Project.name, schema: ProjectSchema },
      { name: Donation.name, schema: DonationSchema },
      { name: YellowSession.name, schema: YellowSessionSchema },
      { name: TreasuryPayout.name, schema: TreasuryPayoutSchema },
    ]),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}
