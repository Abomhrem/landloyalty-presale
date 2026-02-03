import { PublicKey } from '@solana/web3.js';

export const BLOCKCHAIN_CONFIG = {
  network: 'devnet' as const,
  rpcEndpoint: 'https://api.devnet.solana.com',
  programId: new PublicKey('2oArywYY7xHyoV1xoF9g9QKkyKDHe3rA9kRyu1H8ZQxo'),

  // ✅ CRITICAL: Authority that initialized the presale
  // This is required by purchaseService.ts
  authority: new PublicKey('GS8uMnEqbBckN5K3YidKtmjMFfg1pDgBFTrWrQGY6rZj'),

  // Token Mints (CORRECTED)
  lltyMint: new PublicKey('6UYrC72Xseu8bSrjZz5VUZ3aGo68MEqpNNyMgqqcfajf'),
  usdcMint: new PublicKey('Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr'),
  usdtMint: new PublicKey('Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr'),

  // PDAs (from address file)
  presalePda: new PublicKey('GzPZVVDfuwmV1uXEovCesN9Mp21HkAaAgMR7SSdc2idT'),
  lltyVault: new PublicKey('6kZbTEeF4iqx7iSsqF38xG1HaBoAs2oynrhBYLCi5GG3'),
  usdcVault: new PublicKey('EoV8MTk7zoyAVJeWAVih8eKMkNjAEMDrZ6yPt9yZRq2w'),
  usdtVault: new PublicKey('JBjhVxYUrmHceP3wm1kG1wwo2xbn79XsJ5ZpiM1dgoYx'),
};

export const DECIMALS = {
  LLTY: 9,
  USDC: 6,
  USDT: 6,
  SOL: 9,
};

export const TX_CONFIG = {
  commitment: 'confirmed' as const,
  preflightCommitment: 'confirmed' as const,
  skipPreflight: false,
};

// PDA Helper Functions (for dynamic derivation if needed)
export const getPresalePDA = (authority: PublicKey): [PublicKey, number] => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('presale'), authority.toBuffer()],
    BLOCKCHAIN_CONFIG.programId
  );
};

export const getBuyerDataPDA = (userPublicKey: PublicKey): [PublicKey, number] => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('buyer'), userPublicKey.toBuffer()],
    BLOCKCHAIN_CONFIG.programId
  );
};

export const getPresaleAuthorityPDA = (authority: PublicKey): [PublicKey, number] => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('presale_authority'), authority.toBuffer()],
    BLOCKCHAIN_CONFIG.programId
  );
};

export const getTokenVaultPDA = (authority: PublicKey): [PublicKey, number] => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('token_vault'), authority.toBuffer()],
    BLOCKCHAIN_CONFIG.programId
  );
};

export const getUsdcVaultPDA = (authority: PublicKey): [PublicKey, number] => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('usdc_vault'), authority.toBuffer()],
    BLOCKCHAIN_CONFIG.programId
  );
};

export const getUsdtVaultPDA = (authority: PublicKey): [PublicKey, number] => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('usdt_vault'), authority.toBuffer()],
    BLOCKCHAIN_CONFIG.programId
  );
};

export const getStakingDataPDA = (userPublicKey: PublicKey): [PublicKey, number] => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('staking'), userPublicKey.toBuffer()],
    BLOCKCHAIN_CONFIG.programId
  );
};

export const getStakingPoolPDA = (): [PublicKey, number] => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('staking_pool')],
    BLOCKCHAIN_CONFIG.programId
  );
};
