import React from 'react';
import { Star, Award, CheckCircle } from 'lucide-react';

interface VIPSectionProps {
  lang: string;
  t: any;
  isVipPeriod: boolean;
  vipBuyersCount: number;
  scrollToSection: (id: string) => void;
}

const VIPSection: React.FC<VIPSectionProps> = ({
  lang,
  t,
  isVipPeriod,
  vipBuyersCount,
  scrollToSection
}) => {
  return (
    <section id="vip" className="mb-16">
      <div className="max-w-4xl mx-auto rounded-2xl p-8 shadow-2xl border-2"
        style={{
          background: 'linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)',
          borderColor: '#fbbf24'
        }}>
        <div className="text-center mb-6">
          <h2 className="text-4xl font-bold text-white mb-3">{t.vipTitle}</h2>
          <p className="text-xl text-purple-200">{t.vipDescription}</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="rounded-xl p-6 bg-white/10 backdrop-blur">
            <Star className="text-yellow-400 mb-3" size={32} />
            <h3 className="text-xl font-bold text-white mb-2">{t.vipPrice}</h3>
            <p className="text-purple-200">{t.vipMinPurchase}</p>
            <p className="text-purple-200">{t.vipDuration}</p>
          </div>
          <div className="rounded-xl p-6 bg-white/10 backdrop-blur">
            <Award className="text-yellow-400 mb-3" size={32} />
            <h3 className="text-xl font-bold text-white mb-2">{t.vipSlots}</h3>
            <p className="text-4xl font-bold text-yellow-400">{50 - vipBuyersCount} / 50</p>
          </div>
        </div>
        <div className="rounded-xl p-6 bg-white/10 backdrop-blur mb-6">
          <h3 className="text-2xl font-bold text-white mb-4">{t.vipBenefits}</h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3 text-white">
              <CheckCircle className="text-yellow-400 flex-shrink-0 mt-1" size={20} />
              <span>{t.vipBenefit1}</span>
            </li>
            <li className="flex items-start gap-3 text-white">
              <CheckCircle className="text-yellow-400 flex-shrink-0 mt-1" size={20} />
              <span>{t.vipBenefit2}</span>
            </li>
            <li className="flex items-start gap-3 text-white">
              <CheckCircle className="text-yellow-400 flex-shrink-0 mt-1" size={20} />
              <span>{t.vipBenefit3}</span>
            </li>
            <li className="flex items-start gap-3 text-white">
              <CheckCircle className="text-yellow-400 flex-shrink-0 mt-1" size={20} />
              <span>{t.vipBenefit4}</span>
            </li>
          </ul>
        </div>
        {isVipPeriod && (
          <div className="text-center">
            <button
              onClick={() => scrollToSection('buy')}
              className="px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                color: '#1e293b'
              }}>
              {t.investNow}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default VIPSection;
