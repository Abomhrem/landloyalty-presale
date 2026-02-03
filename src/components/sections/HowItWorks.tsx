import React from 'react';
import { Wallet, TrendingUp, Landmark } from 'lucide-react';

const HowItWorks = ({ lang }) => {
  const steps = [
    {
      icon: <Wallet className="text-yellow-500" size={48} />,
      title: lang === 'ar' ? 'امتلك LLTY' : 'Acquire LLTY',
      desc: lang === 'ar' ? 'اشترِ الرموز خلال البيع المسبق بأفضل سعر ممكن' : 'Purchase tokens during presale at the best possible price'
    },
    {
      icon: <Landmark className="text-yellow-500" size={48} />,
      title: lang === 'ar' ? 'دعم العقارات' : 'Real Estate Backing',
      desc: lang === 'ar' ? 'يتم استثمار الأموال في عقارات تجارية وسكنية مدرة للدخل' : 'Funds are invested in income-generating commercial and residential properties'
    },
    {
      icon: <TrendingUp className="text-yellow-500" size={48} />,
      title: lang === 'ar' ? 'حصد الأرباح' : 'Harvest Profits',
      desc: lang === 'ar' ? 'احصل على عوائد إيجارية وارتفاع في قيمة العملة' : 'Receive rental yields and benefit from token price appreciation'
    }
  ];

  return (
    <section id="how-it-works" className="mb-20">
      <div className="bg-slate-900/50 backdrop-blur-md rounded-[3rem] p-12 border border-white/5">
        <h2 className="text-4xl font-black text-center mb-16 text-white uppercase italic tracking-tighter">
          {lang === 'ar' ? 'كيف يعمل النظام؟' : 'How It Works'}
        </h2>
        <div className="grid md:grid-cols-3 gap-12">
          {steps.map((step, idx) => (
            <div key={idx} className="text-center group">
              <div className="mb-6 inline-flex items-center justify-center w-24 h-24 rounded-full bg-slate-950 border-2 border-yellow-500/20 shadow-[0_0_30px_rgba(251,191,36,0.1)] group-hover:border-yellow-500 group-hover:shadow-[0_0_40px_rgba(251,191,36,0.2)] transition-all">
                {step.icon}
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">{step.title}</h3>
              <p className="text-gray-400 leading-relaxed font-medium">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
