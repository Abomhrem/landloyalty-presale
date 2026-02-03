import React from 'react';
import { Users, Send } from 'lucide-react';

interface ReferralSectionProps {
  lang: string;
  t: any;
  isConnected: boolean;
  address: string | undefined;
  showNotification: (type: string, message: string, duration?: number) => void;
}

const ReferralSection: React.FC<ReferralSectionProps> = ({
  lang,
  t,
  isConnected,
  address,
  showNotification
}) => {
  return (
    <section id="referrals" className="mb-16">
      <div className="max-w-4xl mx-auto rounded-2xl p-8 shadow-2xl border-2"
        style={{
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          borderColor: 'rgba(251, 191, 36, 0.3)'
        }}>
        <div className="text-center mb-8">
          <Users className="text-yellow-400 mx-auto mb-4" size={64} />
          <h2 className="text-4xl font-bold text-yellow-400 mb-3">{t.referralTitle}</h2>
          <p className="text-xl text-gray-300">{t.referralDescription}</p>
        </div>
        <div className="rounded-xl p-6 mb-8"
          style={{ background: 'rgba(251, 191, 36, 0.1)', border: '1px solid rgba(251, 191, 36, 0.3)' }}>
          <p className="text-2xl font-bold text-yellow-400 text-center">{t.referralBonus}</p>
        </div>
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-white mb-4">{t.referralHow}</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center text-slate-900 font-bold">
                1
              </div>
              <p className="text-gray-300 pt-1">{t.referralStep1}</p>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center text-slate-900 font-bold">
                2
              </div>
              <p className="text-gray-300 pt-1">{t.referralStep2}</p>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center text-slate-900 font-bold">
                3
              </div>
              <p className="text-gray-300 pt-1">{t.referralStep3}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl p-6"
          style={{ background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.3)' }}>
          <p className="text-lg text-green-300 text-center">{t.referralExample}</p>
        </div>
        {isConnected && address && (
          <div className="mt-8">
            <p className="text-sm text-gray-400 mb-2">{t.yourReferralLink}</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={`https://landloyalty.com/?ref=${address}`}
                readOnly
                className="flex-1 px-4 py-3 rounded-lg font-mono text-sm"
                style={{ background: 'rgba(51, 65, 85, 0.5)', color: '#f1f5f9', border: '1px solid rgba(251, 191, 36, 0.3)' }}
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`https://landloyalty.com/?ref=${address}`);
                  showNotification('success', lang === 'ar' ? 'تم النسخ!' : 'Copied!');
                }}
                className="px-6 py-3 rounded-lg font-bold transition-all hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                  color: '#1e293b'
                }}>
                <Send size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ReferralSection;
