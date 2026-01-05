// ============================================================================
// ENTERPRISE REAL BLOCKCHAIN INTEGRATION - LANDLOYALTY PRESALE
// Production-grade implementation with full error handling
// Version: 2.0.0 | Pure JavaScript
// ============================================================================

import * as anchor from '@coral-xyz/anchor';
import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL
} from '@solana/web3.js';
import {
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction
} from '@solana/spl-token';
import idl from './landloyalty_presale_idl.js';

// ============================================================================
// CONFIGURATION
// ============================================================================
const NETWORK = 'devnet';
const RPC_ENDPOINT = NETWORK === 'mainnet-beta'
  ? 'https://api.mainnet-beta.solana.com'
  : 'https://api.devnet.solana.com';

const PROGRAM_ID = new PublicKey('2oArywYY7xHyoV1xoF9g9QKkyKDHe3rA9kRyu1H8ZQxo');
const PRESALE_STATE_PDA = new PublicKey('9b55xaKqELt1fYHn6MXA9vETy4ngTPxSZZ1SJmTQN1Kr');

const USDC_MINT = new PublicKey('Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr');
const USDT_MINT = new PublicKey('EJwZgeZrdC8TXTQbQBoL6bfuAnFUUy1PVCMB4DYPzVaS');

const PaymentToken = {
  SOL: { sol: {} },
  USDC: { usdc: {} },
  USDT: { usdt: {} }
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

async function getOrCreateATA(connection, mint, owner, payer) {
  const ata = await getAssociatedTokenAddress(mint, owner);
  
  try {
    await connection.getAccountInfo(ata);
    return { address: ata, instruction: null };
  } catch {
    const instruction = createAssociatedTokenAccountInstruction(
      payer,
      ata,
      owner,
      mint
    );
    return { address: ata, instruction };
  }
}

function getWhitelistPDA(buyer) {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('whitelist'), buyer.toBuffer()],
    PROGRAM_ID
  );
}

function getBuyerDataPDA(buyer) {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('buyer'), buyer.toBuffer()],
    PROGRAM_ID
  );
}

// ============================================================================
// FETCH PRESALE STATE
// ============================================================================
export async function fetchPresaleData() {
  const maxRetries = 3;
  let lastError;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const connection = new Connection(RPC_ENDPOINT, 'confirmed');
      const provider = new anchor.AnchorProvider(
        connection,
        window.solana,
        { commitment: 'confirmed' }
      );
      
      const program = new anchor.Program(idl, PROGRAM_ID, provider);
      const presaleState = await program.account.presaleState.fetch(PRESALE_STATE_PDA);
      
      const now = Date.now();
      const vipStart = presaleState.vipStartTime.toNumber() * 1000;
      const vipEnd = vipStart + presaleState.vipDuration.toNumber() * 1000;
      const publicStart = presaleState.startTime.toNumber() * 1000;
      
      const isVipPeriod = now >= vipStart && now < vipEnd;
      const hasStarted = now >= publicStart || now >= vipStart;
      
      let currentPhase = 0;
      if (now >= publicStart) {
        const elapsed = now - publicStart;
        const phaseDuration = presaleState.phaseDuration.toNumber() * 1000;
        currentPhase = Math.min(Math.floor(elapsed / phaseDuration), 2);
      }
      
      return {
        totalRaised: presaleState.totalRaised.toNumber() / 1_000_000,
        totalWithdrawn: presaleState.totalWithdrawn.toNumber() / 1_000_000,
        vipBuyersCount: presaleState.vipBuyersCount.toNumber(),
        vipTokensSold: presaleState.vipTokensSold.toNumber(),
        tokensSold: presaleState.tokensSold.map(t => t.toNumber()),
        phasePrices: presaleState.phasePrices.map(p => p.toNumber() / 1_000_000),
        vipPrice: presaleState.vipPrice.toNumber() / 1_000_000,
        isVipPeriod,
        hasStarted,
        currentPhase,
        isPaused: presaleState.isPaused,
        isCancelled: presaleState.isCancelled,
        presaleEnded: presaleState.presaleEnded,
        vipStart,
        vipEnd,
        publicStart,
        authority: presaleState.authority.toString()
      };
    } catch (error) {
      lastError = error;
      console.error(`Fetch attempt ${attempt + 1} failed:`, error);
      
      if (attempt < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
      }
    }
  }
  
  throw lastError;
}

