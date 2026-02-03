// ============================================================================
// REAL STAKING SERVICE - PRODUCTION READY
// ============================================================================
// NO MORE MOCKS - Real transaction building for staking
// Matches Rust program exactly
// ============================================================================

import {
  Connection,
  PublicKey,
  Transaction,
  TransactionInstruction,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
} from '@solana/web3.js';
import {
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
} from '@solana/spl-token';
import { BN } from '@coral-xyz/anchor';
import {
  BLOCKCHAIN_CONFIG,
  getBuyerDataPDA,
  getPresaleAuthorityPDA,
  getStakingDataPDA,
  getStakingPoolPDA,
} from '../config/blockchain-config';

// ============================================================================
// TYPES
// ============================================================================
export type StakeDuration = '6months' | '1year' | '2years' | '3years';

interface StakeTokensParams {
  userPublicKey: PublicKey;
  amount: number; // In LLTY tokens
  duration: StakeDuration;
  connection: Connection;
}

interface StakingInfo {
  isActive: boolean;
  amountStaked: number;
  duration: StakeDuration;
  apyRate: number;
  stakeStartTime: number;
  lockEndTime: number;
  pendingRewards: number;
  totalRewardsClaimed: number;
  isUnlocked: boolean;
  daoEligible: boolean;
}

// ============================================================================
// DISCRIMINATORS (from Anchor IDL)
// ============================================================================
const DISCRIMINATORS = {
  STAKE_TOKENS: Buffer.from([136, 126, 91, 162, 40, 131, 13, 127]),
  CLAIM_REWARDS: Buffer.from([4, 144, 132, 71, 116, 23, 151, 80]),
  UNSTAKE_TOKENS: Buffer.from([58, 119, 215, 143, 203, 223, 32, 86]),
};

// ============================================================================
// DURATION ENUM MAPPING
// ============================================================================
const DURATION_ENUM = {
  '6months': 0,
  '1year': 1,
  '2years': 2,
  '3years': 3,
};

