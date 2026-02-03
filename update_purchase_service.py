#!/usr/bin/env python3
import re

with open('src/services/purchaseService.ts', 'r') as f:
    content = f.read()

# ============================================================================
# Add token_vault derivation helper at the top
# ============================================================================
print("1. Adding getTokenVaultPDA helper...")

vault_helper = """
/**
 * Get Token Vault PDA
 * Seeds: ["token_vault", authority]
 */
export const getTokenVaultPDA = (authority: PublicKey): [PublicKey, number] => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('token_vault'), authority.toBuffer()],
    BLOCKCHAIN_CONFIG.programId
  );
};
"""

# Insert after getUsdtVaultPDA function
insert_point = content.find('export const buildSOLPurchaseTransaction')
if insert_point > 0:
    content = content[:insert_point] + vault_helper + content[insert_point:]
    print("   ✅ Added getTokenVaultPDA")
else:
    print("   ⚠️  Could not find insertion point")

# ============================================================================
# Update SOL purchase to include token_vault
# ============================================================================
print("2. Updating buildSOLPurchaseTransaction...")

# Find the section where we derive PDAs
sol_pda_section = """    const [buyerDataPda] = getBuyerDataPDA(userPublicKey);
    const [presaleAuthorityPda] = getPresaleAuthorityPDA(authority);
    const [presaleVaultPda] = getPresaleVaultPDA(authority);"""

sol_pda_section_new = """    const [buyerDataPda] = getBuyerDataPDA(userPublicKey);
    const [presaleAuthorityPda] = getPresaleAuthorityPDA(authority);
    const [presaleVaultPda] = getPresaleVaultPDA(authority);
    const [tokenVaultPda] = getTokenVaultPDA(authority);"""

content = content.replace(sol_pda_section, sol_pda_section_new, 1)

# Find where we add the presale_token_mint account and add token_vault after it
sol_accounts_old = """      // 8. presale_token_mint (LLTY mint)
      { pubkey: BLOCKCHAIN_CONFIG.lltyMint, isSigner: false, isWritable: true },

      // 9. user (mut, signer, pays SOL)"""

sol_accounts_new = """      // 8. presale_token_mint (LLTY mint)
      { pubkey: BLOCKCHAIN_CONFIG.lltyMint, isSigner: false, isWritable: true },

      // 9. token_vault (mut, source of LLTY tokens)
      { pubkey: tokenVaultPda, isSigner: false, isWritable: true },

      // 10. user (mut, signer, pays SOL)"""

content = content.replace(sol_accounts_old, sol_accounts_new, 1)

# Update the account count comment
content = content.replace("console.log('✅ All 13 accounts prepared", "console.log('✅ All 14 accounts prepared")

# ============================================================================
# Update USDC purchase to include token_vault
# ============================================================================
print("3. Updating buildUSDCPurchaseTransaction...")

usdc_pda_section = """    const [buyerDataPda] = getBuyerDataPDA(userPublicKey);
    const [presaleAuthorityPda] = getPresaleAuthorityPDA(authority);

    // USDC vault uses different seed: "presale_usdc_vault\""""

usdc_pda_section_new = """    const [buyerDataPda] = getBuyerDataPDA(userPublicKey);
    const [presaleAuthorityPda] = getPresaleAuthorityPDA(authority);
    const [tokenVaultPda] = getTokenVaultPDA(authority);

    // USDC vault uses different seed: "presale_usdc_vault\""""

content = content.replace(usdc_pda_section, usdc_pda_section_new, 1)

# Add token_vault to USDC accounts
usdc_accounts_old = """      { pubkey: BLOCKCHAIN_CONFIG.lltyMint, isSigner: false, isWritable: true },
      { pubkey: BLOCKCHAIN_CONFIG.usdcMint, isSigner: false, isWritable: false },
      { pubkey: userPublicKey, isSigner: true, isWritable: true },"""

usdc_accounts_new = """      { pubkey: BLOCKCHAIN_CONFIG.lltyMint, isSigner: false, isWritable: true },
      { pubkey: BLOCKCHAIN_CONFIG.usdcMint, isSigner: false, isWritable: false },
      { pubkey: tokenVaultPda, isSigner: false, isWritable: true },
      { pubkey: userPublicKey, isSigner: true, isWritable: true },"""

content = content.replace(usdc_accounts_old, usdc_accounts_new, 1)

# ============================================================================
# Update USDT purchase to include token_vault
# ============================================================================
print("4. Updating buildUSDTPurchaseTransaction...")

usdt_pda_section = """    const [buyerDataPda] = getBuyerDataPDA(userPublicKey);
    const [presaleAuthorityPda] = getPresaleAuthorityPDA(authority);

    // USDT vault
    const [usdtVaultPda] = getUsdtVaultPDA(authority);"""

usdt_pda_section_new = """    const [buyerDataPda] = getBuyerDataPDA(userPublicKey);
    const [presaleAuthorityPda] = getPresaleAuthorityPDA(authority);
    const [tokenVaultPda] = getTokenVaultPDA(authority);

    // USDT vault
    const [usdtVaultPda] = getUsdtVaultPDA(authority);"""

content = content.replace(usdt_pda_section, usdt_pda_section_new, 1)

# Add token_vault to USDT accounts (similar pattern)
usdt_accounts_old = """      { pubkey: BLOCKCHAIN_CONFIG.lltyMint, isSigner: false, isWritable: true },
      { pubkey: BLOCKCHAIN_CONFIG.usdtMint, isSigner: false, isWritable: false },
      { pubkey: userPublicKey, isSigner: true, isWritable: true },"""

usdt_accounts_new = """      { pubkey: BLOCKCHAIN_CONFIG.lltyMint, isSigner: false, isWritable: true },
      { pubkey: BLOCKCHAIN_CONFIG.usdtMint, isSigner: false, isWritable: false },
      { pubkey: tokenVaultPda, isSigner: false, isWritable: true },
      { pubkey: userPublicKey, isSigner: true, isWritable: true },"""

content = content.replace(usdt_accounts_old, usdt_accounts_new, 1)

# Write the updated content
with open('src/services/purchaseService.ts', 'w') as f:
    f.write(content)

print("\n✅ Purchase service updated successfully!")

