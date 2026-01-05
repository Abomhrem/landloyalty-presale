// LANDLOYALTY (LLTY) PRESALE - COMPLETE V2 WITH ALL FIXES

import React, { useState, useEffect } from 'react';
import {
  Wallet, Menu, X, CheckCircle, AlertCircle, Clock, Target,
  Shield, TrendingUp, Users, Coins, Building, Download,
  FileText, Zap, Globe, Send, Twitter, Instagram, Gift, Star, Award
} from 'lucide-react';
import * as anchor from '@coral-xyz/anchor';
import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL, TransactionInstruction } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, getAssociatedTokenAddress, createAssociatedTokenAccountInstruction } from '@solana/spl-token';

// Import real blockchain functions
import {
  fetchPresaleData as fetchPresaleDataReal,
  fetchUserData as fetchUserDataReal,
  buyTokensReal,
  fetchRealBalances,
  PROGRAM_ID as REAL_PROGRAM_ID,
  PRESALE_STATE_PDA
} from "./blockchain.js";

// LLTY LOGO COMPONENT
const LLTYLogo = ({ size = 64 }) => (
  <div className="relative" style={{ width: size, height: size }}>
    <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg transform rotate-45"></div>
    <div className="absolute inset-0 flex items-center justify-center">
      <Building className="text-slate-900" size={size * 0.6} strokeWidth={2.5} />
    </div>
  </div>
);

