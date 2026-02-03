import { Connection, PublicKey } from '@solana/web3.js';

const LLTY_MINT = '6UYrC72Xseu8bSrjZz5VUZ3aGo68MEqpNNyMgqqcfajf';
const TOKEN_PROGRAM_ID = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');

// Expected allocations from your address file
const EXPECTED = {
  'Presale Vault (6kZbTEeF4iqx7iSsqF38xG1HaBoAs2oynrhBYLCi5GG3)': { expected: 4_000_000_000, purpose: '40% Presale' },
  'Liquidity Pool (BFpQxvPX9oY7C3G6ypByc8JSG413YTfAMSWftWVHgP5S)': { expected: 2_000_000_000, purpose: '20% LP' },
  'Team Wallet (BFFWSNkrDDsXKMkZQt4WfwQjoLQjV3xAV1Eg8DX7ErkG)': { expected: 2_000_000_000, purpose: '20% Team' },
  'Marketing (Gj44rnSZEayVZsVickBmrLzFk98R2Gg1z3yDxisK7fo3)': { expected: 1_000_000_000, purpose: '10% Marketing' },
};

async function main() {
  const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
  
  // Get all LLTY token accounts
  const accounts = await connection.getParsedProgramAccounts(TOKEN_PROGRAM_ID, {
    filters: [
      { dataSize: 165 },
      { memcmp: { offset: 0, bytes: LLTY_MINT } }
    ]
  });

  console.log('=== LLTY TOKEN DISTRIBUTION (Devnet) ===\n');
  
  let totalFound = 0;
  const balances = [];

  accounts.forEach(acc => {
    const info = acc.account.data.parsed.info;
    const balance = info.tokenAmount.uiAmount || 0;
    if (balance > 0) {
      balances.push({
        address: acc.pubkey.toString(),
        owner: info.owner,
        balance: balance
      });
      totalFound += balance;
    }
  });

  // Sort by balance descending
  balances.sort((a, b) => b.balance - a.balance);

  console.log('TOP TOKEN HOLDERS:\n');
  balances.slice(0, 15).forEach((b, i) => {
    const pct = ((b.balance / 10_000_000_000) * 100).toFixed(2);
    console.log(`${i+1}. ${b.balance.toLocaleString()} LLTY (${pct}%)`);
    console.log(`   Token Account: ${b.address}`);
    console.log(`   Owner: ${b.owner}\n`);
  });

  console.log('=== SUMMARY ===');
  console.log(`Total LLTY in circulation: ${totalFound.toLocaleString()}`);
  console.log(`Expected total: 10,000,000,000`);
  console.log(`Difference: ${(10_000_000_000 - totalFound).toLocaleString()}`);
  
  console.log('\n=== EXPECTED vs ACTUAL ===\n');
  
  // Check specific wallets
  const checkAddresses = [
    { name: 'Presale Vault', token: '6kZbTEeF4iqx7iSsqF38xG1HaBoAs2oynrhBYLCi5GG3', expected: 4_000_000_000 },
    { name: 'Team Wallet', owner: 'BFFWSNkrDDsXKMkZQt4WfwQjoLQjV3xAV1Eg8DX7ErkG', expected: 2_000_000_000 },
    { name: 'Liquidity Pool', owner: 'BFpQxvPX9oY7C3G6ypByc8JSG413YTfAMSWftWVHgP5S', expected: 2_000_000_000 },
    { name: 'Marketing', owner: 'Gj44rnSZEayVZsVickBmrLzFk98R2Gg1z3yDxisK7fo3', expected: 1_000_000_000 },
  ];

  checkAddresses.forEach(check => {
    const found = balances.find(b => 
      (check.token && b.address === check.token) || 
      (check.owner && b.owner === check.owner)
    );
    const actual = found ? found.balance : 0;
    const status = actual >= check.expected * 0.95 ? '✅' : '⚠️';
    console.log(`${status} ${check.name}:`);
    console.log(`   Expected: ${check.expected.toLocaleString()} LLTY`);
    console.log(`   Actual:   ${actual.toLocaleString()} LLTY`);
    console.log(`   Diff:     ${(actual - check.expected).toLocaleString()}\n`);
  });
}

main().catch(console.error);
