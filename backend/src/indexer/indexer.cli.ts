import { IndexerService } from './indexer.service';

export class IndexerCLI {
  constructor(private readonly indexerService: IndexerService) {}

  async start() {
    console.log('🚀 Starting Maintainr Event Indexer...');
    await this.indexerService.startIndexing();
    console.log('✅ Event indexer started successfully!');
  }
}