// TRANSLATIONS - COMPLETE BILINGUAL SUPPORT (رمز → عملة)
const translations = {
  en: {
    title: 'Loyalty',
    subtitle: 'First Arab Real Estate Investment Token',
    
    navigation: {
      vipAccess: 'VIP Access',
      bonuses: 'Bonuses',
      referrals: 'Referrals',
      about: 'About',
      tokenomics: 'Tokenomics',
      roadmap: 'Roadmap'
    },
    
    connectWallet: 'Connect Wallet',
    connecting: 'Connecting...',
    
    phase: 'Phase',
    vipActive: '👑 VIP Early Access Active',
    nextPriceIn: 'Next Price In',
    presaleEnded: 'Presale Ended',
    days: 'Days',
    hours: 'Hours',
    minutes: 'Minutes',
    seconds: 'Seconds',
    tokenPrice: 'Current Price',
    
    totalRaised: 'Total Raised',
    of: 'of',
    purchased: 'Purchased',
    
    vipTitle: '🌟 VIP Early Access',
    vipDescription: 'Be among the first 50 investors to secure the lowest price and exclusive benefits!',
    vipPrice: '💎 VIP Price: $0.001 per LLTY',
    vipMinPurchase: 'Minimum: $1,000',
    vipDuration: 'Duration: 2 days before public sale',
    vipSlots: 'VIP Slots Remaining',
    vipBenefits: 'VIP Exclusive Benefits:',
    vipBenefit1: '✓ Lowest price: $0.001 per token (75% discount)',
    vipBenefit2: '✓ Priority access before public sale',
    vipBenefit3: '✓ Eligible for all bonus tiers',
    vipBenefit4: '✓ VIP badge and early supporter recognition',
    
    bonusTitle: '🎁 Investment Bonus Tiers',
    bonusDescription: 'Get extra LLTY tokens based on your investment amount',
    bonusTier1: '💰 Buy $1,000+: Get 4% Bonus',
    bonusTier2: '💎 Buy $5,000+: Get 10% Bonus',
    bonusTier3: '👑 Buy $10,000+: Get 15% Bonus',
    bonusExample: 'Example: Invest $10,000 → Get 15% bonus = 11,500 LLTY tokens total!',
    
    referralTitle: '👥 Referral Program',
    referralDescription: 'Earn rewards by inviting friends to invest',
    referralBonus: 'Referral Bonus: 4% of their purchases',
    referralHow: 'How It Works:',
    referralStep1: '1. Share your unique referral link',
    referralStep2: '2. Your friend invests using your link',
    referralStep3: '3. You get 4% bonus from their purchase',
    referralExample: '💰 Example: Friend invests $5,000 → You get $200 worth of LLTY',
    yourReferralLink: 'Your Referral Link',
    
    investNow: 'Invest Now',
    selectCurrency: 'Select Payment Currency',
    enterAmount: 'Enter Amount (USD)',
    youWillReceive: 'You Will Receive',
    buy: 'Buy LLTY Tokens',
    processing: 'Processing...',
    yourBalance: 'Your LLTY Balance',
    walletNotConnected: 'Please connect your wallet to invest',
    
    withdrawalTitle: 'Withdrawal Information',
    withdrawalDuring: 'During presale: Withdraw up to 60% of purchased tokens',
    withdrawalAfter: 'After presale ends: Withdraw 100% of tokens',
    withdrawalReason: 'Protection against rug pulls - built-in security system',
    
    aboutTitle: 'About Loyalty (LLTY)',
    aboutText: `Loyalty (LLTY) is the first Arab digital currency that combines advanced blockchain technology with real estate investment in the most important Arab and Middle Eastern cities. We are not just a cryptocurrency - we are a comprehensive Arab economic empowerment movement.

🏛️ **Why Loyalty?**

**From Arabs to Arabs:** Loyalty is the first cryptocurrency project designed specifically for Arab investors, by an Arab team, focusing on Arab markets. We understand your needs and aspirations and speak your language.

**Safe and Secure Investment:** Every LLTY token is backed by real estate assets in the finest Middle Eastern cities: Dubai, Abu Dhabi, Cairo, Alexandria, Casablanca, Beirut, Amman, Baghdad, and Damascus. Your investment is not just numbers - it's a share in tangible real estate.

**Exceptional Returns:** With the real estate sector in the region growing at record rates, Loyalty gives you the opportunity to participate in this growth and benefit from increasing returns. Our experts predict growth ranging from 300-500% in the first three years.

**Complete Transparency and High Security:** All our transactions are recorded on the blockchain, audited by independent parties, and protected by the highest cybersecurity standards. No secrets, no surprises - just complete transparency.

💚 **Our Social Commitment:**

We believe in social responsibility. Therefore, we have allocated 1% of total tokens to support affected and deprived areas in the Middle East and Gulf region. When you invest in Loyalty, you're not just building your wealth - you're contributing to rebuilding our communities.

🚀 **Expansion and Growth:**

We start with 9 major cities, but our vision is much broader. Our plan includes expansion throughout the Gulf, Middle East, and North Africa regions in upcoming phases. Your investment today is part of a regional real estate empire.

📈 **Exceptional Opportunity, Limited Time:**

The presale is your golden opportunity to enter at preferential prices before listing on major exchanges. Prices increase with each phase, and quantity is limited. Don't miss this historic opportunity!

🔒 **Security and Trust:**

- Smart contract audited by leading blockchain security firms
- Multi-signature wallet system for fund protection  
- Regular third-party audits and transparent reporting
- Legal compliance in all operating jurisdictions

💼 **Professional Team:**

Our team consists of experienced professionals in real estate, blockchain technology, and financial markets, with over 50 years of combined experience in the Arab region.

🌍 **Vision for the Future:**

Loyalty aims to become the leading platform for real estate investment in the Arab world, providing easy access to premium properties and creating sustainable wealth for our community.`,
    
    howItWorks: 'How Loyalty Works',
    mechanicsTitle1: '1. Buy LLTY Tokens',
    mechanicsDesc1: 'Purchase tokens during presale at discounted prices with multiple payment options',
    mechanicsTitle2: '2. Own Real Estate',
    mechanicsDesc2: 'Each token represents fractional ownership in a diversified portfolio of premium properties',
    mechanicsTitle3: '3. Earn Returns',
    mechanicsDesc3: 'Benefit from rental income, property appreciation, and token value growth',
    
    cities: 'Investment Cities',
    cityList: 'Properties in: Dubai, Abu Dhabi, Cairo, Alexandria, Casablanca, Beirut, Amman, Baghdad, Damascus',
    
    tokenomicsTitle: 'LLTY Tokenomics',
    presaleAllocation: 'Presale',
    liquidityPool: 'Liquidity Pool',
    team: 'Team',
    marketing: 'Marketing',
    reserve: 'Reserve',
    socialImpact: 'Social Impact',
    crisisAreas: 'Crisis Areas',
    
    roadmapTitle: 'Development Roadmap',
    
    security: 'Security & Transparency',
    securityText: 'Smart contract audited by leading security firms. All transactions transparent on blockchain.',
    whitepaperAr: 'Whitepaper (Arabic)',
    whitepaperEn: 'Whitepaper (English)'
  },
  
  ar: {
    title: 'لويالتي',
    subtitle: 'أول عملة استثمار عقاري عربي',
    
    navigation: {
      vipAccess: 'الوصول المبكر VIP',
      bonuses: 'المكافآت',
      referrals: 'برنامج الإحالة',
      about: 'عن المشروع',
      tokenomics: 'اقتصاديات LLTY',
      roadmap: 'خارطة الطريق'
    },
    
    connectWallet: 'ربط المحفظة',
    connecting: 'جاري الاتصال...',
    
    phase: 'المرحلة',
    vipActive: '👑 الوصول المبكر VIP نشط',
    nextPriceIn: 'السعر القادم خلال',
    presaleEnded: 'انتهى البيع المسبق',
    days: 'يوم',
    hours: 'ساعة',
    minutes: 'دقيقة',
    seconds: 'ثانية',
    tokenPrice: 'السعر الحالي',
    
    totalRaised: 'المبلغ المجموع',
    of: 'من',
    purchased: 'تم شراؤها',
    
    vipTitle: '🌟 الوصول المبكر VIP',
    vipDescription: 'كن من بين أول 50 مستثمراً لتحصل على أقل سعر ومزايا حصرية!',
    vipPrice: '💎 سعر VIP: $0.001 لكل LLTY',
    vipMinPurchase: 'الحد الأدنى: $1,000',
    vipDuration: 'المدة: يومان قبل البيع العام',
    vipSlots: 'المقاعد المتبقية VIP',
    vipBenefits: 'مزايا VIP الحصرية:',
    vipBenefit1: '✓ أقل سعر: $0.001 لكل عملة (خصم 75%)',
    vipBenefit2: '✓ أولوية الوصول قبل البيع العام',
    vipBenefit3: '✓ مؤهل لجميع مستويات المكافآت',
    vipBenefit4: '✓ شارة VIP وتقدير كداعم مبكر',
    
    bonusTitle: '🎁 مستويات مكافآت الاستثمار',
    bonusDescription: 'احصل على عملات LLTY إضافية بناءً على مبلغ استثمارك',
    bonusTier1: '💰 اشترِ $1,000+: احصل على 4% مكافأة',
    bonusTier2: '💎 اشترِ $5,000+: احصل على 10% مكافأة',
    bonusTier3: '👑 اشترِ $10,000+: احصل على 15% مكافأة',
    bonusExample: 'مثال: استثمر $10,000 ← احصل على مكافأة 15% = 11,500 عملة LLTY إجمالاً!',
    
    referralTitle: '👥 برنامج الإحالة',
    referralDescription: 'اكسب مكافآت بدعوة أصدقائك للاستثمار',
    referralBonus: 'مكافأة الإحالة: 4% من مشترياتهم',
    referralHow: 'كيف يعمل:',
    referralStep1: '1. شارك رابط الإحالة الخاص بك',
    referralStep2: '2. صديقك يستثمر باستخدام رابطك',
    referralStep3: '3. تحصل على 4% إضافية من مشترياته',
    referralExample: '💰 مثال: صديقك يستثمر $5,000 ← تحصل على $200 من LLTY',
    yourReferralLink: 'رابط الإحالة الخاص بك',
    
    investNow: 'استثمر الآن',
    selectCurrency: 'اختر العملة',
    enterAmount: 'أدخل المبلغ (دولار)',
    youWillReceive: 'ستحصل على',
    buy: 'شراء عملات LLTY',
    processing: 'جاري المعالجة...',
    yourBalance: 'رصيدك من LLTY',
    walletNotConnected: 'يرجى ربط محفظتك للاستثمار',
    
    withdrawalTitle: 'معلومات السحب',
    withdrawalDuring: 'خلال البيع المسبق: يمكن سحب 60% فقط',
    withdrawalAfter: 'بعد انتهاء البيع المسبق: يمكن سحب 100%',
    withdrawalReason: 'حماية ضد الاحتيال - نظام أمان مدمج',
    
    aboutTitle: 'عن Loyalty',
    aboutText: `لويالتي (LLTY) هو أول عملة رقمية عربية تجمع بين تقنية البلوكتشين المتقدمة والاستثمار العقاري في أهم المدن العربية والشرق أوسطية. نحن لسنا مجرد عملة رقمية - نحن حركة تمكين اقتصادي عربي شامل.

🏛️ **لماذا لويالتي؟**

**من العرب إلى العرب:** لويالتي هو أول مشروع عملة رقمية مصمم خصيصاً للمستثمرين العرب، بواسطة فريق عربي، يركز على الأسواق العربية. نحن نفهم احتياجاتك وطموحاتك ونتحدث لغتك.

**استثمار آمن ومضمون:** كل عملة LLTY مدعومة بأصول عقارية حقيقية في أرقى مدن الشرق الأوسط: دبي، أبوظبي، القاهرة، الإسكندرية، الدار البيضاء، بيروت، عمان، بغداد، ودمشق. استثمارك ليس مجرد أرقام - إنه حصة في عقارات ملموسة.

**عوائد استثنائية:** مع نمو قطاع العقارات في المنطقة بمعدلات قياسية، يمنحك لويالتي فرصة للمشاركة في هذا النمو والاستفادة من العوائد المتزايدة. خبراؤنا يتوقعون نمواً يتراوح بين 300-500% في السنوات الثلاث الأولى.

**شفافية كاملة وأمان عالي:** جميع معاملاتنا مسجلة على البلوكتشين، مدققة من قبل جهات مستقلة، ومحمية بأعلى معايير الأمان السيبراني. لا أسرار، لا مفاجآت - فقط شفافية تامة.

💚 **التزامنا الاجتماعي:**

نحن نؤمن بالمسؤولية الاجتماعية. لذلك خصصنا 1% من إجمالي العملات لدعم المناطق المنكوبة والمحرومة في الشرق الأوسط ومنطقة الخليج. عندما تستثمر في لويالتي، أنت لا تبني ثروتك فقط - بل تساهم في إعادة بناء مجتمعاتنا.

🚀 **التوسع والنمو:**

نبدأ بـ 9 مدن رئيسية، لكن رؤيتنا أوسع بكثير. خطتنا تشمل التوسع في كامل منطقة الخليج والشرق الأوسط وشمال أفريقيا خلال المراحل القادمة. استثمارك اليوم هو جزء من إمبراطورية عقارية إقليمية.

📈 **فرصة استثنائية، وقت محدود:**

البيع المسبق هو فرصتك الذهبية للدخول بأسعار مميزة قبل الإدراج في البورصات الكبرى. الأسعار تزداد مع كل مرحلة، والكمية محدودة. لا تفوت هذه الفرصة التاريخية!

🔒 **الأمان والثقة:**

- العقد الذكي مدقق من قبل شركات أمان البلوكتشين الرائدة
- نظام محفظة متعدد التوقيعات لحماية الأموال
- تدقيقات منتظمة من جهات خارجية وتقارير شفافة
- امتثال قانوني في جميع نطاقات العمل

💼 **فريق محترف:**

يتكون فريقنا من محترفين ذوي خبرة في العقارات وتقنية البلوكتشين والأسواق المالية، بخبرة مجتمعة تزيد عن 50 عاماً في المنطقة العربية.

🌍 **رؤية المستقبل:**

يهدف لويالتي لأن يصبح المنصة الرائدة للاستثمار العقاري في العالم العربي، موفراً وصولاً سهلاً للعقارات المتميزة وخلق ثروة مستدامة لمجتمعنا.`,
    
    howItWorks: 'كيف يعمل',
    mechanicsTitle1: '1. اشترِ عملات LLTY',
    mechanicsDesc1: 'اشترِ العملات أثناء البيع المسبق بأسعار مخفضة مع خيارات دفع متعددة',
    mechanicsTitle2: '2. امتلك عقارات',
    mechanicsDesc2: 'كل عملة تمثل ملكية جزئية في محفظة متنوعة من العقارات المتميزة',
    mechanicsTitle3: '3. اكسب العوائد',
    mechanicsDesc3: 'استفد من دخل الإيجار وارتفاع قيمة العقارات ونمو قيمة العملة',
    
    cities: 'المدن',
    cityList: 'عقارات في: دبي، أبوظبي، القاهرة، الإسكندرية، الدار البيضاء، بيروت، عمان، بغداد، دمشق',
    
    tokenomicsTitle: 'اقتصاديات LLTY',
    presaleAllocation: 'البيع المسبق',
    liquidityPool: 'مجمع السيولة',
    team: 'الفريق',
    marketing: 'التسويق',
    reserve: 'الاحتياطي',
    socialImpact: 'الأثر الاجتماعي',
    crisisAreas: 'مناطق الأزمات',
    
    roadmapTitle: 'خارطة الطريق',
    
    security: 'الأمان والشفافية',
    securityText: 'العقد الذكي مدقق من قبل شركات أمان رائدة. جميع المعاملات شفافة على البلوكتشين.',
    whitepaperAr: 'الورقة البيضاء (عربي)',
    whitepaperEn: 'الورقة البيضاء (إنجليزي)'
  }
};

