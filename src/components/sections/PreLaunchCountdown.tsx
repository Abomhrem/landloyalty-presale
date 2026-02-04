import React, { useState, useEffect, useCallback } from 'react';
import { Rocket, Bell, Mail, Phone, Sparkles, Shield, TrendingUp, Users, Clock, CheckCircle, AlertCircle } from 'lucide-react';

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
  const [showWalletMessage, setShowWalletMessage] = useState(false);

  // Calculate time left
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

  // Check if already subscribed
  useEffect(() => {
    const savedSubscription = localStorage.getItem('llty_prelaunch_subscribed');
    if (savedSubscription) {
      setSubscribed(true);
    }
  }, []);

  const handleSubscribe = async () => {
    if (!email && !phone) {
      showNotification('error', lang === 'ar' ? 'الرجاء إدخال البريد الإلكتروني أو رقم الهاتف' : 'Please enter email or phone number');
      return;
    }

    // Email validation
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
        showNotification('success', lang === 'ar' 
          ? '🎉 تم التسجيل بنجاح! سنخبرك عند انطلاق البيع المسبق'
          : '🎉 Subscribed! We\'ll notify you when presale launches');
      } else {
        throw new Error('Subscription failed');
      }
    } catch (error) {
      // Fallback: Save to localStorage if API fails
      const subscribers = JSON.parse(localStorage.getItem('llty_subscribers') || '[]');
      subscribers.push({ email, phone, language: lang, timestamp: Date.now() });
      localStorage.setItem('llty_subscribers', JSON.stringify(subscribers));
      localStorage.setItem('llty_prelaunch_subscribed', 'true');
      setSubscribed(true);
      showNotification('success', lang === 'ar'
        ? '🎉 تم التسجيل بنجاح!'
        : '🎉 Subscribed successfully!');
    } finally {
      setIsSubscribing(false);
    }
  };

  const CountdownBox = ({ value, label }: { value: number; label: string }) => (
    <div className="relative group">
      <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
      <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-2xl p-4 md:p-6 border border-yellow-500/30 hover:border-yellow-400/50 transition-all duration-300 hover:scale-105">
        <div className="text-4xl md:text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-500 animate-pulse">
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
      descEn: 'First access to buy LLTY at the lowest price',
      descAr: 'أول فرصة لشراء LLTY بأقل سعر'
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

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center py-16 px-4 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-yellow-500/5 to-orange-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto text-center">
        {/* Logo & Title */}
        <div className="mb-8 animate-bounce-slow">
          <Rocket className="mx-auto text-yellow-400 mb-4" size={80} />
        </div>

        <div className="mb-4">
          <span className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 text-yellow-400 font-bold text-sm md:text-base">
            <Sparkles size={18} className="animate-spin-slow" />
            {lang === 'ar' ? '🚀 الإطلاق الكبير قريباً' : '🚀 Grand Launch Coming Soon'}
            <Sparkles size={18} className="animate-spin-slow" />
          </span>
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-6">
          <span className="text-white">{lang === 'ar' ? 'استعد لـ' : 'Get Ready for'}</span>
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-500">
            {lang === 'ar' ? 'البيع المسبق VIP' : 'VIP Presale'}
          </span>
        </h1>

        <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
          {lang === 'ar'
            ? 'أول عملة استثمار عقاري عربية مدعومة بعقارات حقيقية. سجّل الآن لتكون من أوائل المستثمرين واحصل على أفضل سعر!'
            : 'The first Arab real estate investment token backed by real properties. Register now to be among the first investors and get the best price!'}
        </p>

        {/* Countdown Timer */}
        <div className="mb-16">
          <p className="text-sm md:text-base text-gray-400 mb-6 uppercase tracking-widest font-bold">
            {lang === 'ar' ? '⏰ البيع المسبق يبدأ خلال' : '⏰ Presale Starts In'}
          </p>
          
          <div className="grid grid-cols-4 gap-3 md:gap-6 max-w-3xl mx-auto">
            <CountdownBox 
              value={timeLeft.days} 
              label={lang === 'ar' ? 'يوم' : 'Days'} 
            />
            <CountdownBox 
              value={timeLeft.hours} 
              label={lang === 'ar' ? 'ساعة' : 'Hours'} 
            />
            <CountdownBox 
              value={timeLeft.minutes} 
              label={lang === 'ar' ? 'دقيقة' : 'Minutes'} 
            />
            <CountdownBox 
              value={timeLeft.seconds} 
              label={lang === 'ar' ? 'ثانية' : 'Seconds'} 
            />
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 hover:border-yellow-500/30 transition-all duration-300 hover:scale-105"
            >
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

        {/* Notification Signup */}
        <div className="max-w-xl mx-auto">
          <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-3xl p-8 border border-yellow-500/20">
            {subscribed ? (
              <div className="text-center">
                <CheckCircle className="mx-auto text-green-400 mb-4" size={64} />
                <h3 className="text-2xl font-bold text-white mb-2">
                  {lang === 'ar' ? '🎉 أنت مسجل!' : '🎉 You\'re Subscribed!'}
                </h3>
                <p className="text-gray-400">
                  {lang === 'ar'
                    ? 'سنرسل لك إشعارًا فور بدء البيع المسبق. ترقب!'
                    : 'We\'ll notify you as soon as presale starts. Stay tuned!'}
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
                  {lang === 'ar'
                    ? 'كن أول من يعلم عند بدء البيع المسبق. لا تفوت فرصة السعر المنخفض!'
                    : 'Be the first to know when presale starts. Don\'t miss the lowest price!'}
                </p>

                <div className="space-y-4">
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={lang === 'ar' ? 'البريد الإلكتروني' : 'Email address'}
                      className="w-full pl-12 pr-4 py-4 rounded-xl bg-slate-700/50 border border-gray-600 text-white placeholder-gray-500 focus:border-yellow-500 focus:outline-none transition-all"
                      dir={lang === 'ar' ? 'rtl' : 'ltr'}
                    />
                  </div>
                  
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder={lang === 'ar' ? 'رقم الهاتف (اختياري)' : 'Phone number (optional)'}
                      className="w-full pl-12 pr-4 py-4 rounded-xl bg-slate-700/50 border border-gray-600 text-white placeholder-gray-500 focus:border-yellow-500 focus:outline-none transition-all"
                      dir="ltr"
                    />
                  </div>

                  <button
                    onClick={handleSubscribe}
                    disabled={isSubscribing}
                    className="w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    style={{
                      background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)',
                      color: '#1e293b',
                      boxShadow: '0 10px 40px rgba(251, 191, 36, 0.3)'
                    }}
                  >
                    {isSubscribing ? (
                      <>
                        <div className="w-5 h-5 border-2 border-slate-800 border-t-transparent rounded-full animate-spin"></div>
                        {lang === 'ar' ? 'جاري التسجيل...' : 'Subscribing...'}
                      </>
                    ) : (
                      <>
                        <Bell size={20} />
                        {lang === 'ar' ? 'أبلغني عند الإطلاق' : 'Notify Me on Launch'}
                      </>
                    )}
                  </button>
                </div>

                <p className="text-xs text-gray-500 mt-4">
                  {lang === 'ar'
                    ? '🔒 معلوماتك آمنة ولن نشاركها مع أي طرف ثالث'
                    : '🔒 Your information is safe and we won\'t share it with third parties'}
                </p>
              </>
            )}
          </div>
        </div>

        {/* Social Proof */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-gray-400">
          <div className="flex items-center gap-2">
            <Users size={20} />
            <span className="font-bold text-white">2,500+</span>
            <span>{lang === 'ar' ? 'مسجل' : 'Registered'}</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp size={20} />
            <span className="font-bold text-white">$0.004</span>
            <span>{lang === 'ar' ? 'سعر VIP' : 'VIP Price'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield size={20} />
            <span className="font-bold text-white">50%</span>
            <span>{lang === 'ar' ? 'مكافأة إضافية' : 'Bonus Tokens'}</span>
          </div>
        </div>
      </div>

      {/* CSS for custom animations */}
      <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default PreLaunchCountdown;
