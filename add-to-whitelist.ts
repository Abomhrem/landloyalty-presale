import { Connection, PublicKey, Transaction, TransactionInstruction, Keypair, sendAndConfirmTransaction } from '@solana/web3.js';
import fs from 'fs';
import os from 'os';

// Configuration
const PROGRAM_ID = new PublicKey('2oArywYY7xHyoV1xoF9g9QKkyKDHe3rA9kRyu1H8ZQxo');
const USER_TO_WHITELIST = new PublicKey('B85GRoTCv2ufRzPfYXN8LZ6m155oi81mQNwhfW8Gtcbd');
const IS_VIP = false; // Set to true for VIP access

// Discriminator for add_to_whitelist from IDL: [157, 211, 52, 54, 144, 81, 5, 55]
const ADD_TO_WHITELIST_DISCRIMINATOR = Buffer.from([157, 211, 52, 54, 144, 81, 5, 55]);

async function main() {
  // Load authority keypair
  const keypairPath = `${os.homedir()}/.config/solana/id.json`;
  const keypairData = JSON.parse(fs.readFileSync(keypairPath, 'utf-8'));
  const authority = Keypair.fromSecretKey(Uint8Array.from(keypairData));
  
  console.log('Authority:', authority.publicKey.toString());
  console.log('User to whitelist:', USER_TO_WHITELIST.toString());
  
  // Connect to devnet
  const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
  
  // Derive PDAs
  const [presaleStatePda] = PublicKey.findProgramAddressSync(
    [Buffer.from('presale')],
    PROGRAM_ID
  );
  
  const [whitelistEntryPda] = PublicKey.findProgramAddressSync(
    [Buffer.from('whitelist'), USER_TO_WHITELIST.toBuffer()],
    PROGRAM_ID
  );
  
  console.log('Presale State PDA:', presaleStatePda.toString());
  console.log('Whitelist Entry PDA:', whitelistEntryPda.toString());
  
  // Build instruction data
  // Layout: [8 bytes discriminator] [32 bytes user pubkey] [1 byte is_vip bool]
  const instructionData = Buffer.concat([
    ADD_TO_WHITELIST_DISCRIMINATOR,
    USER_TO_WHITELIST.toBuffer(),
    Buffer.from([IS_VIP ? 1 : 0])
  ]);
  
  // Build accounts (from IDL)
  const keys = [
    { pubkey: presaleStatePda, isSigner: false, isWritable: true },
    { pubkey: authority.publicKey, isSigner: true, isWritable: true },
    { pubkey: whitelistEntryPda, isSigner: false, isWritable: true },
    { pubkey: USER_TO_WHITELIST, isSigner: false, isWritable: false },
    { pubkey: new PublicKey('11111111111111111111111111111111'), isSigner: false, isWritable: false },
  ];
  
  const instruction = new TransactionInstruction({
    keys,
    programId: PROGRAM_ID,
    data: instructionData,
  });
  
  const tx = new Transaction().add(instruction);
  
  console.log('Sending transaction...');
  const signature = await sendAndConfirmTransaction(connection, tx, [authority]);
  console.log('✅ Whitelist transaction confirmed!');
  console.log('Signature:', signature);
}

main().catch(console.error);
