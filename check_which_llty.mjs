import { Connection, PublicKey } from '@solana/web3.js';
import { getMint, getAccount } from '@solana/spl-token';

const connection = new Connection('https://api.devnet.solana.com');

const mint1 = new PublicKey('6UYrC72Xseu8bSrjZz5VUZ3aGo68MEqpNNyMgqqcfajf'); // From address file
const mint2 = new PublicKey('B85GdRG1tchdPkhRqEJ7LVVLrcgQCz8RgCNzq58iztZo'); // From frontend

const oldVault = new PublicKey('9UqwUfRpi41GBTVuHPiSjWXUoW4EoWah3aYdiUspfU7f');
const newVault = new PublicKey('6kZbTEeF4iqx7iSsqF38xG1HaBoAs2oynrhBYLCi5GG3');

async function check() {
  console.log('=== MINT 1 (from address file) ===');
  console.log('Address:', mint1.toString());
  try {
    const info1 = await getMint(connection, mint1);
    console.log('Supply:', info1.supply.toString());
    console.log('Decimals:', info1.decimals);
  } catch (e) {
    console.log('Error:', e.message);
  }

  console.log('\n=== MINT 2 (from frontend) ===');
  console.log('Address:', mint2.toString());
  try {
    const info2 = await getMint(connection, mint2);
    console.log('Supply:', info2.supply.toString());
    console.log('Decimals:', info2.decimals);
  } catch (e) {
    console.log('Error:', e.message);
  }

  console.log('\n=== OLD VAULT ===');
  try {
    const vaultInfo = await getAccount(connection, oldVault);
    console.log('Mint:', vaultInfo.mint.toString());
    console.log('Balance:', vaultInfo.amount.toString());
    console.log('Is Mint1?', vaultInfo.mint.equals(mint1));
    console.log('Is Mint2?', vaultInfo.mint.equals(mint2));
  } catch (e) {
    console.log('Error:', e.message);
  }

  console.log('\n=== NEW VAULT (token_vault PDA) ===');
  try {
    const vaultInfo = await getAccount(connection, newVault);
    console.log('Mint:', vaultInfo.mint.toString());
    console.log('Balance:', vaultInfo.amount.toString());
    console.log('Is Mint1?', vaultInfo.mint.equals(mint1));
    console.log('Is Mint2?', vaultInfo.mint.equals(mint2));
  } catch (e) {
    console.log('Error:', e.message);
  }
}

check().catch(console.error);
