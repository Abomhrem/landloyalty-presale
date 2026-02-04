import React from 'react';
import { Clock, Bell, Wallet, AlertCircle } from 'lucide-react';

interface WalletNotReadyMessageProps {
  lang: 'ar' | 'en';
  onSubscribe: () => void;
}

const WalletNotReadyMessage: React.FC<WalletNotReadyMessageProps> = ({ lang, onSubscribe }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="max-w-md w-full rounded-3xl p-8 text-center" style={{
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        border: '2px solid rgba(251, 191, 36, 0.3)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
      }}>
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 bg-yellow-500/20 rounded-full animate-ping"></div>
          </div>
          <Clock className="relative mx-auto text-yellow-400" size={64} />
        </div>

        <h2 className="text-2xl font-bold text-white mb-4">
          {lang === 'ar' ? '⏳ البيع المسبق لم يبدأ بعد' : '⏳ Presale Has Not Started Yet'}
        </h2>

        <p className="text-gray-300 mb-6 leading-relaxed">
          {lang === 'ar'
            ? 'شكراً لاهتمامك! البيع المسبق VIP سيبدأ قريباً. سجّل الآن لتكون من أوائل المستثمرين وتحصل على أفضل سعر.'
            : 'Thank you for your interest! The VIP presale will start soon. Register now to be among the first investors and get the best price.'}
        </p>

        <div className="space-y-3">
          <button
            onClick={onSubscribe}
            className="w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
            style={{
              background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
              color: '#1e293b'
            }}
          >
            <Bell size={20} />
            {lang === 'ar' ? 'أبلغني عند الإطلاق' : 'Notify Me on Launch'}
          </button>

          <button
            onClick={() => window.location.reload()}
            className="w-full py-3 rounded-xl font-medium text-gray-400 hover:text-white transition-all border border-gray-700 hover:border-gray-600"
          >
            {lang === 'ar' ? 'إغلاق' : 'Close'}
          </button>
        </div>

        <div className="mt-6 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
          <p className="text-sm text-yellow-400 flex items-center justify-center gap-2">
            <AlertCircle size={16} />
            {lang === 'ar'
              ? 'سعر VIP: $0.004 فقط | مكافأة 50% إضافية'
              : 'VIP Price: Only $0.004 | 50% Bonus Tokens'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default WalletNotReadyMessage;