// ============================================================================
// FETCH USER DATA
// ============================================================================
export async function fetchUserData(walletAddress) {
  try {
    const connection = new Connection(RPC_ENDPOINT, 'confirmed');
    const provider = new anchor.AnchorProvider(
      connection,
      window.solana,
      { commitment: 'confirmed' }
    );
    
    const program = new anchor.Program(idl, PROGRAM_ID, provider);
    const buyer = new PublicKey(walletAddress);
    
    const [buyerDataPDA] = getBuyerDataPDA(buyer);
    
    try {
      const buyerData = await program.account.buyerData.fetch(buyerDataPDA);
      
      return {
        totalPurchased: buyerData.totalPurchased.toNumber() / 1_000_000_000,
        totalPaidUsd: buyerData.totalPaidUsd.toNumber() / 1_000_000,
        totalClaimed: buyerData.totalClaimed.toNumber() / 1_000_000_000,
        bonusReceived: buyerData.bonusReceived.toNumber() / 1_000_000_000,
        isVip: buyerData.isVip,
        refunded: buyerData.refunded
      };
    } catch (error) {
      return {
        totalPurchased: 0,
        totalPaidUsd: 0,
        totalClaimed: 0,
        bonusReceived: 0,
        isVip: false,
        refunded: false
      };
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
}

// ============================================================================
// BUY TOKENS
// ============================================================================
export async function buyTokensReal(amountUSD, currency, referrerAddress) {
  if (!window.solana || !window.solana.isConnected) {
    throw new Error('Wallet not connected');
  }
  
  const connection = new Connection(RPC_ENDPOINT, 'confirmed');
  const wallet = window.solana;
  const buyer = wallet.publicKey;
  
  try {
    const provider = new anchor.AnchorProvider(
      connection,
      wallet,
      { commitment: 'confirmed' }
    );
    anchor.setProvider(provider);
    
    const program = new anchor.Program(idl, PROGRAM_ID, provider);
    
    const [whitelistEntry] = getWhitelistPDA(buyer);
    const [buyerData] = getBuyerDataPDA(buyer);
    
    const presaleState = await program.account.presaleState.fetch(PRESALE_STATE_PDA);
    const usdcVault = presaleState.usdcVault;
    
    let paymentToken;
    let buyerPaymentAccount;
    
    if (currency === 'SOL') {
      paymentToken = PaymentToken.SOL;
      buyerPaymentAccount = buyer;
    } else if (currency === 'USDC') {
      paymentToken = PaymentToken.USDC;
      const { address } = await getOrCreateATA(connection, USDC_MINT, buyer, buyer);
      buyerPaymentAccount = address;
    } else {
      paymentToken = PaymentToken.USDT;
      const { address } = await getOrCreateATA(connection, USDT_MINT, buyer, buyer);
      buyerPaymentAccount = address;
    }
    
    const amountU64 = Math.floor(amountUSD * 1_000_000);
    const referrer = referrerAddress ? new PublicKey(referrerAddress) : null;
    
    const tx = await program.methods
      .buyTokens(
        new anchor.BN(amountU64),
        paymentToken,
        referrer
      )
      .accounts({
        presaleState: PRESALE_STATE_PDA,
        buyer: buyer,
        whitelistEntry: whitelistEntry,
        buyerData: buyerData,
        buyerPaymentAccount: buyerPaymentAccount,
        usdcVault: usdcVault,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId
      })
      .transaction();
    
    const { blockhash } = await connection.getLatestBlockhash('finalized');
    tx.recentBlockhash = blockhash;
    tx.feePayer = buyer;
    
    const signed = await wallet.signTransaction(tx);
    const signature = await connection.sendRawTransaction(signed.serialize(), {
      skipPreflight: false,
      preflightCommitment: 'confirmed'
    });
    
    await Promise.race([
      connection.confirmTransaction(signature, 'confirmed'),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Transaction timeout')), 60000)
      )
    ]);
    
    return {
      signature,
      success: true,
      explorerUrl: `https://solscan.io/tx/${signature}${NETWORK === 'devnet' ? '?cluster=devnet' : ''}`
    };
    
  } catch (error) {
    console.error('Purchase error:', error);
    
    let userMessage = 'Transaction failed';
    
    if (error.message.includes('NotWhitelisted')) {
      userMessage = 'You are not whitelisted. Please contact support.';
    } else if (error.message.includes('PresaleNotStarted')) {
      userMessage = 'Presale has not started yet.';
    } else if (error.message.includes('PresaleEnded')) {
      userMessage = 'Presale has ended.';
    } else if (error.message.includes('Paused')) {
      userMessage = 'Presale is currently paused.';
    } else if (error.message.includes('PhaseCapacityExceeded')) {
      userMessage = 'Phase capacity exceeded. Please wait for next phase.';
    } else if (error.message.includes('BelowVipMinimum')) {
      userMessage = 'VIP minimum is $1,000';
    } else if (error.message.includes('VipSlotsFull')) {
      userMessage = 'VIP slots are full.';
    } else if (error.message.includes('insufficient')) {
      userMessage = 'Insufficient balance in wallet.';
    } else if (error.message.includes('User rejected')) {
      userMessage = 'Transaction rejected by user.';
    }
    
    throw new Error(userMessage);
  }
}

// ============================================================================
// FETCH BALANCES
// ============================================================================
export async function fetchRealBalances(publicKey) {
  try {
    const connection = new Connection(RPC_ENDPOINT, 'confirmed');
    
    const solBalance = await connection.getBalance(publicKey);
    
    let usdcBalance = 0;
    try {
      const usdcAta = await getAssociatedTokenAddress(USDC_MINT, publicKey);
      const usdcAccount = await connection.getTokenAccountBalance(usdcAta);
      usdcBalance = parseFloat(usdcAccount.value.uiAmount || '0');
    } catch (e) {
      usdcBalance = 0;
    }
    
    let usdtBalance = 0;
    try {
      const usdtAta = await getAssociatedTokenAddress(USDT_MINT, publicKey);
      const usdtAccount = await connection.getTokenAccountBalance(usdtAta);
      usdtBalance = parseFloat(usdtAccount.value.uiAmount || '0');
    } catch (e) {
      usdtBalance = 0;
    }
    
    return {
      SOL: solBalance / LAMPORTS_PER_SOL,
      USDC: usdcBalance,
      USDT: usdtBalance
    };
  } catch (error) {
    console.error('Error fetching balances:', error);
    throw error;
  }
}

// Export constants
export { PROGRAM_ID, PRESALE_STATE_PDA, NETWORK };
