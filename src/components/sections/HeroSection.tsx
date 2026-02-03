import React from 'react';
import { Clock, Target } from 'lucide-react';
import LLTYLogo from '../LLTYLogo.jsx';

interface HeroSectionProps {
  lang: string;
  t: any;
  isVipPeriod: boolean;
  currentPhase: number;
  presaleEnded: boolean;
  phaseTimeRemaining: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  };
  getUrgencyMessage: () => string;
  totalRaised: number;
  totalLLTYSold: number;
  PRESALE_TARGET: number;
  PHASE_PRICES_DISPLAY: any;
  progressPercentage: number;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  lang,
  t,
  isVipPeriod,
  currentPhase,
  presaleEnded,
  phaseTimeRemaining,
  getUrgencyMessage,
  totalRaised,
  totalLLTYSold,
  PRESALE_TARGET,
  PHASE_PRICES_DISPLAY,
  progressPercentage
}) => {
  return (
    <section className="text-center mb-12">
      <div className="flex justify-center mb-8">
        <LLTYLogo size={120} />
      </div>
      <h1 className="text-5xl md:text-7xl font-bold mb-4"
        style={{
          background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
        {t.title}
      </h1>
      <p className="text-xl md:text-2xl mb-8 text-gray-300">{t.subtitle}</p>

      {/* TIMER */}
      <div className="max-w-3xl mx-auto mb-8">
        <div className="rounded-2xl p-8 shadow-2xl border-2"
          style={{
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
            borderColor: '#fbbf24'
          }}>
          {/* Phase Title */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <Clock className="text-yellow-400" size={32} />
            <h2 className="text-3xl md:text-4xl font-bold text-yellow-400">
              {isVipPeriod ? t.vipActive : `${t.phase} ${currentPhase}/3`}
            </h2>
          </div>
          {/* Urgency Message */}
          <div className="mb-6 px-6 py-3 rounded-lg text-center"
            style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
            <p className="text-lg font-bold text-red-400">{getUrgencyMessage()}</p>
          </div>
          {/* Next Price In Label */}
          <p className="text-yellow-400 text-lg mb-4 font-semibold">
            {presaleEnded ? t.presaleEnded : t.nextPriceIn}
          </p>
          {/* Timer Display */}
          <div className="grid grid-cols-4 gap-4 md:gap-6">
            {['days', 'hours', 'minutes', 'seconds'].map((unit) => (
              <div key={unit} className="rounded-xl p-4 md:p-6"
                style={{
                  background: 'rgba(251, 191, 36, 0.1)',
                  border: '2px solid rgba(251, 191, 36, 0.3)'
                }}>
                <div className="text-4xl md:text-6xl font-bold text-yellow-400 mb-2">
                  {String(phaseTimeRemaining[unit]).padStart(2, '0')}
                </div>
                <div className="text-sm md:text-base text-gray-300 uppercase font-semibold">
                  {t[unit]}
                </div>
              </div>
            ))}
          </div>
          {/* Current Price Display */}
          <div className="mt-6 pt-6 border-t border-yellow-500/30">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-center md:text-left">
                <p className="text-sm text-gray-400 mb-1">{t.tokenPrice}</p>
                <p className="text-3xl font-bold text-yellow-400">
                  ${isVipPeriod ? PHASE_PRICES_DISPLAY.vip : PHASE_PRICES_DISPLAY[currentPhase]}
                </p>
              </div>
              {!presaleEnded && currentPhase < 3 && (
                <div className="text-center md:text-right">
                  <p className="text-sm text-gray-400 mb-1">Next Price</p>
                  <p className="text-2xl font-bold text-red-400">
                    ${isVipPeriod ? PHASE_PRICES_DISPLAY[1] : PHASE_PRICES_DISPLAY[currentPhase + 1]}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* PROGRESS BAR */}
      <div className="max-w-4xl mx-auto mb-12 rounded-2xl p-8 shadow-2xl"
        style={{
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          border: '2px solid rgba(251, 191, 36, 0.3)'
        }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xl font-semibold text-gray-300 mb-1">{t.totalRaised}</p>
            <p className="text-4xl font-bold text-yellow-400">
              ${totalRaised.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          <Target className="text-yellow-400" size={48} />
        </div>
        <div className="relative w-full h-8 rounded-full overflow-hidden mb-4"
          style={{ background: 'rgba(51, 65, 85, 0.5)' }}>
          <div
            className="absolute top-0 left-0 h-full rounded-full transition-all duration-1000"
            style={{
              width: `${progressPercentage}%`,
              background: 'linear-gradient(90deg, #fbbf24 0%, #f59e0b 100%)'
            }} />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-bold text-white drop-shadow-lg">
              {progressPercentage.toFixed(1)}%
            </span>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-lg text-gray-400">
            {t.of} <span className="text-yellow-400 font-bold">${PRESALE_TARGET.toLocaleString()}</span>
          </p>
          <p className="text-sm text-gray-400">
            {totalLLTYSold.toLocaleString()} LLTY {t.purchased.toLowerCase()}
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
