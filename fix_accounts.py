with open('src/services/purchaseService.ts', 'r') as f:
    content = f.read()

# Fix SOL purchase accounts
old_sol = """      // 8. presale_token_mint (LLTY mint)
      { pubkey: BLOCKCHAIN_CONFIG.lltyMint, isSigner: false, isWritable: true },

      // 9. user (mut, signer, pays SOL)
      { pubkey: userPublicKey, isSigner: true, isWritable: true },"""

new_sol = """      // 8. presale_token_mint (LLTY mint)
      { pubkey: BLOCKCHAIN_CONFIG.lltyMint, isSigner: false, isWritable: true },

      // 9. token_vault (mut, source of LLTY tokens)
      { pubkey: tokenVaultPda, isSigner: false, isWritable: true },

      // 10. user (mut, signer, pays SOL)
      { pubkey: userPublicKey, isSigner: true, isWritable: true },"""

content = content.replace(old_sol, new_sol)

# Fix USDC purchase accounts  
old_usdc = """      { pubkey: BLOCKCHAIN_CONFIG.lltyMint, isSigner: false, isWritable: true },
      { pubkey: BLOCKCHAIN_CONFIG.usdcMint, isSigner: false, isWritable: false },
      { pubkey: userPublicKey, isSigner: true, isWritable: true },"""

new_usdc = """      { pubkey: BLOCKCHAIN_CONFIG.lltyMint, isSigner: false, isWritable: true },
      { pubkey: BLOCKCHAIN_CONFIG.usdcMint, isSigner: false, isWritable: false },
      { pubkey: tokenVaultPda, isSigner: false, isWritable: true },
      { pubkey: userPublicKey, isSigner: true, isWritable: true },"""

content = content.replace(old_usdc, new_usdc)

# Fix USDT purchase accounts
old_usdt = """      { pubkey: BLOCKCHAIN_CONFIG.lltyMint, isSigner: false, isWritable: true },
      { pubkey: BLOCKCHAIN_CONFIG.usdtMint, isSigner: false, isWritable: false },
      { pubkey: userPublicKey, isSigner: true, isWritable: true },"""

new_usdt = """      { pubkey: BLOCKCHAIN_CONFIG.lltyMint, isSigner: false, isWritable: true },
      { pubkey: BLOCKCHAIN_CONFIG.usdtMint, isSigner: false, isWritable: false },
      { pubkey: tokenVaultPda, isSigner: false, isWritable: true },
      { pubkey: userPublicKey, isSigner: true, isWritable: true },"""

content = content.replace(old_usdt, new_usdt)

with open('src/services/purchaseService.ts', 'w') as f:
    f.write(content)

print("✅ Fixed all three account arrays")
