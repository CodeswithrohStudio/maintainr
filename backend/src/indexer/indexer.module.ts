import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { IndexerController } from './indexer.controller';
import { IndexerService } from './indexer.service';
import { IndexerCLI } from './indexer.cli';
import { Donation, DonationSchema } from '../schemas/donation.schema';
import { YellowSession, YellowSessionSchema } from '../schemas/yellow-session.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Donation.name, schema: DonationSchema },
      { name: YellowSession.name, schema: YellowSessionSchema },
    ]),
  ],
  controllers: [IndexerController],
  providers: [IndexerService, IndexerCLI],
  exports: [IndexerService, IndexerCLI],
})
export class IndexerModule {}
