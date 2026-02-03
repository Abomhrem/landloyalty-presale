import React from 'react';
import { Shield, Star, Building, Users, TrendingUp, Award, Coins } from 'lucide-react';

interface AboutSectionProps {
  lang: string;
  t: any;
  scrollToSection: (id: string) => void;
}

const AboutSection: React.FC<AboutSectionProps> = ({ lang, t, scrollToSection }) => {
  return (
    <section id="about" className="mb-20">
      <div className="max-w-5xl mx-auto rounded-3xl p-10 md:p-16 shadow-2xl border border-yellow-600/40 bg-gradient-to-br from-gray-900 via-slate-900 to-gray-950">
        <div className="text-center mb-12">
          <Shield className="mx-auto mb-6 text-green-400" size={80} />
          <h2 className="text-5xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-600 bg-clip-text text-transparent">
            {t.aboutTitle}
          </h2>
          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            {lang === 'ar'
              ? 'Loyalty (LLTY) هي أول عملة رقمية عربية مدعومة بعقارات حقيقية – جسر بين الاستثمار التقليدي والعالم الرقمي'
              : 'Loyalty (LLTY) is the first Arab-backed real estate investment token – bridging traditional property investment with blockchain innovation'}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10 mb-12">
          <div className="space-y-6">
            <h3 className="text-3xl font-bold text-yellow-400 mb-4">
              {lang === 'ar' ? 'ما الذي يميز LLTY؟' : 'What Makes LLTY Unique?'}
            </h3>
            <ul className="space-y-5 text-lg text-gray-200">
              <li className="flex items-start gap-4">
                <Star className="text-yellow-400 flex-shrink-0 mt-1.5" size={28} />
                <span>{lang === 'ar' ? 'أول عملة عربية مدعومة بمحفظة عقارية متنوعة في 9 مدن رئيسية' : 'First Arab token backed by a diversified real-estate portfolio across 9 major cities'}</span>
              </li>
              <li className="flex items-start gap-4">
                <Building className="text-yellow-400 flex-shrink-0 mt-1.5" size={28} />
                <span>{lang === 'ar' ? 'استثمار حقيقي وليس مجرد وعود – الأموال تُحول إلى عقارات ملموسة' : 'Real investment, not just promises – funds converted into tangible properties'}</span>
              </li>
              <li className="flex items-start gap-4">
                <Users className="text-yellow-400 flex-shrink-0 mt-1.5" size={28} />
                <span>{lang === 'ar' ? 'مجتمع قوي وشفافية كاملة – كل معاملة مرئية ومدققة' : 'Strong community & full transparency – every transaction visible and verifiable'}</span>
              </li>
              <li className="flex items-start gap-4">
                <TrendingUp className="text-yellow-400 flex-shrink-0 mt-1.5" size={28} />
                <span>{lang === 'ar' ? 'فرص نمو مزدوجة: ارتفاع سعر العملة + توزيع أرباح' : 'Dual growth: token appreciation + rental profit distribution'}</span>
              </li>
            </ul>
          </div>

          <div className="space-y-6 bg-gradient-to-br from-yellow-950/30 to-amber-950/20 p-8 rounded-2xl border border-yellow-600/30">
            <h3 className="text-3xl font-bold text-yellow-400 mb-6">
              {lang === 'ar' ? 'كيف تربح من LLTY؟' : 'How Do You Profit?'}
            </h3>
            <div className="space-y-8">
              <div>
                <p className="text-xl font-semibold text-white mb-2 flex items-center gap-3">
                  <TrendingUp size={28} className="text-green-400" />
                  {lang === 'ar' ? 'ارتفاع قيمة العملة' : 'Token Price Appreciation'}
                </p>
                <p className="text-gray-300">
                  {lang === 'ar' ? 'السعر يرتفع مع كل مرحلة' : 'Price increases each phase'}
                </p>
              </div>
              <div>
                <p className="text-xl font-semibold text-white mb-2 flex items-center gap-3">
                  <Coins size={28} className="text-green-400" />
                  {lang === 'ar' ? 'أرباح الإيجارات' : 'Rental Profits'}
                </p>
                <p className="text-gray-300">
                  {lang === 'ar' ? 'توزيع نسبة من الأرباح' : 'Profit distribution to holders'}
                </p>
              </div>
              <div>
                <p className="text-xl font-semibold text-white mb-2 flex items-center gap-3">
                  <Award size={28} className="text-green-400" />
                  {lang === 'ar' ? 'قيمة طويلة الأمد' : 'Long-Term Value'}
                </p>
                <p className="text-gray-300">
                  {lang === 'ar' ? 'محفظة عقارية متنامية' : 'Growing real estate portfolio'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-12 p-8 rounded-2xl bg-gradient-to-r from-yellow-950/50 to-amber-950/30 border border-yellow-600/40">
          <p className="text-2xl md:text-3xl font-bold text-yellow-300 mb-6">
            {lang === 'ar' ? 'فرصة محدودة – السعر يرتفع قريباً' : 'Limited Opportunity – Price Increasing Soon'}
          </p>
          <button
            onClick={() => scrollToSection('buy')}
            className="px-12 py-5 rounded-full text-2xl font-bold shadow-2xl hover:scale-105 transition-all"
            style={{
              background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
              color: '#1e293b'
            }}>
            {lang === 'ar' ? 'استثمر الآن' : 'Invest Now'}
          </button>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