// CONTRACT CONFIGURATION
const NETWORK = 'devnet';
const RPC_ENDPOINT = NETWORK === 'mainnet-beta' 
  ? 'https://api.mainnet-beta.solana.com'
  : 'https://api.devnet.solana.com';

const PROGRAM_ID = new PublicKey('2oArywYY7xHyoV1xoF9g9QKkyKDHe3rA9kRyu1H8ZQxo');
const USDC_MINT = new PublicKey('4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU');
const USDT_MINT = new PublicKey('EJwZgeZrdC8TXTQbQBoL6bfuAnFUUy1PVCMB4DYPzVaS');

const PRESALE_START = new Date('2026-01-01T00:00:00Z').getTime();
const VIP_DURATION = 2 * 24 * 60 * 60 * 1000;
const PHASE_DURATION = 10 * 24 * 60 * 60 * 1000;

const PHASE_PRICES = { vip: 0.001, 1: 0.004, 2: 0.005, 3: 0.006 };
const PHASE_PRICES_DISPLAY = { vip: '0.001', 1: '0.004', 2: '0.005', 3: '0.006' };
const PRESALE_TARGET = 29500000;
const TOTAL_LLTY_SUPPLY = 10000000000;
const PRESALE_LLTY_TOKENS = 4000000000;

