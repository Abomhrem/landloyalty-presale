import React from 'react';
import { Gift } from 'lucide-react';

interface BonusTiersSectionProps {
  lang: string;
  t: any;
}

const BonusTiersSection: React.FC<BonusTiersSectionProps> = ({ lang, t }) => {
  return (
    <section id="bonuses" className="mb-16">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-8 text-yellow-400">{t.bonusTitle}</h2>
        <p className="text-xl text-center mb-8 text-gray-300">{t.bonusDescription}</p>
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="rounded-2xl p-6 shadow-xl border-2 text-center"
            style={{
              background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
              borderColor: '#10b981'
            }}>
            <div className="text-5xl mb-4">💰</div>
            <h3 className="text-2xl font-bold text-green-400 mb-2">5% Bonus</h3>
            <p className="text-gray-300 mb-4">{t.bonusTier1}</p>
            <p className="text-sm text-gray-400">Buy $1,000 - $4,999</p>
          </div>
          <div className="rounded-2xl p-6 shadow-xl border-2 text-center"
            style={{
              background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
              borderColor: '#3b82f6'
            }}>
            <div className="text-5xl mb-4">💎</div>
            <h3 className="text-2xl font-bold text-blue-400 mb-2">10% Bonus</h3>
            <p className="text-gray-300 mb-4">{t.bonusTier2}</p>
            <p className="text-sm text-gray-400">Buy $5,000 - $9,999</p>
          </div>
          <div className="rounded-2xl p-6 shadow-xl border-2 text-center"
            style={{
              background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
              borderColor: '#fbbf24'
            }}>
            <div className="text-5xl mb-4">👑</div>
            <h3 className="text-2xl font-bold text-yellow-400 mb-2">15% Bonus</h3>
            <p className="text-gray-300 mb-4">{t.bonusTier3}</p>
            <p className="text-sm text-gray-400">Buy $10,000+</p>
          </div>
        </div>
        <div className="rounded-2xl p-6 shadow-xl border-2 text-center"
          style={{
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
            borderColor: 'rgba(251, 191, 36, 0.3)'
          }}>
          <Gift className="text-yellow-400 mx-auto mb-4" size={48} />
          <p className="text-xl text-gray-300">{t.bonusExample}</p>
        </div>
      </div>
    </section>
  );
};

export default BonusTiersSection;
