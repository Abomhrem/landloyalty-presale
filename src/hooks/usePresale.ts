import { useState, useEffect, useCallback } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { dbHelpers } from '../lib/supabase';

export const usePresale = (lang, t, showNotification) => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction, connected } = useWallet();
  
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('SOL');
  const [tokenAmount, setTokenAmount] = useState(0);
  const [txStatus, setTxStatus] = useState('idle');
  const [progress, setProgress] = useState(65);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const phaseInfo = {
    current: lang === 'ar' ? "الجولة التأسيسية" : "Seed Round",
    price: "$0.05",
    nextPrice: "$0.08"
  };

  // Timer Logic
  useEffect(() => {
    const target = new Date("2026-12-31T23:59:59").getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const diff = target - now;
      if (diff <= 0) {
        clearInterval(interval);
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000)
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const buyTokens = async () => {
    if (!publicKey) {
      showNotification(t.connectWalletFirst || 'Connect Wallet First', 'error');
      return;
    }

    setLoading(true);
    let signature = '';
    
    try {
      const amt = parseFloat(amount);
      if (isNaN(amt) || amt <= 0) throw new Error('Invalid Amount');

      if (selectedCurrency === 'SOL') {
        const transaction = new Transaction().add(
          SystemProgram.transfer({
            fromPubkey: publicKey,
            toPubkey: new PublicKey("GS8uMnEqbBckN5K3YidKtmjMFfg1pDgBFTrWrQGY6rZj"),
            lamports: amt * LAMPORTS_PER_SOL,
          })
        );

        signature = await sendTransaction(transaction, connection);
        await connection.confirmTransaction(signature, 'confirmed');
      }

      // Log to Supabase
      await dbHelpers.logTransaction({
        wallet_address: publicKey.toString(),
        amount: amt,
        currency: selectedCurrency,
        tokens_issued: amt * 20, // Simplified for example
        signature: signature
      });

      showNotification(t.txSuccess || 'Purchase Successful!', 'success');
      setAmount('');
    } catch (error: any) {
      console.error(error);
      showNotification(error.message || 'Transaction Failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return {
    address: publicKey?.toString() || '',
    isConnected: connected,
    balance,
    loading,
    buyTokens,
    amount,
    setAmount,
    setSelectedCurrency,
    selectedCurrency,
    tokenAmount,
    timeLeft,
    progress,
    phaseInfo
  };
};
