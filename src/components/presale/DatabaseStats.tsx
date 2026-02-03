import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

const DatabaseStats = ({ wallet, lang }) => {
  const [stats, setStats] = useState({ total_invested: 0, token_balance: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (wallet) {
      const fetchStats = async () => {
        const { data, error } = await supabase
          .from('investors')
          .select('*')
          .eq('wallet_address', wallet)
          .single();

        if (data) setStats(data);
        setLoading(false);
      };
      fetchStats();
    }
  }, [wallet]);

  if (!wallet) return null;

  return (
    <div className="grid grid-cols-2 gap-4 mt-6">
      <div className="bg-black/20 p-4 rounded-xl border border-white/5">
        <p className="text-xs text-gray-500 uppercase font-bold mb-1">
          {lang === 'ar' ? 'إجمالي الاستثمار' : 'Total Invested'}
        </p>
        <p className="text-xl font-black text-white">${stats.total_invested || '0'}</p>
      </div>
      <div className="bg-black/20 p-4 rounded-xl border border-white/5">
        <p className="text-xs text-gray-500 uppercase font-bold mb-1">
          {lang === 'ar' ? 'رصيد العملات' : 'Token Balance'}
        </p>
        <p className="text-xl font-black text-yellow-500">{stats.token_balance || '0'} LLTY</p>
      </div>
    </div>
  );
};

export default DatabaseStats;
