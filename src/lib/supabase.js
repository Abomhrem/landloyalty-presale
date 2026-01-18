import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found. Database features disabled.');
}

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Helper functions
export const dbHelpers = {
  // Record a purchase
  async recordPurchase(data) {
    if (!supabase) return { error: 'Database not configured' };
    
    const { data: result, error } = await supabase
      .from('purchases')
      .insert({
        wallet_address: data.walletAddress,
        tokens_purchased: data.tokensPurchased,
        usd_amount: data.usdAmount,
        currency: data.currency,
        bonus_percentage: data.bonusPercentage,
        transaction_signature: data.signature,
        phase: data.phase,
        is_vip: data.isVip,
        verified: false // Will be verified later
      })
      .select()
      .single();
    
    return { data: result, error };
  },

  // Get user's purchase history
  async getUserPurchases(walletAddress) {
    if (!supabase) return { data: [], error: 'Database not configured' };
    
    const { data, error } = await supabase
      .from('purchases')
      .select('*')
      .eq('wallet_address', walletAddress)
      .order('created_at', { ascending: false });
    
    return { data: data || [], error };
  },

  // Get presale statistics
  async getPresaleStats() {
    if (!supabase) return { data: null, error: 'Database not configured' };
    
    const { data, error } = await supabase
      .from('presale_stats')
      .select('*')
      .single();
    
    return { data, error };
  },

  // Log errors
  async logError(errorData) {
    if (!supabase) return;
    
    await supabase
      .from('error_logs')
      .insert({
        wallet_address: errorData.walletAddress,
        error_type: errorData.type,
        error_message: errorData.message,
        function_name: errorData.function,
        additional_data: errorData.extra
      });
  },

  // Check rate limit
  async checkRateLimit(walletAddress) {
    if (!supabase) return { allowed: true };
    
    const { data, error } = await supabase
      .from('rate_limits')
      .select('*')
      .eq('wallet_address', walletAddress)
      .single();
    
    if (error || !data) {
      // First purchase, create entry
      await supabase
        .from('rate_limits')
        .insert({
          wallet_address: walletAddress,
          last_purchase_attempt: new Date().toISOString(),
          purchase_count: 1
        });
      return { allowed: true };
    }
    
    const lastAttempt = new Date(data.last_purchase_attempt);
    const now = new Date();
    const timeDiff = (now - lastAttempt) / 1000; // seconds
    
    // Rate limit: Max 1 purchase per 30 seconds
    if (timeDiff < 30) {
      return { 
        allowed: false, 
        retryAfter: Math.ceil(30 - timeDiff) 
      };
    }
    
    // Update rate limit
    await supabase
      .from('rate_limits')
      .update({
        last_purchase_attempt: now.toISOString(),
        purchase_count: data.purchase_count + 1,
        updated_at: now.toISOString()
      })
      .eq('wallet_address', walletAddress);
    
    return { allowed: true };
  },

  // Verify transaction on-chain
  async verifyTransaction(signature, connection) {
    try {
      const tx = await connection.getTransaction(signature, {
        maxSupportedTransactionVersion: 0
      });
      
      if (!tx) return { verified: false, reason: 'Transaction not found' };
      
      // Check if transaction succeeded
      if (tx.meta?.err) {
        return { verified: false, reason: 'Transaction failed on-chain' };
      }
      
      return { verified: true, transaction: tx };
    } catch (err) {
      return { verified: false, reason: err.message };
    }
  },

  // Mark transaction as verified
  async markVerified(signature) {
    if (!supabase) return;
    
    await supabase
      .from('purchases')
      .update({ verified: true, updated_at: new Date().toISOString() })
      .eq('transaction_signature', signature);
  }
};
