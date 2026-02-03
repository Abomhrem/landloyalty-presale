import { Connection, PublicKey } from '@solana/web3.js';
import { getAccount } from '@solana/spl-token';

const connection = new Connection('https://api.devnet.solana.com');
const programId = new PublicKey('2oArywYY7xHyoV1xoF9g9QKkyKDHe3rA9kRyu1H8ZQxo');
const lltyMint = new PublicKey('B85GdRG1tchdPkhRqEJ7LVVLrcgQCz8RgCNzq58iztZo');

async function checkVault() {
  // Get presale account to find authority
  const [presalePda] = PublicKey.findProgramAddressSync(
    [Buffer.from('presale')],
    programId
  );
  
  const presaleAccount = await connection.getAccountInfo(presalePda);
  const authority = new PublicKey(presaleAccount.data.slice(8, 40));
  
  console.log('Authority:', authority.toString());
  
  // Derive token vault
  const [tokenVaultPda] = PublicKey.findProgramAddressSync(
    [Buffer.from('token_vault'), authority.toBuffer()],
    programId
  );
  
  console.log('Token Vault PDA:', tokenVaultPda.toString());
  
  // Check token vault details
  const vaultInfo = await getAccount(connection, tokenVaultPda);
  console.log('Token Vault Mint:', vaultInfo.mint.toString());
  console.log('Expected LLTY Mint:', lltyMint.toString());
  console.log('Mints Match:', vaultInfo.mint.equals(lltyMint));
  console.log('Token Vault Balance:', vaultInfo.amount.toString());
}

checkVault().catch(console.error);
