import { Connection, PublicKey } from '@solana/web3.js';
import { getMint } from '@solana/spl-token';

const connection = new Connection('https://api.devnet.solana.com');

const wrongMint = new PublicKey('6UYrC72Xseu8bSrjZz5VUZ3aGo68MEqpNNyMgqqcfajf');
const lltyMint = new PublicKey('B85GdRG1tchdPkhRqEJ7LVVLrcgQCz8RgCNzq58iztZo');
const usdcMint = new PublicKey('4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU');
const usdtMint = new PublicKey('EJwZgeZrdC8TXTQbQBoL6bfuAnFUUy1PVCMB4DYPzVaS');

async function checkMints() {
  console.log('Wrong Mint in Vault:', wrongMint.toString());
  console.log('Is it LLTY?', wrongMint.equals(lltyMint));
  console.log('Is it USDC?', wrongMint.equals(usdcMint));
  console.log('Is it USDT?', wrongMint.equals(usdtMint));
  
  try {
    const mintInfo = await getMint(connection, wrongMint);
    console.log('\nWrong Mint Info:');
    console.log('  Decimals:', mintInfo.decimals);
    console.log('  Supply:', mintInfo.supply.toString());
  } catch (e) {
    console.log('Could not fetch mint info:', e.message);
  }
}

checkMints().catch(console.error);