// Cities with FIXED images
const citiesData = [
  { name: 'Dubai, UAE', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=400&fit=crop' },
  { name: 'Riyadh, Saudi Arabia', image: 'https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?w=800&h=400&fit=crop' },
  { name: 'Cairo, Egypt', image: 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=800&h=400&fit=crop' },
  { name: 'Doha, Qatar', image: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800&h=400&fit=crop' },
  { name: 'Kuwait City, Kuwait', image: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=800&h=400&fit=crop' },
  { name: 'Amman, Jordan', image: 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=800&h=400&fit=crop' },
  { name: 'Beirut, Lebanon', image: 'https://images.unsplash.com/photo-1580312388476-2fa5bb0796c3?w=800&h=400&fit=crop' },
  { name: 'Casablanca, Morocco', image: 'https://images.unsplash.com/photo-1569252104-04e5b5a35e42?w=800&h=400&fit=crop' },
  { name: 'Tunis, Tunisia', image: 'https://images.unsplash.com/photo-1551846751-ccb8f8280a4f?w=800&h=400&fit=crop' }
];

// Roadmap with FULL Arabic translations
const roadmapData = [
  { quarter: 'Q1 2026', title: 'Presale Launch', titleAr: 'إطلاق البيع المسبق', desc: 'VIP early access and public presale', descAr: 'الوصول المبكر VIP والبيع المسبق العام' },
  { quarter: 'Q2 2026', title: 'Global Marketing', titleAr: 'التسويق العالمي', desc: 'Expansion and partnerships', descAr: 'التوسع والشراكات' },
  { quarter: 'Q3 2026', title: 'Exchange Listings', titleAr: 'الإدراج في البورصات', desc: 'Major DEX and CEX listings', descAr: 'الإدراج في البورصات الكبرى' },
  { quarter: 'Q4 2026', title: 'First $50M Property', titleAr: 'أول عقار بـ 50 مليون دولار', desc: 'Initial real estate acquisition', descAr: 'أول استحواذ عقاري' },
  { quarter: 'Q1 2027', title: 'Regional Expansion', titleAr: 'التوسع الإقليمي', desc: 'Enter 3 new Arab markets', descAr: 'دخول 3 أسواق عربية جديدة' },
  { quarter: 'Q2 2027', title: '$250M Portfolio', titleAr: 'محفظة بـ 250 مليون دولار', desc: 'Diversified property portfolio', descAr: 'محفظة عقارية متنوعة' },
  { quarter: 'Q3 2027', title: 'Int\'l Partnerships', titleAr: 'شراكات دولية', desc: 'Global real estate networks', descAr: 'شبكات عقارية عالمية' },
  { quarter: 'Q4 2027', title: '$500M+ Empire', titleAr: 'إمبراطورية +500 مليون', desc: 'Major portfolio milestone', descAr: 'معلم رئيسي للمحفظة' }
];// ============================================================================

const LLTYPresale = () => {
  const [lang, setLang] = useState('ar');
  const [wallet, setWallet] = useState(null);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });
  
  const [currentPhase, setCurrentPhase] = useState(1);
  const [isVipPeriod, setIsVipPeriod] = useState(false);
  const [presaleEnded, setPresaleEnded] = useState(false);
  const [phaseTimeRemaining, setPhaseTimeRemaining] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  
  const [totalRaised, setTotalRaised] = useState(0);
  const [totalLLTYSold, setTotalLLTYSold] = useState(0);
  const [vipBuyersCount, setVipBuyersCount] = useState(0);
  
  const [currency, setCurrency] = useState('USDC');
  const [amount, setAmount] = useState('');
  const [purchased, setPurchased] = useState(0);
  const [walletBalances, setWalletBalances] = useState({ SOL: 0, USDC: 0, USDT: 0 });
  
  const [currentCityIndex, setCurrentCityIndex] = useState(0);

  const t = translations[lang];
  const progressPercentage = Math.min((totalRaised / PRESALE_TARGET) * 100, 100);

  // Auto-rotate cities
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCityIndex((prev) => (prev + 1) % citiesData.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Calculate phase and timer
  useEffect(() => {
    const updateTimer = () => {
      const now = Date.now();
      const elapsed = now - PRESALE_START;
      
      if (elapsed < 0) {
        setPhaseTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      
      if (elapsed < VIP_DURATION) {
        setIsVipPeriod(true);
        setCurrentPhase(0);
        const remaining = VIP_DURATION - elapsed;
        setPhaseTimeRemaining({
          days: Math.floor(remaining / (24 * 60 * 60 * 1000)),
          hours: Math.floor((remaining % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000)),
          minutes: Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000)),
          seconds: Math.floor((remaining % (60 * 1000)) / 1000)
        });
      } else {
        setIsVipPeriod(false);
        const phaseElapsed = elapsed - VIP_DURATION;
        const phase = Math.floor(phaseElapsed / PHASE_DURATION) + 1;
        
        if (phase > 3) {
          setPresaleEnded(true);
          setCurrentPhase(3);
          setPhaseTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        } else {
          setCurrentPhase(phase);
          const phaseRemaining = PHASE_DURATION - (phaseElapsed % PHASE_DURATION);
          setPhaseTimeRemaining({
            days: Math.floor(phaseRemaining / (24 * 60 * 60 * 1000)),
            hours: Math.floor((phaseRemaining % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000)),
            minutes: Math.floor((phaseRemaining % (60 * 60 * 1000)) / (60 * 1000)),
            seconds: Math.floor((phaseRemaining % (60 * 1000)) / 1000)
          });
        }
      }
    };
    
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch presale data
  const fetchPresaleData = async () => {
    try {
      const data = await fetchPresaleDataReal();
      
      setTotalRaised(data.totalRaised);
      setIsVipPeriod(data.isVipPeriod);
      setCurrentPhase(data.currentPhase);
      
      // Update phase end time for timer
      if (data.isVipPeriod) {
        setPhaseEndTime(data.vipEnd);
      } else {
        const phaseDuration = 10 * 24 * 60 * 60 * 1000;
        setPhaseEndTime(data.publicStart + (data.currentPhase + 1) * phaseDuration);
      }
      
    } catch (error) {
      console.error("Error fetching presale data:", error);
      showNotification("error", lang === "ar" ? "خطأ في تحميل البيانات" : "Error loading data");
    }
  };

  useEffect(() => {
    fetchPresaleData();
    const interval = setInterval(fetchPresaleData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Wallet connection
  const connectWallet = async () => {
    try {
      setLoading(true);
      const { solana } = window;
      
      if (!solana?.isPhantom) {
        showNotification("error", lang === "ar" ? "يرجى تثبيت محفظة Phantom" : "Please install Phantom wallet");
        window.open("https://phantom.app/", "_blank");
        return;
      }
      
      const response = await solana.connect();
      const publicKey = response.publicKey.toString();
      setWallet(publicKey);
      
      // Fetch REAL balances from blockchain
      const balances = await fetchRealBalances(response.publicKey);
      setWalletBalances(balances);
      
      // Fetch user purchase history from blockchain
      const userData = await fetchUserDataReal(publicKey);
      setPurchased(userData.totalPurchased);
      
      showNotification("success", lang === "ar" ? "تم الاتصال بنجاح!" : "Connected successfully!");
      
      await fetchPresaleData();
      
    } catch (error) {
      console.error("Connection error:", error);
      showNotification("error", lang === "ar" ? "فشل الاتصال" : "Connection failed");
    } finally {
      setLoading(false);
    }
  };

  const disconnectWallet = () => {
    setWallet(null);
    setBalance(0);
    setPurchased(0);
    showNotification('success', lang === 'ar' ? 'تم قطع الاتصال' : 'Disconnected');
  };

  const fetchUserData = async (walletAddress) => {
    try {
      const connection = new Connection(RPC_ENDPOINT);
      const publicKey = new PublicKey(walletAddress);
      
      const solBalance = await connection.getBalance(publicKey);
      setWalletBalances(prev => ({ ...prev, SOL: solBalance / LAMPORTS_PER_SOL }));
      
      setPurchased(Math.random() * 1000);
      setBalance(Math.random() * 10000);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => setNotification({ show: false, type: '', message: '' }), 5000);
  };

  const getUrgencyMessage = () => {
    if (isVipPeriod) {
      return lang === 'ar' ? '⚡ فترة VIP نشطة! فقط 50 مقعد متاح!' : '⚡ VIP Period Active! Only 50 Slots!';
    }
    const hoursLeft = Math.floor(phaseTimeRemaining.days * 24 + phaseTimeRemaining.hours);
    if (hoursLeft < 24) {
      return lang === 'ar' ? '⚡ أقل من 24 ساعة للسعر الحالي!' : '⚡ Less than 24 hours at this price!';
    }
    return lang === 'ar' ? `⏰ السعر يرتفع في المرحلة ${currentPhase + 1}` : `⏰ Price increases in Phase ${currentPhase + 1}`;
  };

  const getBonusPercentage = () => {
    const amt = parseFloat(amount) || 0;
    if (amt >= 10000) return 15;
    if (amt >= 5000) return 10;
    if (amt >= 1000) return 4;
    return 0;
  };

  const calculateTokenAmount = () => {
    const amt = parseFloat(amount) || 0;
    const price = isVipPeriod ? PHASE_PRICES.vip : PHASE_PRICES[currentPhase];
    const baseTokens = amt / price;
    const bonus = getBonusPercentage();
    return (baseTokens * (1 + bonus / 100)).toFixed(2);
  };

  const buyTokens = async () => {
    if (!wallet) {
      showNotification("error", t.walletNotConnected);
      return;
    }
    
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) {
      showNotification("error", lang === "ar" ? "أدخل مبلغاً صحيحاً" : "Enter valid amount");
      return;
    }
    
    if (isVipPeriod && amt < 1000) {
      showNotification("error", lang === "ar" ? "الحد الأدنى للVIP: $1,000" : "VIP minimum: $1,000");
      return;
    }
    
    // Check balance
    const currentBalance = walletBalances[currency];
    if (!currentBalance || currentBalance === 0) {
      showNotification("error", lang === "ar" ? `لا يوجد رصيد ${currency}` : `No ${currency} balance`);
      return;
    }
    
    // Calculate required amount (contract uses $150/SOL)
    let requiredAmount = amt;
    if (currency === "SOL") {
      requiredAmount = amt / 150;
    }
    
    // Verify sufficient balance
    if (currentBalance < requiredAmount) {
      showNotification("error", lang === "ar" 
        ? `رصيد غير كافٍ. لديك ${currentBalance.toFixed(4)} ${currency}`
        : `Insufficient balance. You have ${currentBalance.toFixed(4)} ${currency}`);
      return;
    }
    
    try {
      setLoading(true);
      showNotification("info", t.processing);
      
      // REAL BLOCKCHAIN TRANSACTION
      const result = await buyTokensReal(amt, currency, referralCode || undefined);
      
      // Calculate tokens (estimate for UI)
      const price = isVipPeriod ? PHASE_PRICES.vip : PHASE_PRICES[currentPhase];
      const baseTokens = amt / price;
      const bonus = getBonusPercentage();
      const totalTokens = baseTokens * (1 + bonus / 100);
      
      // Clear amount
      setAmount("");
      
      // Refresh blockchain data
      await fetchPresaleData();
      const userData = await fetchUserDataReal(wallet);
      setPurchased(userData.totalPurchased);
      
      // Refresh balances
      const publicKey = window.solana.publicKey;
      const balances = await fetchRealBalances(publicKey);
      setWalletBalances(balances);
      
      showNotification("success", lang === "ar" 
        ? `تم الشراء بنجاح! ${totalTokens.toLocaleString()} LLTY`
        : `Success! ${totalTokens.toLocaleString()} LLTY`);
      
      console.log("✅ Transaction:", result.signature);
      console.log("🔗 Explorer:", result.explorerUrl);
      
    } catch (error) {
      console.error("Purchase error:", error);
      showNotification("error", error.message || (lang === "ar" ? "فشلت العملية" : "Transaction failed"));
    } finally {
      setLoading(false);
    }
  };

  const shortenAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <div className={`min-h-screen ${lang === 'ar' ? 'rtl' : 'ltr'} font-sans`}
      style={{
        background: 'linear-gradient(to bottom, #0f172a 0%, #1e293b 50%, #334155 100%)',
        color: '#f1f5f9'
      }}>
      
      {/* HEADER */}
      <header className="sticky top-0 z-50 backdrop-blur-md border-b border-yellow-500/20"
        style={{ background: 'rgba(15, 23, 42, 0.95)' }}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <LLTYLogo size={48} />
              <div>
                <h1 className="text-2xl font-bold text-yellow-400">{t.title}</h1>
                <p className="text-xs text-gray-300 mt-2">{t.subtitle}</p>
              </div>
            </div>
            
            <div className="hidden lg:flex items-center gap-6">
              <button onClick={() => scrollToSection('vip')} className="text-gray-200 hover:text-yellow-400 transition-colors font-medium">
                {t.navigation.vipAccess}
              </button>
              <button onClick={() => scrollToSection('bonuses')} className="text-gray-200 hover:text-yellow-400 transition-colors font-medium">
                {t.navigation.bonuses}
              </button>
              <button onClick={() => scrollToSection('referrals')} className="text-gray-200 hover:text-yellow-400 transition-colors font-medium">
                {t.navigation.referrals}
              </button>
              <button onClick={() => scrollToSection('about')} className="text-gray-200 hover:text-yellow-400 transition-colors font-medium">
                {t.navigation.about}
              </button>
              <button onClick={() => scrollToSection('tokenomics')} className="text-gray-200 hover:text-yellow-400 transition-colors font-medium">
                {t.navigation.tokenomics}
              </button>
              <button onClick={() => scrollToSection('roadmap')} className="text-gray-200 hover:text-yellow-400 transition-colors font-medium">
                {t.navigation.roadmap}
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
                className="px-4 py-2 rounded-lg font-bold text-sm transition-all hover:scale-105"
                style={{ 
                  background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                  color: '#1e293b'
                }}>
                {lang === 'ar' ? 'English' : 'عربي'}
              </button>

              {wallet ? (
                <div className="flex items-center gap-2">
                  {/* GREEN CONNECTED INDICATOR */}
                  <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg"
                    style={{ background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.3)' }}>
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                    <span className="text-green-400 font-bold text-sm">
                      {lang === 'ar' ? 'متصل' : 'Connected'}
                    </span>
                  </div>
                  
                  <div className="hidden sm:block px-4 py-2 rounded-lg text-sm font-medium"
                    style={{ background: 'rgba(251, 191, 36, 0.1)', border: '1px solid rgba(251, 191, 36, 0.3)' }}>
                    <div className="text-yellow-400 font-bold">{shortenAddress(wallet)}</div>
                    <div className="text-xs text-gray-400">{balance.toFixed(2)} LLTY</div>
                  </div>
                  
                  <button
                    onClick={disconnectWallet}
                    className="p-2 rounded-lg hover:bg-red-500/20 transition-colors"
                    title={lang === 'ar' ? 'قطع الاتصال' : 'Disconnect'}>
                    <X size={20} className="text-red-400" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={connectWallet}
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all hover:scale-105 disabled:opacity-50"
                  style={{ 
                    background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                    color: '#1e293b'
                  }}>
                  <Wallet size={20} />
                  <span>{loading ? t.connecting : t.connectWallet}</span>
                </button>
              )}

              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="lg:hidden p-2 text-gray-200">
                {menuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="lg:hidden border-t border-yellow-500/20 py-4"
            style={{ background: 'rgba(15, 23, 42, 0.98)' }}>
            <div className="container mx-auto px-4 flex flex-col gap-3">
              <button onClick={() => scrollToSection('vip')} className="text-left py-2 text-gray-200 hover:text-yellow-400">
                {t.navigation.vipAccess}
              </button>
              <button onClick={() => scrollToSection('bonuses')} className="text-left py-2 text-gray-200 hover:text-yellow-400">
                {t.navigation.bonuses}
              </button>
              <button onClick={() => scrollToSection('referrals')} className="text-left py-2 text-gray-200 hover:text-yellow-400">
                {t.navigation.referrals}
              </button>
              <button onClick={() => scrollToSection('about')} className="text-left py-2 text-gray-200 hover:text-yellow-400">
                {t.navigation.about}
              </button>
              <button onClick={() => scrollToSection('tokenomics')} className="text-left py-2 text-gray-200 hover:text-yellow-400">
                {t.navigation.tokenomics}
              </button>
              <button onClick={() => scrollToSection('roadmap')} className="text-left py-2 text-gray-200 hover:text-yellow-400">
                {t.navigation.roadmap}
              </button>
            </div>
          </div>
        )}
      </header>

      {/* NOTIFICATION */}
      {notification.show && (
        <div className="fixed top-24 right-4 z-50 animate-slide-in-right">
          <div className={`flex items-center gap-3 px-6 py-4 rounded-lg shadow-2xl border ${
            notification.type === 'success' ? 'bg-green-900/90 border-green-500' :
            notification.type === 'error' ? 'bg-red-900/90 border-red-500' :
            'bg-blue-900/90 border-blue-500'
          }`}>
            {notification.type === 'success' ? <CheckCircle className="text-green-400" size={24} /> :
             notification.type === 'error' ? <AlertCircle className="text-red-400" size={24} /> :
             <Clock className="text-blue-400" size={24} />}
            <span className="font-medium text-white">{notification.message}</span>
          </div>
        </div>
      )}

      <main className="container mx-auto px-4 py-8">
        
        {/* HERO SECTION */}
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
              
              <div className="flex items-center justify-center gap-3 mb-6">
                <Clock className="text-yellow-400" size={32} />
                <h2 className="text-3xl md:text-4xl font-bold text-yellow-400">
                  {isVipPeriod ? t.vipActive : `${t.phase} ${currentPhase}/3`}
                </h2>
              </div>

              <div className="mb-6 px-6 py-3 rounded-lg text-center"
                style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                <p className="text-lg font-bold text-red-400">{getUrgencyMessage()}</p>
              </div>

              <p className="text-yellow-400 text-lg mb-4 font-semibold">
                {presaleEnded ? t.presaleEnded : t.nextPriceIn}
              </p>

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

        {/* VIP SECTION */}
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

        {/* BONUSES */}
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
                <h3 className="text-2xl font-bold text-green-400 mb-2">4% Bonus</h3>
                <p className="text-gray-300 mb-4">{t.bonusTier1}</p>
              </div>

              <div className="rounded-2xl p-6 shadow-xl border-2 text-center"
                style={{ 
                  background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                  borderColor: '#3b82f6'
                }}>
                <div className="text-5xl mb-4">💎</div>
                <h3 className="text-2xl font-bold text-blue-400 mb-2">10% Bonus</h3>
                <p className="text-gray-300 mb-4">{t.bonusTier2}</p>
              </div>

              <div className="rounded-2xl p-6 shadow-xl border-2 text-center"
                style={{ 
                  background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                  borderColor: '#fbbf24'
                }}>
                <div className="text-5xl mb-4">👑</div>
                <h3 className="text-2xl font-bold text-yellow-400 mb-2">15% Bonus</h3>
                <p className="text-gray-300 mb-4">{t.bonusTier3}</p>
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

        {/* REFERRALS */}
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

            {wallet && (
              <div className="mt-8">
                <p className="text-sm text-gray-400 mb-2">{t.yourReferralLink}</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={`https://landloyalty.com/?ref=${wallet}`}
                    readOnly
                    className="flex-1 px-4 py-3 rounded-lg font-mono text-sm"
                    style={{ background: 'rgba(51, 65, 85, 0.5)', color: '#f1f5f9', border: '1px solid rgba(251, 191, 36, 0.3)' }}
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`https://landloyalty.com/?ref=${wallet}`);
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

        {/* BUY SECTION */}
        <section id="buy" className="mb-16">
          <div className="max-w-2xl mx-auto rounded-2xl p-8 shadow-2xl border-2"
            style={{ 
              background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
              borderColor: '#fbbf24'
            }}>
            <h2 className="text-3xl font-bold text-center mb-6 text-yellow-400">
              {isVipPeriod ? '👑 VIP Purchase' : t.investNow}
            </h2>

            {wallet ? (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-300">{t.selectCurrency}</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['SOL', 'USDC', 'USDT'].map((curr) => (
                      <button
                        key={curr}
                        onClick={() => setCurrency(curr)}
                        className={`py-3 px-4 rounded-lg font-bold transition-all ${
                          currency === curr
                            ? 'scale-105 shadow-lg'
                            : 'opacity-60 hover:opacity-100'
                        }`}
                        style={{
                          background: currency === curr 
                            ? 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)'
                            : 'rgba(51, 65, 85, 0.5)',
                          color: currency === curr ? '#1e293b' : '#f1f5f9',
                          border: `2px solid ${currency === curr ? '#fbbf24' : 'rgba(251, 191, 36, 0.3)'}`
                        }}>
                        {curr}
                      </button>
                    ))}
                  </div>
                  {currency && walletBalances[currency] !== undefined && (
                    <p className="text-sm text-gray-400 mt-2">
                      Balance: {walletBalances[currency].toFixed(4)} {currency}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-300">{t.enterAmount}</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder={isVipPeriod ? "Min: $1,000" : "0.00"}
                    className="w-full px-4 py-4 rounded-lg text-xl font-bold text-white"
                    style={{ 
                      background: 'rgba(51, 65, 85, 0.5)',
                      border: '2px solid rgba(251, 191, 36, 0.3)'
                    }}
                  />
                </div>

                {getBonusPercentage() > 0 && (
                  <div className="rounded-lg p-4 text-center"
                    style={{ background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.3)' }}>
                    <Gift className="text-green-400 mx-auto mb-2" size={32} />
                    <p className="text-green-400 font-bold text-lg">
                      🎁 {getBonusPercentage()}% Bonus Applied!
                    </p>
                  </div>
                )}

                <div className="rounded-xl p-6 border-2"
                  style={{ background: 'rgba(251, 191, 36, 0.1)', borderColor: 'rgba(251, 191, 36, 0.3)' }}>
                  <p className="text-sm text-gray-400 mb-2">{t.youWillReceive}</p>
                  <p className="text-4xl font-bold text-yellow-400">
                    {calculateTokenAmount()} LLTY
                  </p>
                  {getBonusPercentage() > 0 && (
                    <p className="text-sm text-green-400 mt-2">
                      + {(parseFloat(calculateTokenAmount()) * getBonusPercentage() / (100 + getBonusPercentage())).toFixed(2)} bonus
                    </p>
                  )}
                </div>

                <button
                  onClick={buyTokens}
                  disabled={loading || !amount || parseFloat(amount) <= 0}
                  className="w-full py-4 rounded-xl font-bold text-xl transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ 
                    background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                    color: '#1e293b'
                  }}>
                  {loading ? t.processing : t.buy}
                </button>

                {purchased > 0 && (
                  <div className="rounded-xl p-4 border"
                    style={{ background: 'rgba(251, 191, 36, 0.05)', borderColor: 'rgba(251, 191, 36, 0.2)' }}>
                    <p className="text-sm text-gray-400 mb-1">{t.yourBalance}</p>
                    <p className="text-2xl font-bold text-yellow-400">{purchased.toLocaleString()} LLTY</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <Wallet className="mx-auto mb-4 text-gray-500" size={64} />
                <p className="text-xl text-gray-400 mb-6">{t.walletNotConnected}</p>
                <button
                  onClick={connectWallet}
                  className="px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105"
                  style={{ 
                    background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                    color: '#1e293b'
                  }}>
                  {t.connectWallet}
                </button>
              </div>
            )}
          </div>

          <div className="max-w-2xl mx-auto mt-6 rounded-xl p-6 border"
            style={{ background: 'rgba(59, 130, 246, 0.1)', borderColor: 'rgba(59, 130, 246, 0.3)' }}>
            <div className="flex items-start gap-3">
              <Shield className="text-blue-400 flex-shrink-0 mt-1" size={24} />
              <div>
                <h3 className="font-bold text-blue-400 mb-2">{t.withdrawalTitle}</h3>
                <p className="text-sm text-gray-300 mb-1">✓ {t.withdrawalDuring}</p>
                <p className="text-sm text-gray-300 mb-1">✓ {t.withdrawalAfter}</p>
                <p className="text-xs text-gray-400 mt-2">💡 {t.withdrawalReason}</p>
              </div>
            </div>
          </div>
        </section>

        {/* ABOUT */}
        <section id="about" className="mb-16">
          <div className="max-w-4xl mx-auto rounded-2xl p-8 shadow-xl"
            style={{ 
              background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
              border: '1px solid rgba(251, 191, 36, 0.2)'
            }}>
            <h2 className="text-4xl font-bold text-center mb-6 text-yellow-400">{t.aboutTitle}</h2>
            <p className="text-xl text-gray-300 leading-relaxed text-center whitespace-pre-line">{t.aboutText}</p>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold text-center mb-12 text-yellow-400">{t.howItWorks}</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              { icon: Coins, title: t.mechanicsTitle1, desc: t.mechanicsDesc1 },
              { icon: Building, title: t.mechanicsTitle2, desc: t.mechanicsDesc2 },
              { icon: TrendingUp, title: t.mechanicsTitle3, desc: t.mechanicsDesc3 }
            ].map((item, i) => (
              <div key={i} className="text-center rounded-2xl p-8 shadow-xl"
                style={{ 
                  background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                  border: '1px solid rgba(251, 191, 36, 0.2)'
                }}>
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6"
                  style={{ background: 'rgba(251, 191, 36, 0.1)' }}>
                  <item.icon className="text-yellow-400" size={40} />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-yellow-400">{item.title}</h3>
                <p className="text-gray-300 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CITIES */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold text-center mb-8 text-yellow-400">{t.cities}</h2>
          <p className="text-xl text-center mb-8 text-gray-300">{t.cityList}</p>
          <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
            <img
              src={citiesData[currentCityIndex].image}
              alt={citiesData[currentCityIndex].name}
              className="w-full h-full object-cover transition-opacity duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <h3 className="text-3xl font-bold text-white mb-2">{citiesData[currentCityIndex].name}</h3>
              <div className="flex gap-2">
                {citiesData.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentCityIndex(i)}
                    className={`h-2 rounded-full transition-all ${
                      i === currentCityIndex ? 'w-8 bg-yellow-400' : 'w-2 bg-gray-500'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* TOKENOMICS - FIXED: 4% Reserve + 1% Crisis Areas */}
        <section id="tokenomics" className="mb-16">
          <h2 className="text-4xl font-bold text-center mb-12 text-yellow-400">{t.tokenomicsTitle}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              { label: t.presaleAllocation, value: '40%', desc: '4B LLTY' },
              { label: t.liquidityPool, value: '20%', desc: '2B LLTY' },
              { label: t.team, value: '20%', desc: '2B LLTY (Vested)' },
              { label: t.marketing, value: '10%', desc: '1B LLTY' },
              { label: t.reserve, value: '4%', desc: '400M LLTY' },
              { label: t.socialImpact, value: '5%', desc: '500M LLTY' },
              { label: t.crisisAreas, value: '1%', desc: '100M LLTY' }
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

        {/* ROADMAP - FULLY TRANSLATED TO ARABIC */}
        <section id="roadmap" className="mb-16">
          <h2 className="text-4xl font-bold text-center mb-12 text-yellow-400">{t.roadmapTitle}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {roadmapData.map((item, i) => (
              <div key={i} className="rounded-2xl p-6 shadow-xl border-l-4"
                style={{ 
                  background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                  borderColor: '#fbbf24'
                }}>
                <p className="text-yellow-400 font-bold text-lg mb-2">{item.quarter}</p>
                <h3 className="text-xl font-bold text-white mb-3">{lang === 'ar' ? item.titleAr : item.title}</h3>
                <p className="text-gray-400 text-sm">{lang === 'ar' ? item.descAr : item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* SECURITY */}
        <section className="mb-16">
          <div className="max-w-4xl mx-auto rounded-2xl p-8 text-center shadow-xl"
            style={{ 
              background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
              border: '2px solid rgba(34, 197, 94, 0.3)'
            }}>
            <Shield className="mx-auto mb-6 text-green-400" size={64} />
            <h2 className="text-4xl font-bold mb-4 text-green-400">{t.security}</h2>
            <p className="text-xl text-gray-300 leading-relaxed mb-8">{t.securityText}</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a
                href="/whitepaper-ar.pdf"
                target="_blank"
                className="flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all hover:scale-105"
                style={{ 
                  background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                  color: '#1e293b'
                }}>
                <Download size={20} />
                {t.whitepaperAr}
              </a>
              <a
                href="/whitepaper-en.pdf"
                target="_blank"
                className="flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all hover:scale-105"
                style={{ 
                  background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                  color: '#1e293b'
                }}>
                <Download size={20} />
                {t.whitepaperEn}
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t py-12"
        style={{ borderColor: 'rgba(251, 191, 36, 0.2)', background: 'rgba(15, 23, 42, 0.95)' }}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <LLTYLogo size={40} />
              <div>
                <p className="font-bold text-yellow-400">Loyalty</p>
                <p className="text-xs text-gray-400">Real Estate Investment Token</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <a href="https://twitter.com/landloyalty" target="_blank" rel="noopener noreferrer"
                className="p-3 rounded-lg transition-all hover:scale-110"
                style={{ background: 'rgba(251, 191, 36, 0.1)' }}>
                <Twitter className="text-yellow-400" size={20} />
              </a>
              <a href="https://instagram.com/landloyalty" target="_blank" rel="noopener noreferrer"
                className="p-3 rounded-lg transition-all hover:scale-110"
                style={{ background: 'rgba(251, 191, 36, 0.1)' }}>
                <Instagram className="text-yellow-400" size={20} />
              </a>
              <a href="https://t.me/landloyalty" target="_blank" rel="noopener noreferrer"
                className="p-3 rounded-lg transition-all hover:scale-110"
                style={{ background: 'rgba(251, 191, 36, 0.1)' }}>
                <Send className="text-yellow-400" size={20} />
              </a>
            </div>
            
            <p className="text-sm text-gray-400">© 2026 Loyalty. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LLTYPresale;

// END OF FILE - ALL 5 PARTS COMPLETE
