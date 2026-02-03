// ============================================================================
// PROFIT DISTRIBUTION SERVICE
// ============================================================================

import { 
  Connection, 
  PublicKey, 
  Transaction, 
  TransactionInstruction,
  SystemProgram
} from '@solana/web3.js';
import { getAssociatedTokenAddress, TOKEN_PROGRAM_ID } from '@solana/spl-token';

const PROGRAM_ID = new PublicKey('2oArywYY7xHyoV1xoF9g9QKkyKDHe3rA9kRyu1H8ZQxo');
const LLTY_MINT = new PublicKey('6UYrC72Xseu8bSrjZz5VUZ3aGo68MEqpNNyMgqqcfajf');
const USDC_MINT = new PublicKey('Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr');
const USDT_MINT = new PublicKey('Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr');

const RPC_ENDPOINT = 'https://devnet.helius-rpc.com/?api-key=8fd20322-0155-4b78-874f-837235298a26';

// PDAs
const getDistributionRegistryPDA = () => {
  const [pda] = PublicKey.findProgramAddressSync(
    [Buffer.from('distribution_registry')],
    PROGRAM_ID
  );
  return pda;
};

const getDistributionCyclePDA = (cycleId: number) => {
  const idBuffer = Buffer.alloc(8);
  idBuffer.writeBigUInt64LE(BigInt(cycleId));
  const [pda] = PublicKey.findProgramAddressSync(
    [Buffer.from('distribution_cycle'), idBuffer],
    PROGRAM_ID
  );
  return pda;
};

const getClaimRecordPDA = (cycleId: number, user: PublicKey) => {
  const idBuffer = Buffer.alloc(8);
  idBuffer.writeBigUInt64LE(BigInt(cycleId));
  const [pda] = PublicKey.findProgramAddressSync(
    [Buffer.from('claim_record'), idBuffer, user.toBuffer()],
    PROGRAM_ID
  );
  return pda;
};

const getDistributionAuthorityPDA = () => {
  const [pda] = PublicKey.findProgramAddressSync(
    [Buffer.from('distribution_authority')],
    PROGRAM_ID
  );
  return pda;
};

export interface DistributionCycle {
  id: number;
  quarter: number;
  year: number;
  description: string;
  totalProfitGross: number;
  totalDistributableAmount: number;
  totalClaimed: number;
  totalClaimants: number;
  tokenType: 'USDC' | 'USDT' | 'SOL';
  status: 'pending' | 'active' | 'finalized';
  snapshotTimestamp: number;
  claimStartTime: number;
  claimEndTime: number;
  merkleRoot: string | null;
  propertyAddress?: string;
  propertyValue?: number;
  rentalYieldBps?: number;
}

export interface ClaimInfo {
  cycleId: number;
  claimable: boolean;
  amount: number;
  claimed: boolean;
  claimedAt?: number;
}

class ProfitDistributionService {
  connection: Connection;

  constructor() {
    this.connection = new Connection(RPC_ENDPOINT, 'confirmed');
  }

  // Check if registry is initialized
  async isRegistryInitialized(): Promise<boolean> {
    try {
      const registryPda = getDistributionRegistryPDA();
      const account = await this.connection.getAccountInfo(registryPda);
      return account !== null;
    } catch (e) {
      return false;
    }
  }

  // Get registry info
  async getRegistryInfo(): Promise<any> {
    try {
      const registryPda = getDistributionRegistryPDA();
      const account = await this.connection.getAccountInfo(registryPda);
      
      if (!account) {
        return null;
      }

      // Parse registry data (skip 8-byte discriminator)
      const data = account.data;
      const view = new DataView(data.buffer, data.byteOffset);
      
      return {
        address: registryPda.toString(),
        authority: new PublicKey(data.slice(8, 40)).toString(),
        totalCycles: Number(view.getBigUint64(40, true)),
        totalDistributed: Number(view.getBigUint64(48, true)) / 1e6,
        isActive: data[56] === 1
      };
    } catch (e) {
      console.error('Error getting registry info:', e);
      return null;
    }
  }

