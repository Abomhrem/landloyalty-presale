import { Connection, PublicKey } from '@solana/web3.js';

async function main() {
  const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
  const presalePDA = new PublicKey('GzPZVVDfuwmV1uXEovCesN9Mp21HkAaAgMR7SSdc2idT');
  
  const accountInfo = await connection.getAccountInfo(presalePDA);
  if (accountInfo === null) {
    console.log('Presale account not found!');
    return;
  }
  
  const data = accountInfo.data;
  
  const tokenMint = new PublicKey(data.slice(40, 72));
  const usdcMint = new PublicKey(data.slice(72, 104));
  const usdtMint = new PublicKey(data.slice(104, 136));
  
  console.log('=== Presale Token Mints ===');
  console.log('LLTY Mint:', tokenMint.toString());
  console.log('USDC Mint:', usdcMint.toString());
  console.log('USDT Mint:', usdtMint.toString());
}

main().catch(console.error);
