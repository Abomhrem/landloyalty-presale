import { PublicKey } from "@solana/web3.js";
import { getAssociatedTokenAddress } from "@solana/spl-token";

// Replace this with your treasury wallet public key
const TREASURY_ADDRESS = new PublicKey("YOUR_TREASURY_PUBLIC_KEY");

// USDT mint address on Solana
const USDT_MINT = new PublicKey("Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuwSzGqKzNNc98FK");

(async () => {
  try {
    const usdtVault = await getAssociatedTokenAddress(USDT_MINT, TREASURY_ADDRESS);
    console.log("USDT Vault Address:", usdtVault.toString());
  } catch (err) {
    console.error("Error:", err);
  }
})();
