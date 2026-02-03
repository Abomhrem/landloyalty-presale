import { Connection, PublicKey } from '@solana/web3.js';
import { BLOCKCHAIN_CONFIG } from '../config/blockchain-config';

export interface OnChainPresaleTiming {
  vipStartTime: number;
  vipEndTime: number;
  phase1StartTime: number;
  phaseDuration: number;
  endTime: number;
  vipBuyersCount: number;
  vipMaxBuyers: number;
}

export const fetchOnChainPresaleTiming = async (): Promise<OnChainPresaleTiming> => {
  const connection = new Connection(BLOCKCHAIN_CONFIG.rpcEndpoint);
  const presalePda = BLOCKCHAIN_CONFIG.presalePda;
  
  const accountInfo = await connection.getAccountInfo(presalePda);
  if (!accountInfo) throw new Error('Presale account not found');
  
  const data = accountInfo.data;
  
  return {
    vipStartTime: Number(data.readBigInt64LE(296)) * 1000,
    vipEndTime: Number(data.readBigInt64LE(304)) * 1000,
    phase1StartTime: Number(data.readBigInt64LE(336)) * 1000,
    phaseDuration: Number(data.readBigInt64LE(344)) * 1000,
    endTime: Number(data.readBigInt64LE(352)) * 1000,
    vipBuyersCount: Number(data.readBigUInt64LE(320)),
    vipMaxBuyers: Number(data.readBigUInt64LE(328)),
  };
};
