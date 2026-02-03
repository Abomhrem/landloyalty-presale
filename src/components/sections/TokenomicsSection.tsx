import React from 'react';

interface TokenomicsSectionProps {
  lang: string;
  t: any;
}

const TokenomicsSection: React.FC<TokenomicsSectionProps> = ({ lang, t }) => {
  return (
    <section id="tokenomics" className="mb-16">
      <h2 className="text-4xl font-bold text-center mb-12 text-yellow-400">{t.tokenomicsTitle}</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {[
          { label: t.presaleAllocation, value: '40%', desc: '4B LLTY' },
          { label: t.liquidityPool, value: '20%', desc: '2B LLTY' },
          { label: t.team, value: '20%', desc: '2B LLTY (Vested)' },
          { label: t.marketing, value: '10%', desc: '1B LLTY' },
          { label: t.reserve, value: '8%', desc: '800M LLTY' },
          { label: t.socialImpact, value: '2%', desc: '200M LLTY' }
        ].map((item, i) => (
          <div key={i} className="rounded-2xl p-6 text-center shadow-xl"
            style={{
              background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
              border: '1px solid rgba(251, 191, 36, 0.2)'
            }}>
            <p className="text-5xl font-bold text-yellow-400 mb-2">{item.value}</p>
            <p className="text-lg font-semibold text-gray-300 mb-1">{item.label}</p>
            <p className="text-sm text-gray-400">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TokenomicsSection;
