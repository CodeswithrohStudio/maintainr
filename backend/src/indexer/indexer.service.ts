import { Injectable, Logger } from '@nestjs/common';
import { createPublicClient, http, parseAbi, formatUnits } from 'viem';
import { baseSepolia } from 'viem/chains';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Donation, DonationDocument } from '../schemas/donation.schema';
import { YellowSession, YellowSessionDocument } from '../schemas/yellow-session.schema';

@Injectable()
export class IndexerService {
  private readonly logger = new Logger(IndexerService.name);
  private client: any;
  private registryAbi: any;
  private donateAbi: any;
  private yellowSettlementAbi: any;

  constructor(
    @InjectModel(Donation.name) private donationModel: Model<DonationDocument>,
    @InjectModel(YellowSession.name) private yellowSessionModel: Model<YellowSessionDocument>,
  ) {
    this.client = createPublicClient({
      chain: baseSepolia,
      transport: http(process.env.BASE_SEPOLIA_RPC),
    });

    this.registryAbi = parseAbi([
      'event ProjectRegistered(uint256 indexed projectId, address indexed owner, string githubRepoUrl, address[] recipients, uint256[] splits)',
    ]);

    this.donateAbi = parseAbi([
      'event Donated(uint256 indexed projectId, address indexed donor, uint256 amount, string message)',
    ]);

    this.yellowSettlementAbi = parseAbi([
      'event SessionSettled(uint256 indexed sessionId, address indexed donor, address indexed recipient, uint256 amount, string message)',
    ]);
  }

  async startIndexing() {
    this.logger.log('Starting event indexer...');
    
    // Start indexing from the latest block
    const latestBlock = await this.client.getBlockNumber();
    this.logger.log(`Starting from block: ${latestBlock}`);

    // Index historical events
    await this.indexHistoricalEvents();

    // Start polling for new events (simpler approach)
    this.startEventPolling();

    this.logger.log('Event indexer started successfully');
  }

  private async indexHistoricalEvents() {
    this.logger.log('Indexing historical events...');
    
    const fromBlock = BigInt(0); // Start from genesis
    const toBlock = await this.client.getBlockNumber();

    await Promise.all([
      this.indexDonationEvents(fromBlock, toBlock),
      this.indexYellowSessionEvents(fromBlock, toBlock),
    ]);

    this.logger.log('Historical events indexed');
  }

  private async indexDonationEvents(fromBlock: bigint, toBlock: bigint) {
    try {
      const donateAddress = process.env.DONATE_ADDRESS as `0x${string}`;
      
      const events = await this.client.getLogs({
        address: donateAddress,
        events: [this.donateAbi[1]], // Donated event
        fromBlock,
        toBlock,
      });

      this.logger.log(`Found ${events.length} donation events`);

      for (const event of events) {
        await this.processDonationEvent(event);
      }
    } catch (error) {
      this.logger.error('Error indexing donation events:', error);
    }
  }

  private async indexYellowSessionEvents(fromBlock: bigint, toBlock: bigint) {
    try {
      const yellowSettlementAddress = process.env.YELLOW_SETTLEMENT_ADDRESS as `0x${string}`;
      
      const events = await this.client.getLogs({
        address: yellowSettlementAddress,
        events: [this.yellowSettlementAbi[1]], // SessionSettled event
        fromBlock,
        toBlock,
      });

      this.logger.log(`Found ${events.length} Yellow session events`);

      for (const event of events) {
        await this.processYellowSessionEvent(event);
      }
    } catch (error) {
      this.logger.error('Error indexing Yellow session events:', error);
    }
  }

  private async processDonationEvent(event: any) {
    try {
      const { args, blockNumber, transactionHash } = event;
      
      // Check if already indexed
      const existing = await this.donationModel.findOne({ txHash: transactionHash });
      if (existing) return;

      const block = await this.client.getBlock({ blockNumber });
      
      const donation = new this.donationModel({
        projectId: args.projectId.toString(),
        donorAddress: args.donor,
        donorENS: null, // Will be resolved later
        amount: formatUnits(args.amount, 6), // USDC has 6 decimals
        message: args.message,
        txHash: transactionHash,
        blockNumber: blockNumber.toString(),
        timestamp: new Date(Number(block.timestamp) * 1000),
        source: 'onchain',
      });

      await donation.save();
      this.logger.log(`Indexed donation: ${transactionHash}`);
    } catch (error) {
      this.logger.error('Error processing donation event:', error);
    }
  }

  private async processYellowSessionEvent(event: any) {
    try {
      const { args, blockNumber, transactionHash } = event;
      
      // Check if already indexed
      const existing = await this.yellowSessionModel.findOne({ txHash: transactionHash });
      if (existing) return;

      const block = await this.client.getBlock({ blockNumber });
      
      const session = new this.yellowSessionModel({
        sessionId: args.sessionId.toString(),
        donorAddress: args.donor,
        recipientAddress: args.recipient,
        amount: formatUnits(args.amount, 6),
        message: args.message,
        txHash: transactionHash,
        blockNumber: blockNumber.toString(),
        timestamp: new Date(Number(block.timestamp) * 1000),
        status: 'settled',
      });

      await session.save();
      this.logger.log(`Indexed Yellow session: ${transactionHash}`);
    } catch (error) {
      this.logger.error('Error processing Yellow session event:', error);
    }
  }

  private startEventPolling() {
    this.logger.log('Starting event polling...');
    
    // Poll every 30 seconds for new events
    setInterval(async () => {
      try {
        const latestBlock = await this.client.getBlockNumber();
        const fromBlock = latestBlock - 10n; // Check last 10 blocks
        
        await Promise.all([
          this.indexDonationEvents(fromBlock, latestBlock),
          this.indexYellowSessionEvents(fromBlock, latestBlock),
        ]);
      } catch (error) {
        this.logger.error('Error in event polling:', error);
      }
    }, 30000); // 30 seconds

    this.logger.log('Event polling started');
  }

  async resolveENSNames() {
    this.logger.log('Resolving ENS names for indexed donations...');
    
    const donationsWithoutENS = await this.donationModel.find({
      donorENS: null,
      donorAddress: { $ne: null },
    });

    for (const donation of donationsWithoutENS) {
      try {
        // This would use the ENS service - for now just skip
        // await this.ensService.resolveAddress(donation.donorAddress);
      } catch (error) {
        this.logger.error(`Error resolving ENS for ${donation.donorAddress}:`, error);
      }
    }

    this.logger.log('ENS resolution completed');
  }

  async getDonationStats() {
    const totalDonations = await this.donationModel.countDocuments();
    const totalAmount = await this.donationModel.aggregate([
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const yellowSessions = await this.yellowSessionModel.countDocuments();

    return {
      totalDonations,
      totalAmount: totalAmount[0]?.total || 0,
      yellowSessions,
    };
  }
}
