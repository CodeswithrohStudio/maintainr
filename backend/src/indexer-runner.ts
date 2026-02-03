import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { IndexerCLI } from './indexer/indexer.cli';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  
  const indexerCLI = app.get(IndexerCLI);
  await indexerCLI.start();
  
  await app.close();
}

bootstrap().catch(console.error);
