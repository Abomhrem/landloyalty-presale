import React from 'react';
import { Wallet, Gift } from 'lucide-react';
import DatabaseStats from './DatabaseStats';

interface BuySectionProps {
  lang: string;
  t: any;
  isConnected: boolean;
  address: string | undefined;
  isVipPeriod: boolean;
  loading: boolean;
  amount: string;
  setAmount: (amount: string) => void;
  currency: string;
  setCurrency: (currency: string) => void;
  walletBalances: {
    SOL: number;
    USDC: number;
    USDT: number;
  };
  tokenAmount: string;
  getBonusPercentage: () => number;
  buyTokensDebounced: () => Promise<void>;
  purchased: number;
  open: () => void;
}

const BuySection: React.FC<BuySectionProps> = ({
  lang,
  t,
  isConnected,
  address,
  isVipPeriod,
  loading,
  amount,
  setAmount,
  currency,
  setCurrency,
  walletBalances,
  tokenAmount,
  getBonusPercentage,
  buyTokensDebounced,
  purchased,
  open
}) => {
  return (
    <section id="buy" className="mb-16">
      <div className="max-w-2xl mx-auto rounded-2xl p-8 shadow-2xl border-2"
        style={{
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          borderColor: '#fbbf24'
        }}>
        <h2 className="text-3xl font-bold text-center mb-6 text-yellow-400">
          {isVipPeriod ? '👑 VIP Purchase' : t.investNow}
        </h2>
        {isConnected ? (
          <div className="space-y-6">
            {/* Currency Selection */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-300">{t.selectCurrency}</label>
              <div className="grid grid-cols-3 gap-3">
                {['SOL', 'USDC', 'USDT'].map((curr) => (
                  <button
                    key={curr}
                    onClick={() => setCurrency(curr)}
                    className={`py-3 px-4 rounded-lg font-bold transition-all ${
                      currency === curr
                        ? 'scale-105 shadow-lg'
                        : 'opacity-60 hover:opacity-100'
                    }`}
                    style={{
                      background: currency === curr
                        ? 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)'
                        : 'rgba(51, 65, 85, 0.5)',
                      color: currency === curr ? '#1e293b' : '#f1f5f9',
                      border: `2px solid ${currency === curr ? '#fbbf24' : 'rgba(251, 191, 36, 0.3)'}`,
                    }}>
                    {curr}
                  </button>
                ))}
              </div>
              {currency && walletBalances[currency] !== undefined && (
                <p className="text-sm text-gray-400 mt-2">
                  Balance: {walletBalances[currency].toFixed(4)} {currency}
                </p>
              )}
            </div>

            {/* Amount Input */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-300">{t.enterAmount}</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder={isVipPeriod ? "Min: $1,000" : "0.00"}
                className="w-full px-4 py-4 rounded-lg text-xl font-bold text-white"
                style={{
                  background: 'rgba(51, 65, 85, 0.5)',
                  border: '2px solid rgba(251, 191, 36, 0.3)'
                }}
              />
            </div>

            {/* Bonus Display */}
            {getBonusPercentage() > 0 && (
              <div className="rounded-lg p-4 text-center"
                style={{ background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.3)' }}>
                <Gift className="text-green-400 mx-auto mb-2" size={32} />
                <p className="text-green-400 font-bold text-lg">
                  🎁 {getBonusPercentage()}% Bonus Applied!
                </p>
              </div>
            )}

            {/* Token Display */}
            <div className="rounded-xl p-6 border-2"
              style={{ background: 'rgba(251, 191, 36, 0.1)', borderColor: 'rgba(251, 191, 36, 0.3)' }}>
              <p className="text-sm text-gray-400 mb-2">{t.youWillReceive}</p>
              <p className="text-4xl font-bold text-yellow-400">
                {tokenAmount} LLTY
              </p>
              {getBonusPercentage() > 0 && (
                <p className="text-sm text-green-400 mt-2">
                  + {(parseFloat(tokenAmount) * getBonusPercentage() / (100 + getBonusPercentage())).toFixed(2)} bonus
                </p>
              )}
            </div>

            {/* Buy Button */}
            <button
              onClick={buyTokensDebounced}
              disabled={loading || !amount || parseFloat(amount) <= 0}
              className="w-full py-4 rounded-xl font-bold text-xl transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                color: '#1e293b'
              }}>
              {loading ? t.processing : t.buy}
            </button>

            {/* User Stats */}
            {purchased > 0 && (
              <div className="rounded-xl p-4 border"
                style={{ background: 'rgba(251, 191, 36, 0.05)', borderColor: 'rgba(251, 191, 36, 0.2)' }}>
                <p className="text-sm text-gray-400 mb-1">{t.yourBalance}</p>
                <p className="text-2xl font-bold text-yellow-400">
                  {purchased.toLocaleString()} LLTY
                </p>
              </div>
            )}

            {/* Database Stats */}
            <div className="mt-8">
              <h3 className="text-2xl font-bold text-center mb-4 text-yellow-400">
                {lang === 'ar' ? 'لوحة التحكم' : 'Your Dashboard'}
              </h3>
              <DatabaseStats wallet={address} lang={lang} />
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <Wallet className="mx-auto mb-4 text-gray-500" size={64} />
            <p className="text-xl text-gray-400 mb-6">{t.walletNotConnected}</p>
            <button
              onClick={() => open()}
              className="px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                color: '#1e293b'
              }}>
              {t.connectWallet}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default BuySection;