  // Get all distribution cycles
  async getAllCycles(): Promise<DistributionCycle[]> {
    try {
      const registry = await this.getRegistryInfo();
      if (!registry) return [];

      const cycles: DistributionCycle[] = [];
      
      for (let i = 1; i <= registry.totalCycles; i++) {
        try {
          const cycle = await this.getCycleInfo(i);
          if (cycle) {
            cycles.push(cycle);
          }
        } catch (e) {
          console.warn(`Could not fetch cycle ${i}`);
        }
      }

      return cycles;
    } catch (e) {
      console.error('Error getting cycles:', e);
      return [];
    }
  }

  // Get specific cycle info
  async getCycleInfo(cycleId: number): Promise<DistributionCycle | null> {
    try {
      const cyclePda = getDistributionCyclePDA(cycleId);
      const account = await this.connection.getAccountInfo(cyclePda);
      
      if (!account) return null;

      const data = account.data;
      const view = new DataView(data.buffer, data.byteOffset);
      
      // Parse cycle data (simplified - adjust based on actual struct)
      let offset = 8; // Skip discriminator
      
      const id = Number(view.getBigUint64(offset, true)); offset += 8;
      const quarter = Number(view.getBigUint64(offset, true)); offset += 8;
      
      // Calculate year from quarter
      const year = Math.floor(quarter / 4) + 2024;
      
      return {
        id,
        quarter: (quarter % 4) + 1,
        year,
        description: `Q${(quarter % 4) + 1} ${year} Distribution`,
        totalProfitGross: Number(view.getBigUint64(offset + 8, true)) / 1e6,
        totalDistributableAmount: Number(view.getBigUint64(offset + 16, true)) / 1e6,
        totalClaimed: Number(view.getBigUint64(offset + 24, true)) / 1e6,
        totalClaimants: Number(view.getBigUint64(offset + 32, true)),
        tokenType: 'USDC',
        status: 'active',
        snapshotTimestamp: Date.now() - 86400000,
        claimStartTime: Date.now() - 86400000,
        claimEndTime: Date.now() + 86400000 * 90,
        merkleRoot: null
      };
    } catch (e) {
      console.error('Error getting cycle info:', e);
      return null;
    }
  }

  // Check if user can claim from a cycle
  async getUserClaimInfo(walletAddress: string, cycleId: number): Promise<ClaimInfo> {
    try {
      const userPubkey = new PublicKey(walletAddress);
      const claimRecordPda = getClaimRecordPDA(cycleId, userPubkey);
      
      const account = await this.connection.getAccountInfo(claimRecordPda);
      
      if (account) {
        // User has already claimed
        const view = new DataView(account.data.buffer, account.data.byteOffset);
        const claimedAmount = Number(view.getBigUint64(16, true)) / 1e6;
        const claimedAt = Number(view.getBigInt64(24, true)) * 1000;
        
        return {
          cycleId,
          claimable: false,
          amount: claimedAmount,
          claimed: true,
          claimedAt
        };
      }

      // User hasn't claimed - would need merkle proof to determine amount
      // For now, return not claimable (needs backend to generate merkle proof)
      return {
        cycleId,
        claimable: false,
        amount: 0,
        claimed: false
      };
    } catch (e) {
      console.error('Error getting claim info:', e);
      return {
        cycleId,
        claimable: false,
        amount: 0,
        claimed: false
      };
    }
  }

  // Get user's LLTY balance at snapshot (for UI display)
  async getUserLLTYBalance(walletAddress: string): Promise<number> {
    try {
      const userPubkey = new PublicKey(walletAddress);
      const tokenAccount = await getAssociatedTokenAddress(LLTY_MINT, userPubkey);
      const balance = await this.connection.getTokenAccountBalance(tokenAccount);
      return parseFloat(balance.value.uiAmount?.toString() || '0');
    } catch (e) {
      return 0;
    }
  }

  // Estimate user's share of distribution
  estimateUserShare(userBalance: number, totalSupply: number, distributionAmount: number): number {
    if (totalSupply === 0) return 0;
    return (userBalance / totalSupply) * distributionAmount;
  }
}

const profitDistributionService = new ProfitDistributionService();
export default profitDistributionService;
