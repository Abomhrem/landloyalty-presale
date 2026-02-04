import React, { useState, useEffect, useCallback } from 'react';
import { Rocket, Bell, Mail, Phone, Sparkles, Shield, TrendingUp, Users, Clock, CheckCircle, AlertCircle, ChevronDown, FileText, Coins, Building, Vote, PiggyBank } from 'lucide-react';

interface PreLaunchCountdownProps {
  lang: 'ar' | 'en';
  launchDate: Date;
  onLaunchComplete: () => void;
  showNotification: (type: string, message: string, duration?: number) => void;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

const PreLaunchCountdown: React.FC<PreLaunchCountdownProps> = ({
  lang,
  launchDate,
  onLaunchComplete,
  showNotification
}) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 });
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const calculateTimeLeft = useCallback(() => {
    const now = new Date().getTime();
    const target = launchDate.getTime();
    const difference = target - now;

    if (difference <= 0) {
      onLaunchComplete();
      return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((difference % (1000 * 60)) / 1000),
      total: difference
    };
  }, [launchDate, onLaunchComplete]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [calculateTimeLeft]);

  useEffect(() => {
    const saved = localStorage.getItem('llty_prelaunch_subscribed');
    if (saved) setSubscribed(true);
  }, []);

  const handleSubscribe = async () => {
    if (!email && !phone) {
      showNotification('error', lang === 'ar' ? 'الرجاء إدخال البريد الإلكتروني أو رقم الهاتف' : 'Please enter email or phone number');
      return;
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showNotification('error', lang === 'ar' ? 'البريد الإلكتروني غير صالح' : 'Invalid email address');
      return;
    }

    setIsSubscribing(true);
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, phone, language: lang })
      });

      if (response.ok) {
        setSubscribed(true);
        localStorage.setItem('llty_prelaunch_subscribed', 'true');
        showNotification('success', lang === 'ar' ? '🎉 تم التسجيل بنجاح!' : '🎉 Subscribed successfully!');
      }
    } catch (error) {
      localStorage.setItem('llty_prelaunch_subscribed', 'true');
      setSubscribed(true);
      showNotification('success', lang === 'ar' ? '🎉 تم التسجيل!' : '🎉 Subscribed!');
    } finally {
      setIsSubscribing(false);
    }
  };

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const CountdownBox = ({ value, label }: { value: number; label: string }) => (
    <div className="relative group">
      <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all"></div>
      <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-2xl p-4 md:p-6 border border-yellow-500/30 hover:border-yellow-400/50 transition-all hover:scale-105">
        <div className="text-4xl md:text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-500">
          {String(value).padStart(2, '0')}
        </div>
        <div className="text-xs md:text-sm font-bold text-gray-400 mt-2 uppercase tracking-widest">
          {label}
        </div>
      </div>
    </div>
  );

  const features = [
    {
      icon: <Shield className="text-yellow-400" size={32} />,
      titleEn: 'VIP Early Access',
      titleAr: 'وصول مبكر VIP',
      descEn: 'First access to buy LLTY at $0.001',
      descAr: 'أول فرصة لشراء LLTY بسعر $0.001'
    },
    {
      icon: <TrendingUp className="text-green-400" size={32} />,
      titleEn: '50% Bonus Tokens',
      titleAr: 'مكافأة 50% عملات إضافية',
      descEn: 'VIP buyers get 50% extra LLTY tokens',
      descAr: 'مشترو VIP يحصلون على 50% عملات إضافية'
    },
    {
      icon: <Users className="text-purple-400" size={32} />,
      titleEn: 'Limited Spots',
      titleAr: 'أماكن محدودة',
      descEn: 'Only 500 VIP spots available',
      descAr: 'فقط 500 مقعد VIP متاح'
    }
  ];

  const navLinks = [
    { id: 'about', icon: <FileText size={20} />, labelEn: 'About LLTY', labelAr: 'عن LLTY' },
    { id: 'tokenomics', icon: <Coins size={20} />, labelEn: 'Tokenomics', labelAr: 'اقتصاديات العملة' },
    { id: 'roadmap', icon: <TrendingUp size={20} />, labelEn: 'Roadmap', labelAr: 'خارطة الطريق' },
    { id: 'staking-info', icon: <PiggyBank size={20} />, labelEn: 'Staking', labelAr: 'التخزين' },
    { id: 'governance-info', icon: <Vote size={20} />, labelEn: 'Governance', labelAr: 'الحوكمة' },
    { id: 'profit-info', icon: <Building size={20} />, labelEn: 'Profit Sharing', labelAr: 'توزيع الأرباح' },
  ];

  return (
    <div className="relative">
      {/* Hero Section with Countdown */}
      <section className="relative min-h-screen flex flex-col items-center justify-center py-16 px-4 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <div className="mb-8">
            <Rocket className="mx-auto text-yellow-400 mb-4 animate-bounce" size={80} />
          </div>

          <div className="mb-4">
            <span className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 text-yellow-400 font-bold">
              <Sparkles size={18} />
              {lang === 'ar' ? '🚀 الإطلاق الكبير قريباً' : '🚀 Grand Launch Coming Soon'}
              <Sparkles size={18} />
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-6">
            <span className="text-white">{lang === 'ar' ? 'استعد لـ' : 'Get Ready for'}</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-500">
              {lang === 'ar' ? 'البيع المسبق VIP' : 'VIP Presale'}
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
            {lang === 'ar'
              ? 'أول عملة استثمار عقاري عربية مدعومة بعقارات حقيقية. سجّل الآن لتكون من أوائل المستثمرين واحصل على أفضل سعر!'
              : 'The first Arab real estate investment token backed by real properties. Register now to be among the first investors and get the best price!'}
          </p>

          {/* Countdown */}
          <div className="mb-12">
            <p className="text-sm md:text-base text-gray-400 mb-6 uppercase tracking-widest font-bold flex items-center justify-center gap-2">
              <Clock size={20} />
              {lang === 'ar' ? 'البيع المسبق يبدأ خلال' : 'Presale Starts In'}
            </p>
            <div className="grid grid-cols-4 gap-3 md:gap-6 max-w-3xl mx-auto">
              <CountdownBox value={timeLeft.days} label={lang === 'ar' ? 'يوم' : 'Days'} />
              <CountdownBox value={timeLeft.hours} label={lang === 'ar' ? 'ساعة' : 'Hours'} />
              <CountdownBox value={timeLeft.minutes} label={lang === 'ar' ? 'دقيقة' : 'Minutes'} />
              <CountdownBox value={timeLeft.seconds} label={lang === 'ar' ? 'ثانية' : 'Seconds'} />
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {features.map((feature, index) => (
              <div key={index} className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 hover:border-yellow-500/30 transition-all hover:scale-105">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-lg font-bold text-white mb-2">
                  {lang === 'ar' ? feature.titleAr : feature.titleEn}
                </h3>
                <p className="text-sm text-gray-400">
                  {lang === 'ar' ? feature.descAr : feature.descEn}
                </p>
              </div>
            ))}
          </div>

          {/* VIP Price Highlight */}
          <div className="mb-12 p-6 rounded-2xl bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30">
            <p className="text-gray-400 mb-2">{lang === 'ar' ? 'سعر VIP الحصري' : 'Exclusive VIP Price'}</p>
            <p className="text-5xl md:text-6xl font-black text-yellow-400">$0.001</p>
            <p className="text-sm text-gray-500 mt-2">
              {lang === 'ar' ? 'السعر التالي: $0.004 (زيادة 300%)' : 'Next price: $0.004 (300% increase)'}
            </p>
          </div>

          {/* Notification Signup */}
          <div className="max-w-xl mx-auto mb-16">
            <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-3xl p-8 border border-yellow-500/20">
              {subscribed ? (
                <div className="text-center">
                  <CheckCircle className="mx-auto text-green-400 mb-4" size={64} />
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {lang === 'ar' ? '🎉 أنت مسجل!' : '🎉 You\'re Subscribed!'}
                  </h3>
                  <p className="text-gray-400">
                    {lang === 'ar' ? 'سنرسل لك إشعارًا فور بدء البيع المسبق' : 'We\'ll notify you when presale starts'}
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-center gap-2 mb-6">
                    <Bell className="text-yellow-400 animate-bounce" size={28} />
                    <h3 className="text-xl md:text-2xl font-bold text-white">
                      {lang === 'ar' ? 'احصل على إشعار الإطلاق' : 'Get Launch Notification'}
                    </h3>
                  </div>
                  <p className="text-gray-400 mb-6 text-sm">
                    {lang === 'ar' ? 'كن أول من يعلم عند بدء البيع المسبق' : 'Be the first to know when presale starts'}
                  </p>
                  <div className="space-y-4">
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={lang === 'ar' ? 'البريد الإلكتروني' : 'Email address'}
                        className="w-full pl-12 pr-4 py-4 rounded-xl bg-slate-700/50 border border-gray-600 text-white placeholder-gray-500 focus:border-yellow-500 focus:outline-none"
                      />
                    </div>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder={lang === 'ar' ? 'رقم الهاتف (اختياري)' : 'Phone (optional)'}
                        className="w-full pl-12 pr-4 py-4 rounded-xl bg-slate-700/50 border border-gray-600 text-white placeholder-gray-500 focus:border-yellow-500 focus:outline-none"
                      />
                    </div>
                    <button
                      onClick={handleSubscribe}
                      disabled={isSubscribing}
                      className="w-full py-4 rounded-xl font-bold text-lg transition-all hover:scale-105 disabled:opacity-50"
                      style={{ background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)', color: '#1e293b' }}
                    >
                      {isSubscribing ? (lang === 'ar' ? 'جاري التسجيل...' : 'Subscribing...') : (lang === 'ar' ? 'أبلغني عند الإطلاق' : 'Notify Me on Launch')}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Social Proof */}
          <div className="flex flex-wrap items-center justify-center gap-8 text-gray-400 mb-8">
            <div className="flex items-center gap-2">
              <Users size={20} />
              <span className="font-bold text-white">2,500+</span>
              <span>{lang === 'ar' ? 'مسجل' : 'Registered'}</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp size={20} />
              <span className="font-bold text-yellow-400">$0.001</span>
              <span>{lang === 'ar' ? 'سعر VIP' : 'VIP Price'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield size={20} />
              <span className="font-bold text-white">50%</span>
              <span>{lang === 'ar' ? 'مكافأة إضافية' : 'Bonus'}</span>
            </div>
          </div>

          {/* Scroll Down Indicator */}
          <div className="animate-bounce">
            <ChevronDown className="mx-auto text-yellow-400" size={32} />
            <p className="text-sm text-gray-500">{lang === 'ar' ? 'اكتشف المزيد' : 'Learn More'}</p>
          </div>
        </div>
      </section>

      {/* Navigation Links Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-transparent to-slate-900/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-white mb-4">
            {lang === 'ar' ? 'تعرف على LLTY' : 'Learn About LLTY'}
          </h2>
          <p className="text-center text-gray-400 mb-12">
            {lang === 'ar' ? 'اكتشف كل ما تحتاج معرفته عن عملة Loyalty' : 'Discover everything you need to know about Loyalty token'}
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {navLinks.map((link, index) => (
              <button
                key={index}
                onClick={() => scrollToSection(link.id)}
                className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-slate-800/50 border border-gray-700/50 hover:border-yellow-500/50 hover:bg-slate-700/50 transition-all hover:scale-105"
              >
                <div className="text-yellow-400">{link.icon}</div>
                <span className="text-white font-medium text-sm">
                  {lang === 'ar' ? link.labelAr : link.labelEn}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-8">
            <span className="text-yellow-400">{lang === 'ar' ? 'ما هي' : 'What is'}</span>
            <span className="text-white"> LLTY?</span>
          </h2>
          <div className="bg-slate-800/50 rounded-3xl p-8 border border-gray-700/50">
            <p className="text-lg text-gray-300 leading-relaxed mb-6">
              {lang === 'ar'
                ? 'Loyalty (LLTY) هي أول عملة رقمية عربية مدعومة باستثمارات عقارية حقيقية. نهدف إلى تمكين المستثمرين العرب من المشاركة في سوق العقارات العالمي من خلال تقنية البلوكتشين.'
                : 'Loyalty (LLTY) is the first Arab digital currency backed by real estate investments. We aim to enable Arab investors to participate in the global real estate market through blockchain technology.'}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { value: '10B', label: lang === 'ar' ? 'إجمالي العرض' : 'Total Supply' },
                { value: '$0.001', label: lang === 'ar' ? 'سعر VIP' : 'VIP Price' },
                { value: '50%', label: lang === 'ar' ? 'مكافأة VIP' : 'VIP Bonus' },
                { value: '80%', label: lang === 'ar' ? 'توزيع الأرباح' : 'Profit Share' },
              ].map((stat, i) => (
                <div key={i} className="text-center p-4 rounded-xl bg-slate-900/50">
                  <p className="text-2xl font-bold text-yellow-400">{stat.value}</p>
                  <p className="text-sm text-gray-400">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tokenomics Section */}
      <section id="tokenomics" className="py-20 px-4 bg-slate-900/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-8 text-white">
            {lang === 'ar' ? '📊 اقتصاديات العملة' : '📊 Tokenomics'}
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { percent: '40%', label: lang === 'ar' ? 'البيع المسبق' : 'Presale', color: 'yellow' },
              { percent: '20%', label: lang === 'ar' ? 'السيولة' : 'Liquidity', color: 'blue' },
              { percent: '15%', label: lang === 'ar' ? 'الفريق' : 'Team', color: 'purple' },
              { percent: '15%', label: lang === 'ar' ? 'التطوير' : 'Development', color: 'green' },
              { percent: '10%', label: lang === 'ar' ? 'التسويق' : 'Marketing', color: 'orange' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/50 border border-gray-700/50">
                <div className={`w-16 h-16 rounded-full bg-${item.color}-500/20 flex items-center justify-center`}>
                  <span className={`text-xl font-bold text-${item.color}-400`}>{item.percent}</span>
                </div>
                <span className="text-white font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roadmap Section */}
      <section id="roadmap" className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-8 text-white">
            {lang === 'ar' ? '🗺️ خارطة الطريق' : '🗺️ Roadmap'}
          </h2>
          <div className="space-y-6">
            {[
              { q: 'Q1 2026', title: lang === 'ar' ? 'الإطلاق' : 'Launch', desc: lang === 'ar' ? 'البيع المسبق VIP وبناء المجتمع' : 'VIP Presale & Community Building' },
              { q: 'Q2 2026', title: lang === 'ar' ? 'التوسع' : 'Expansion', desc: lang === 'ar' ? 'إدراج في DEX وأول استثمار عقاري' : 'DEX Listing & First Property Investment' },
              { q: 'Q3 2026', title: lang === 'ar' ? 'النمو' : 'Growth', desc: lang === 'ar' ? 'شراكات عقارية وتوزيع الأرباح' : 'Real Estate Partnerships & Profit Distribution' },
              { q: 'Q4 2026', title: lang === 'ar' ? 'العالمية' : 'Global', desc: lang === 'ar' ? 'التوسع الدولي وإدراج CEX' : 'International Expansion & CEX Listing' },
            ].map((item, i) => (
              <div key={i} className="flex gap-4 p-6 rounded-xl bg-slate-800/50 border border-gray-700/50 hover:border-yellow-500/30 transition-all">
                <div className="w-24 shrink-0">
                  <span className="px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-400 text-sm font-bold">{item.q}</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">{item.title}</h3>
                  <p className="text-gray-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Staking Info */}
      <section id="staking-info" className="py-20 px-4 bg-slate-900/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4 text-white">
            {lang === 'ar' ? '💎 تخزين LLTY' : '💎 LLTY Staking'}
          </h2>
          <p className="text-gray-400 mb-8">
            {lang === 'ar' ? 'احصل على عوائد سنوية تصل إلى 12% من خلال تخزين عملاتك' : 'Earn up to 12% APY by staking your tokens'}
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { period: lang === 'ar' ? '6 أشهر' : '6 Months', apy: '5%' },
              { period: lang === 'ar' ? 'سنة' : '1 Year', apy: '8%' },
              { period: lang === 'ar' ? '3 سنوات' : '3 Years', apy: '12%' },
            ].map((tier, i) => (
              <div key={i} className="p-6 rounded-2xl bg-slate-800/50 border border-purple-500/30">
                <p className="text-gray-400 mb-2">{tier.period}</p>
                <p className="text-4xl font-bold text-purple-400">{tier.apy}</p>
                <p className="text-sm text-gray-500">{lang === 'ar' ? 'عائد سنوي' : 'APY'}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Governance Info */}
      <section id="governance-info" className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4 text-white">
            {lang === 'ar' ? '🏛️ حوكمة DAO' : '🏛️ DAO Governance'}
          </h2>
          <p className="text-gray-400 mb-8">
            {lang === 'ar' ? 'شارك في اتخاذ القرارات وصوّت على مقترحات المشروع' : 'Participate in decision-making and vote on project proposals'}
          </p>
          <div className="bg-slate-800/50 rounded-2xl p-8 border border-blue-500/30">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="text-left">
                <h3 className="text-xl font-bold text-white mb-4">{lang === 'ar' ? 'مميزات الحوكمة' : 'Governance Features'}</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>✓ {lang === 'ar' ? 'التصويت على الاستثمارات العقارية' : 'Vote on property investments'}</li>
                  <li>✓ {lang === 'ar' ? 'اقتراح تغييرات على البروتوكول' : 'Propose protocol changes'}</li>
                  <li>✓ {lang === 'ar' ? 'المشاركة في قرارات المجتمع' : 'Participate in community decisions'}</li>
                </ul>
              </div>
              <div className="text-left">
                <h3 className="text-xl font-bold text-white mb-4">{lang === 'ar' ? 'قوة التصويت' : 'Voting Power'}</h3>
                <p className="text-gray-400">
                  {lang === 'ar' ? 'قوة تصويتك = عملاتك المخزّنة × مدة التخزين' : 'Your voting power = Staked tokens × Lock duration'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Profit Sharing Info */}
      <section id="profit-info" className="py-20 px-4 bg-slate-900/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4 text-white">
            {lang === 'ar' ? '💰 توزيع الأرباح' : '💰 Profit Distribution'}
          </h2>
          <p className="text-gray-400 mb-8">
            {lang === 'ar' ? 'احصل على حصتك من أرباح العقارات كل ربع سنة' : 'Receive your share of property profits every quarter'}
          </p>
          <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-2xl p-8 border border-green-500/30">
            <p className="text-6xl font-bold text-green-400 mb-4">80%</p>
            <p className="text-xl text-white mb-2">{lang === 'ar' ? 'من صافي الأرباح' : 'of Net Profits'}</p>
            <p className="text-gray-400">
              {lang === 'ar' ? 'يتم توزيعها على حاملي العملة بناءً على حصتهم' : 'Distributed to token holders based on their share'}
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            {lang === 'ar' ? 'لا تفوت فرصة VIP!' : "Don't Miss the VIP Opportunity!"}
          </h2>
          <p className="text-gray-400 mb-8">
            {lang === 'ar' ? 'سجّل الآن لتكون من أوائل المستثمرين' : 'Register now to be among the first investors'}
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)', color: '#1e293b' }}
          >
            {lang === 'ar' ? '⬆️ سجّل الآن' : '⬆️ Register Now'}
          </button>
        </div>
      </section>
    </div>
  );
};

export default PreLaunchCountdown;
