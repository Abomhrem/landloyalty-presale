// ============================================================================
// GOVERNANCE SERVICE - FULL DAO FUNCTIONALITY
// ============================================================================

import { 
  Connection, 
  PublicKey, 
  Transaction, 
  TransactionInstruction,
  SystemProgram,
  SYSVAR_RENT_PUBKEY
} from '@solana/web3.js';
import { getAssociatedTokenAddress, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import * as borsh from 'borsh';

const PROGRAM_ID = new PublicKey('2oArywYY7xHyoV1xoF9g9QKkyKDHe3rA9kRyu1H8ZQxo');
const LLTY_MINT = new PublicKey('6UYrC72Xseu8bSrjZz5VUZ3aGo68MEqpNNyMgqqcfajf');
const PROPOSAL_COUNTER = new PublicKey('EG3ppJc1w9Rwnr4PazycjmSiCfVBA6yioL8WdewTVuZ5');

// RPC endpoint
const RPC_ENDPOINT = 'https://devnet.helius-rpc.com/?api-key=8fd20322-0155-4b78-874f-837235298a26';

class GovernanceService {
  constructor() {
    this.connection = new Connection(RPC_ENDPOINT, 'confirmed');
  }

  // Get Proposal PDA
  getProposalPDA(proposalId) {
    const idBuffer = Buffer.alloc(8);
    idBuffer.writeBigUInt64LE(BigInt(proposalId));
    const [pda] = PublicKey.findProgramAddressSync(
      [Buffer.from('proposal'), idBuffer],
      PROGRAM_ID
    );
    return pda;
  }

  // Get Vote PDA
  getVotePDA(proposalId, voter) {
    const idBuffer = Buffer.alloc(8);
    idBuffer.writeBigUInt64LE(BigInt(proposalId));
    const [pda] = PublicKey.findProgramAddressSync(
      [Buffer.from('vote'), idBuffer, new PublicKey(voter).toBuffer()],
      PROGRAM_ID
    );
    return pda;
  }

  // Get Staking PDA
  getStakingPDA(wallet) {
    const [pda] = PublicKey.findProgramAddressSync(
      [Buffer.from('staking'), new PublicKey(wallet).toBuffer()],
      PROGRAM_ID
    );
    return pda;
  }

  // Get all proposals
  async getAllProposals(connection) {
    const conn = connection || this.connection;
    
    try {
      console.log('Fetching proposals from blockchain...');
      
      // Get proposal counter
      let nextId = 1;
      try {
        const counterAccount = await conn.getAccountInfo(PROPOSAL_COUNTER);
        if (counterAccount && counterAccount.data.length >= 16) {
          const dataView = new DataView(counterAccount.data.buffer, counterAccount.data.byteOffset);
          nextId = Number(dataView.getBigUint64(8, true));
        }
      } catch (e) {
        console.warn('Could not read proposal counter:', e.message);
      }

      console.log('Total proposals:', nextId - 1);

      const proposals = [];
      for (let i = 1; i < nextId; i++) {
        try {
          const proposalPda = this.getProposalPDA(i);
          const accountInfo = await conn.getAccountInfo(proposalPda);
          
          if (accountInfo) {
            const proposal = this.parseProposalData(accountInfo.data, i, proposalPda);
            if (proposal) {
              proposals.push(proposal);
            }
          }
        } catch (e) {
          console.warn('Error fetching proposal', i, e.message);
        }
      }

      return { proposals };
    } catch (error) {
      console.error('Get proposals error:', error);
      return { proposals: [] };
    }
  }

  // Parse proposal account data
  parseProposalData(data, id, pda) {
    try {
      // Skip 8-byte discriminator
      let offset = 8;
      const view = new DataView(data.buffer, data.byteOffset);

      const proposalId = Number(view.getBigUint64(offset, true)); offset += 8;
      const proposer = new PublicKey(data.slice(offset, offset + 32)); offset += 32;
      const actionByte = data[offset]; offset += 1;
      const statusByte = data[offset]; offset += 1;

      // Read title (64 bytes + 1 byte length)
      const titleLen = data[offset]; offset += 1;
      const titleBytes = data.slice(offset, offset + 64);
      const title = new TextDecoder().decode(titleBytes.slice(0, titleLen)).trim();
      offset += 64;

      // Read description (256 bytes + 2 bytes length)
      const descLen = view.getUint16(offset, true); offset += 2;
      const descBytes = data.slice(offset, offset + 256);
      const description = new TextDecoder().decode(descBytes.slice(0, Math.min(descLen, 256))).trim();
      offset += 256;

      // Skip some fields to get to voting data
      offset += 64 + 2 + 8 + 32; // property_address + len + property_value + property_id
      offset += 8 + 1 + 32; // transfer_amount + transfer_token_type + transfer_recipient

      const votingStart = Number(view.getBigInt64(offset, true)); offset += 8;
      const votingEnd = Number(view.getBigInt64(offset, true)); offset += 8;
      const quorumRequired = Number(view.getBigUint64(offset, true)); offset += 8;
      const approvalThreshold = view.getUint16(offset, true); offset += 2;
      const createdAt = Number(view.getBigInt64(offset, true)); offset += 8;
      const votesYes = Number(view.getBigUint64(offset, true)); offset += 8;
      const votesNo = Number(view.getBigUint64(offset, true)); offset += 8;
      const votesAbstain = Number(view.getBigUint64(offset, true)); offset += 8;
      const totalVoters = Number(view.getBigUint64(offset, true)); offset += 8;
      const executedAt = Number(view.getBigInt64(offset, true)); offset += 8;
      const quorumReached = data[offset] === 1; offset += 1;
      const canExecute = data[offset] === 1; offset += 1;
      const isExecuted = data[offset] === 1;

      const statusMap = ['Draft', 'Active', 'Succeeded', 'Defeated', 'Executed', 'Cancelled', 'Expired'];
      const actionMap = ['TreasuryTransfer', 'UpdateStakingParams', 'PauseProtocol', 'CustomAction'];

      return {
        id: proposalId || id,
        pda: pda.toString(),
        proposer: proposer.toString(),
        title: title || `Proposal #${id}`,
        description: description || 'No description',
        action: actionMap[actionByte] || 'Unknown',
        status: statusMap[statusByte] || 'Unknown',
        votingStart,
        votingEnd,
        quorumRequired,
        approvalThreshold,
        createdAt,
        votesYes,
        votesNo,
        votesAbstain,
        totalVoters,
        executedAt,
        quorumReached,
        canExecute,
        isExecuted
      };
    } catch (e) {
      console.error('Error parsing proposal:', e);
      return null;
    }
  }

  // Get voting power
  async getVotingPower(walletAddress, connection) {
    const conn = connection || this.connection;
    
    try {
      if (!walletAddress) return { tokenBalance: 0, stakedAmount: 0, totalPower: 0, hasDAOEligibility: false };
      
      const walletPubkey = new PublicKey(walletAddress);
      let tokenBalance = 0;
      let stakedAmount = 0;
      let stakeDuration = 0;

      // Get token balance
      try {
        const tokenAccount = await getAssociatedTokenAddress(LLTY_MINT, walletPubkey);
        const balance = await conn.getTokenAccountBalance(tokenAccount);
        tokenBalance = parseFloat(balance.value.uiAmount || 0);
      } catch (e) {}

      // Get staked amount
      try {
        const stakingPda = this.getStakingPDA(walletAddress);
        const stakingAccount = await conn.getAccountInfo(stakingPda);
        
        if (stakingAccount && stakingAccount.data.length > 50) {
          const view = new DataView(stakingAccount.data.buffer, stakingAccount.data.byteOffset);
          // Skip discriminator (8) + owner (32) + is_active (1) = 41
          stakedAmount = Number(view.getBigUint64(41, true)) / 1e9;
          // Duration is at offset 49
          const durationByte = stakingAccount.data[49];
          stakeDuration = durationByte; // 0=6mo, 1=1yr, 2=2yr, 3=3yr
        }
      } catch (e) {}

      // DAO eligibility: staked for 1+ year
      const hasDAOEligibility = stakeDuration >= 1 && stakedAmount > 0;
      
      // Total power: tokens + (staked * 2 if eligible)
      const totalPower = tokenBalance + (hasDAOEligibility ? stakedAmount * 2 : stakedAmount);

      return {
        tokenBalance,
        stakedAmount,
        totalPower,
        hasDAOEligibility
      };
    } catch (error) {
      console.error('Voting power error:', error);
      return { tokenBalance: 0, stakedAmount: 0, totalPower: 0, hasDAOEligibility: false };
    }
  }

  // Check if user has voted
  async hasVoted(walletAddress, proposalId, connection) {
    const conn = connection || this.connection;
    
    try {
      const votePda = this.getVotePDA(proposalId, walletAddress);
      const voteAccount = await conn.getAccountInfo(votePda);
      return voteAccount !== null;
    } catch (e) {
      return false;
    }
  }

  // Create proposal transaction
  async createProposal(walletAddress, proposalData) {
    try {
      const wallet = new PublicKey(walletAddress);
      
      // Get next proposal ID
      const counterAccount = await this.connection.getAccountInfo(PROPOSAL_COUNTER);
      let nextId = 1;
      if (counterAccount) {
        const view = new DataView(counterAccount.data.buffer, counterAccount.data.byteOffset);
        nextId = Number(view.getBigUint64(8, true));
      }

      const proposalPda = this.getProposalPDA(nextId);
      const tokenAccount = await getAssociatedTokenAddress(LLTY_MINT, wallet);
      const stakingPda = this.getStakingPDA(walletAddress);

      // Build instruction data
      // Discriminator for create_proposal (you need to get this from the IDL)
      const discriminator = Buffer.from([132, 116, 68, 174, 216, 160, 198, 22]); // Example - adjust based on IDL

      // Encode instruction data (simplified - would need proper borsh serialization)
      const titleBuffer = Buffer.alloc(64);
      Buffer.from(proposalData.title).copy(titleBuffer);
      
      const descBuffer = Buffer.alloc(256);
      Buffer.from(proposalData.description).copy(descBuffer);

      const instructionData = Buffer.concat([
        discriminator,
        titleBuffer,
        descBuffer,
        Buffer.from([0]) // action type
      ]);

      const instruction = new TransactionInstruction({
        keys: [
          { pubkey: proposalPda, isSigner: false, isWritable: true },
          { pubkey: PROPOSAL_COUNTER, isSigner: false, isWritable: true },
          { pubkey: wallet, isSigner: true, isWritable: true },
          { pubkey: tokenAccount, isSigner: false, isWritable: false },
          { pubkey: stakingPda, isSigner: false, isWritable: false },
          { pubkey: LLTY_MINT, isSigner: false, isWritable: false },
          { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
          { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
        ],
        programId: PROGRAM_ID,
        data: instructionData
      });

      const transaction = new Transaction().add(instruction);
      transaction.feePayer = wallet;
      const { blockhash } = await this.connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;

      return { tx: transaction, proposalId: nextId };
    } catch (error) {
      console.error('Create proposal error:', error);
      throw error;
    }
  }

  // Vote on proposal transaction
  async voteOnProposal(walletAddress, proposalId, support) {
    try {
      const wallet = new PublicKey(walletAddress);
      const proposalPda = this.getProposalPDA(proposalId);
      const votePda = this.getVotePDA(proposalId, walletAddress);
      const tokenAccount = await getAssociatedTokenAddress(LLTY_MINT, wallet);
      const stakingPda = this.getStakingPDA(walletAddress);

      // Support: 0 = Yes, 1 = No, 2 = Abstain
      const supportMap = { 'Yes': 0, 'No': 1, 'Abstain': 2 };
      const supportValue = supportMap[support] || 0;

      // Discriminator for vote_on_proposal
      const discriminator = Buffer.from([248, 132, 153, 12, 189, 219, 203, 40]); // Example - adjust

      const idBuffer = Buffer.alloc(8);
      idBuffer.writeBigUInt64LE(BigInt(proposalId));

      const instructionData = Buffer.concat([
        discriminator,
        idBuffer,
        Buffer.from([supportValue])
      ]);

      const instruction = new TransactionInstruction({
        keys: [
          { pubkey: proposalPda, isSigner: false, isWritable: true },
          { pubkey: votePda, isSigner: false, isWritable: true },
          { pubkey: wallet, isSigner: true, isWritable: true },
          { pubkey: tokenAccount, isSigner: false, isWritable: false },
          { pubkey: stakingPda, isSigner: false, isWritable: false },
          { pubkey: LLTY_MINT, isSigner: false, isWritable: false },
          { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
        ],
        programId: PROGRAM_ID,
        data: instructionData
      });

      const transaction = new Transaction().add(instruction);
      transaction.feePayer = wallet;
      const { blockhash } = await this.connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;

      return transaction;
    } catch (error) {
      console.error('Vote error:', error);
      throw error;
    }
  }

  // Execute proposal transaction
  async executeProposal(walletAddress, proposalId) {
    try {
      const wallet = new PublicKey(walletAddress);
      const proposalPda = this.getProposalPDA(proposalId);

      // Discriminator for execute_proposal
      const discriminator = Buffer.from([186, 60, 116, 133, 108, 128, 111, 28]); // Example - adjust

      const idBuffer = Buffer.alloc(8);
      idBuffer.writeBigUInt64LE(BigInt(proposalId));

      const instructionData = Buffer.concat([discriminator, idBuffer]);

      const instruction = new TransactionInstruction({
        keys: [
          { pubkey: proposalPda, isSigner: false, isWritable: true },
          { pubkey: wallet, isSigner: true, isWritable: true },
          { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
        ],
        programId: PROGRAM_ID,
        data: instructionData
      });

      const transaction = new Transaction().add(instruction);
      transaction.feePayer = wallet;
      const { blockhash } = await this.connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;

      return transaction;
    } catch (error) {
      console.error('Execute proposal error:', error);
      throw error;
    }
  }

  // Get proposal count
  async getProposalCount(connection) {
    const conn = connection || this.connection;
    try {
      const counterAccount = await conn.getAccountInfo(PROPOSAL_COUNTER);
      if (counterAccount) {
        const view = new DataView(counterAccount.data.buffer, counterAccount.data.byteOffset);
        return Number(view.getBigUint64(8, true)) - 1;
      }
      return 0;
    } catch (e) {
      return 0;
    }
  }
}

const governanceService = new GovernanceService();
export default governanceService;
