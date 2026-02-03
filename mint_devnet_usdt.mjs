import {
  Connection,
  PublicKey,
  Keypair,
} from '@solana/web3.js';
import {
  getOrCreateAssociatedTokenAccount,
  mintTo,
} from '@solana/spl-token';
import fs from 'fs';

const RPC_ENDPOINT = 'https://devnet.helius-rpc.com/?api-key=8fd20322-0155-4b78-874f-837235298a26';
const DEVNET_USDT_MINT = '3vU3VsQcGnRg9dBpGiGGYG3q38GGNU6oz3PFZ4m1rGrK';
const YOUR_WALLET = 'B85GRoTCv2ufRzPfYXN8LZ6m155oi81mQNwhfW8Gtcbd';

async function mintUSDT() {
  try {
    console.log('🚀 Starting USDT minting process...');
    console.log('💰 Target wallet:', YOUR_WALLET);

    const connection = new Connection(RPC_ENDPOINT, 'confirmed');

    // Load the mint authority keypair
    const mintAuthorityPath = '/home/amir/.config/solana/id.json';
    
    if (!fs.existsSync(mintAuthorityPath)) {
      console.error('❌ Mint authority keypair not found at:', mintAuthorityPath);
      console.log('💡 This devnet USDT mint requires the authority keypair.');
      console.log('💡 Alternative: Use a different devnet token or create a new one.');
      return;
    }

    const mintAuthorityKeypair = Keypair.fromSecretKey(
      new Uint8Array(JSON.parse(fs.readFileSync(mintAuthorityPath, 'utf-8')))
    );

    console.log('🔑 Mint authority:', mintAuthorityKeypair.publicKey.toString());

    const usdtMint = new PublicKey(DEVNET_USDT_MINT);
    const recipientWallet = new PublicKey(YOUR_WALLET);

    console.log('📝 Getting or creating associated token account...');

    // Get or create the associated token account for the recipient
    const recipientTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      mintAuthorityKeypair,
      usdtMint,
      recipientWallet
    );

    console.log('✅ Token account:', recipientTokenAccount.address.toString());

    // Mint 10,000 USDT (with 6 decimals = 10,000,000,000)
    const amount = 10_000 * 1_000_000; // 10,000 USDT

    console.log('💸 Minting', amount / 1_000_000, 'USDT...');

    const signature = await mintTo(
      connection,
      mintAuthorityKeypair,
      usdtMint,
      recipientTokenAccount.address,
      mintAuthorityKeypair,
      amount
    );

    console.log('✅ Successfully minted USDT!');
    console.log('📝 Transaction signature:', signature);
    console.log('🔗 View on Solana Explorer:');
    console.log(`   https://explorer.solana.com/tx/${signature}?cluster=devnet`);

  } catch (error) {
    console.error('❌ Error:', error.message);
    
    if (error.message.includes('mint authority') || error.message.includes('owner does not match')) {
      console.log('\n💡 SOLUTION: You need mint authority for this token.');
      console.log('Let me create a NEW devnet token that you fully control instead...');
    }
  }
}

mintUSDT();