// ============================================================================
// GET STAKING INFO
// ============================================================================
export const getStakingInfo = async (
  userPublicKey: PublicKey,
  connection: Connection
): Promise<StakingInfo | null> => {
  try {
    const [stakingDataPda] = getStakingDataPDA(userPublicKey);
    const accountInfo = await connection.getAccountInfo(stakingDataPda);
    if (!accountInfo) {
      return null;
    }

    const data = accountInfo.data;
    
    // Skip 8-byte discriminator
    let offset = 8;
    
    // user: Pubkey (32 bytes) - skip
    offset += 32;
    
    // amount_staked: u64 (8 bytes)
    const amountStaked = Number(data.readBigUInt64LE(offset));
    offset += 8;
    
    // duration: u8 (1 byte)
    const durationByte = data.readUInt8(offset);
    offset += 1;
    
    // apy_rate: u64 (8 bytes)
    const apyRate = Number(data.readBigUInt64LE(offset));
    offset += 8;
    
    // stake_start_time: i64 (8 bytes)
    const stakeStartTime = Number(data.readBigInt64LE(offset));
    offset += 8;
    
    // lock_end_time: i64 (8 bytes)
    const lockEndTime = Number(data.readBigInt64LE(offset));
    offset += 8;
    
    // last_reward_claim_time: i64 (8 bytes)
    offset += 8;
    
    // total_rewards_earned: u64 (8 bytes)
    offset += 8;
    
    // total_rewards_claimed: u64 (8 bytes)
    const totalRewardsClaimed = Number(data.readBigUInt64LE(offset));
    offset += 8;
    
    // pending_rewards: u64 (8 bytes)
    const pendingRewards = Number(data.readBigUInt64LE(offset));
    offset += 8;
    
    // is_active: bool (1 byte)
    const isActive = data.readUInt8(offset) === 1;
    offset += 1;
    
    // is_locked: bool (1 byte)
    const isLocked = data.readUInt8(offset) === 1;
    offset += 1;
    
    // auto_compound: bool (1 byte)
    offset += 1;
    
    // dao_eligible: bool (1 byte)
    const daoEligible = data.readUInt8(offset) === 1;

    // Map duration byte to string
    const durationMap: { [key: number]: string } = {
      0: '6months',
      1: '1year',
      2: '2years',
      3: '3years',
    };

    const now = Date.now() / 1000;
    const isUnlocked = now >= lockEndTime;

    return {
      isActive,
      amountStaked: amountStaked / 1_000_000_000, // Convert from smallest unit
      duration: durationMap[durationByte] || '1year',
      apyRate: apyRate / 100, // Convert from basis points if needed
      stakeStartTime: stakeStartTime * 1000, // Convert to milliseconds
      lockEndTime: lockEndTime * 1000,
      pendingRewards: pendingRewards / 1_000_000_000,
      totalRewardsClaimed: totalRewardsClaimed / 1_000_000_000,
      isUnlocked,
      daoEligible,
    };
  } catch (error) {
    console.error('Error fetching staking info:', error);
    return null;
  }
};
// ============================================================================
// BUILD STAKE TRANSACTION
// ============================================================================
export const buildStakeTransaction = async (
  params: StakeTokensParams
): Promise<{ success: boolean; transaction?: Transaction; error?: string }> => {
  try {
    const { userPublicKey, amount, duration, connection } = params;

    console.log('🔨 Building stake transaction...');
    console.log('  Amount:', amount, 'LLTY');
    console.log('  Duration:', duration);

    // ────────────────────────────────────────────────
    // 1. Calculate amounts
    // ────────────────────────────────────────────────
    const amountInSmallestUnit = Math.floor(amount * 1e9); // 9 decimals

    // ────────────────────────────────────────────────
    // 2. Derive PDAs
    // ────────────────────────────────────────────────
    const [stakingPoolPda] = getStakingPoolPDA();
    const [stakingDataPda] = getStakingDataPDA(userPublicKey);
    const treasury = new PublicKey('GS8uMnEqbBckN5K3YidKtmjMFfg1pDgBFTrWrQGY6rZj');
    const [presaleAuthorityPda] = getPresaleAuthorityPDA(treasury);
    
    // Fetch staking vault from staking pool account
    const stakingPoolAccount = await connection.getAccountInfo(stakingPoolPda);
    if (!stakingPoolAccount) {
      throw new Error('Staking pool not initialized');
    }
    // staking_vault is at offset 72 (8 discriminator + 32 authority + 32 token_mint)
    const stakingVaultPda = new PublicKey(stakingPoolAccount.data.slice(72, 104));

    // ────────────────────────────────────────────────
    // 3. Get token accounts
    // ────────────────────────────────────────────────
    const userTokenAccount = await getAssociatedTokenAddress(
      BLOCKCHAIN_CONFIG.lltyMint,
      userPublicKey
    );

    // ────────────────────────────────────────────────
    // 4. Build transaction
    // ────────────────────────────────────────────────
    const tx = new Transaction();

    // Build instruction data
    const amountBytes = new BN(amountInSmallestUnit).toArrayLike(Buffer, 'le', 8);
    const durationByte = Buffer.from([DURATION_ENUM[duration]]);
    const instructionData = Buffer.concat([
      DISCRIMINATORS.STAKE_TOKENS,
      amountBytes,
      durationByte,
    ]);

    // Build accounts array (must match Rust StakeTokens struct)
    const keys = [
      { pubkey: stakingPoolPda, isSigner: false, isWritable: true },
      { pubkey: stakingDataPda, isSigner: false, isWritable: true },
      { pubkey: stakingVaultPda, isSigner: false, isWritable: true },
      { pubkey: userTokenAccount, isSigner: false, isWritable: true },
      { pubkey: treasury, isSigner: false, isWritable: false },
      { pubkey: presaleAuthorityPda, isSigner: false, isWritable: false },
      { pubkey: BLOCKCHAIN_CONFIG.lltyMint, isSigner: false, isWritable: false },
      { pubkey: userPublicKey, isSigner: true, isWritable: true },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
      { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
      { pubkey: ASSOCIATED_TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
      { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
    ];

    const stakeInstruction = new TransactionInstruction({
      keys,
      programId: BLOCKCHAIN_CONFIG.programId,
      data: instructionData,
    });

    tx.add(stakeInstruction);
    tx.feePayer = userPublicKey;
    
    const { blockhash } = await connection.getLatestBlockhash('confirmed');
    tx.recentBlockhash = blockhash;

    console.log('✅ Stake transaction built successfully');

    return {
      success: true,
      transaction: tx,
    };

  } catch (error: any) {
    console.error('❌ Error building stake transaction:', error);
    return {
      success: false,
      error: error.message || 'Failed to build transaction',
    };
  }
};

// ============================================================================
// BUILD CLAIM REWARDS TRANSACTION
// ============================================================================
export const buildClaimRewardsTransaction = async (
  userPublicKey: PublicKey,
  connection: Connection
): Promise<{ success: boolean; transaction?: Transaction; error?: string }> => {
  try {
    console.log('🔨 Building claim rewards transaction...');

    const [stakingPoolPda] = getStakingPoolPDA();
    const [stakingDataPda] = getStakingDataPDA(userPublicKey);
    const treasury = new PublicKey('GS8uMnEqbBckN5K3YidKtmjMFfg1pDgBFTrWrQGY6rZj');
    const [presaleAuthorityPda] = getPresaleAuthorityPDA(treasury);
    
    const userTokenAccount = await getAssociatedTokenAddress(
      BLOCKCHAIN_CONFIG.lltyMint,
      userPublicKey
    );

    const presale = BLOCKCHAIN_CONFIG.presalePda;

    const tx = new Transaction();

    const instructionData = DISCRIMINATORS.CLAIM_REWARDS;

    const keys = [
      { pubkey: presale, isSigner: false, isWritable: false },
      { pubkey: stakingPoolPda, isSigner: false, isWritable: true },
      { pubkey: stakingDataPda, isSigner: false, isWritable: true },
      { pubkey: BLOCKCHAIN_CONFIG.lltyMint, isSigner: false, isWritable: true },
      { pubkey: userTokenAccount, isSigner: false, isWritable: true },
      { pubkey: presaleAuthorityPda, isSigner: false, isWritable: false },
      { pubkey: userPublicKey, isSigner: true, isWritable: true },
      { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
      { pubkey: ASSOCIATED_TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
      { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
    ];

    const claimInstruction = new TransactionInstruction({
      keys,
      programId: BLOCKCHAIN_CONFIG.programId,
      data: instructionData,
    });

    tx.add(claimInstruction);
    tx.feePayer = userPublicKey;
    
    const { blockhash } = await connection.getLatestBlockhash('confirmed');
    tx.recentBlockhash = blockhash;

    console.log('✅ Claim rewards transaction built');

    return {
      success: true,
      transaction: tx,
    };

  } catch (error: any) {
    console.error('❌ Error building claim transaction:', error);
    return {
      success: false,
      error: error.message || 'Failed to build transaction',
    };
  }
};

// ============================================================================
// BUILD UNSTAKE TRANSACTION
// ============================================================================
export const buildUnstakeTransaction = async (
  userPublicKey: PublicKey,
  connection: Connection
): Promise<{ success: boolean; transaction?: Transaction; error?: string }> => {
  try {
    console.log('🔨 Building unstake transaction...');

    const [stakingPoolPda] = getStakingPoolPDA();
    const [stakingDataPda] = getStakingDataPDA(userPublicKey);
    const treasury = new PublicKey('GS8uMnEqbBckN5K3YidKtmjMFfg1pDgBFTrWrQGY6rZj');
    const [presaleAuthorityPda] = getPresaleAuthorityPDA(treasury);
    
    // Fetch staking vault from staking pool account
    const stakingPoolAccount = await connection.getAccountInfo(stakingPoolPda);
    if (!stakingPoolAccount) {
      throw new Error('Staking pool not initialized');
    }
    // staking_vault is at offset 72 (8 discriminator + 32 authority + 32 token_mint)
    const stakingVaultPda = new PublicKey(stakingPoolAccount.data.slice(72, 104));    
     
       // Staking vault authority is the staking pool PDA itself
       const stakingVaultAuthority = stakingPoolPda;
    
    const userTokenAccount = await getAssociatedTokenAddress(
      BLOCKCHAIN_CONFIG.lltyMint,
      userPublicKey
    );

    const presale = BLOCKCHAIN_CONFIG.presalePda;

    const tx = new Transaction();

    const instructionData = DISCRIMINATORS.UNSTAKE_TOKENS;

    const keys = [
      { pubkey: stakingPoolPda, isSigner: false, isWritable: true },
      { pubkey: presale, isSigner: false, isWritable: false },
      { pubkey: stakingDataPda, isSigner: false, isWritable: true },
      { pubkey: stakingVaultPda, isSigner: false, isWritable: true },
      { pubkey: presaleAuthorityPda, isSigner: false, isWritable: false },
      { pubkey: stakingVaultAuthority, isSigner: false, isWritable: false },
      { pubkey: userTokenAccount, isSigner: false, isWritable: true },
      { pubkey: userPublicKey, isSigner: true, isWritable: true },
      { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    ];

    const unstakeInstruction = new TransactionInstruction({
      keys,
      programId: BLOCKCHAIN_CONFIG.programId,
      data: instructionData,
    });

    tx.add(unstakeInstruction);
    tx.feePayer = userPublicKey;
    
    const { blockhash } = await connection.getLatestBlockhash('confirmed');
    tx.recentBlockhash = blockhash;

    console.log('✅ Unstake transaction built');

    return {
      success: true,
      transaction: tx,
    };

  } catch (error: any) {
    console.error('❌ Error building unstake transaction:', error);
    return {
      success: false,
      error: error.message || 'Failed to build transaction',
    };
  }
};

// ============================================================================
// EXECUTE TRANSACTION
// ============================================================================
export const executeStakingTransaction = async (
  transaction: Transaction,
  walletProvider: any,
  connection: Connection
): Promise<{ success: boolean; signature?: string; error?: string }> => {
  try {
    console.log('📤 Signing and sending staking transaction...');

    // ✅ CRITICAL FIX: Ensure wallet is connected before signing
    if (!walletProvider.isConnected && walletProvider.connect) {
      console.log('🔌 Wallet not connected, requesting connection...');
      await walletProvider.connect();
    }
    const signed = await walletProvider.signTransaction(transaction);
    const signature = await connection.sendRawTransaction(signed.serialize(), {
      skipPreflight: false,
      preflightCommitment: 'confirmed',
    });

    console.log('📝 Transaction sent:', signature);
    console.log('⏳ Confirming...');

    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('confirmed');
    const confirmation = await connection.confirmTransaction({
      signature,
      blockhash,
      lastValidBlockHeight,
    }, 'confirmed');

    if (confirmation.value.err) {
      throw new Error(`Transaction failed: ${JSON.stringify(confirmation.value.err)}`);
    }

    console.log('✅ Transaction confirmed!');

    return {
      success: true,
      signature,
    };
    
    } catch (error: any) {
    console.error('❌ Transaction execution failed:', error);
    
    // ✅ USER-FRIENDLY ERROR MESSAGES
    let userMessage = 'Transaction failed';
    
    // Check for specific Solana program errors
    if (error.message) {
      const msg = error.message.toLowerCase();
      
      // Program error 0x1 - Usually means insufficient funds or invalid state
      if (msg.includes('custom program error: 0x1')) {
        userMessage = 'Insufficient balance or staking pool not initialized';
      }
      // Insufficient SOL for transaction fees
      else if (msg.includes('insufficient funds') || msg.includes('insufficient lamports')) {
        userMessage = 'Insufficient SOL for transaction fees';
      }
      // Simulation failed - usually account/state issues
      else if (msg.includes('simulation failed')) {
        userMessage = 'Transaction validation failed. Please check your balance and try again';
      }
      // User rejected transaction
      else if (msg.includes('user rejected') || msg.includes('user denied')) {
        userMessage = 'Transaction cancelled by user';
      }
      // Network/RPC errors
      else if (msg.includes('blockhash not found') || msg.includes('network')) {
        userMessage = 'Network error. Please try again';
      }
      // Generic fallback
      else {
        userMessage = error.message;
      }
    }
    
    return {
      success: false,
      error: userMessage,
    };
  }
};

// ============================================================================
// EXPORTS
// ============================================================================
// export {
//  getStakingInfo,
//  buildStakeTransaction,
//  buildClaimRewardsTransaction,
//  buildUnstakeTransaction,
//  executeStakingTransaction,
// };
