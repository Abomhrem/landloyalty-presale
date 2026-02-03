// ============================================================================
// PART 1 OF 3 - UPDATED FOR V2 CONTRACT + REOWN APPKIT INTEGRATION
// ============================================================================
// Copy this ENTIRE section first, then Part 2, then Part 3
// ============================================================================
const NETWORK = 'devnet';
import blockchainService from './services/blockchainService';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Wallet, Menu, X, CheckCircle, AlertCircle, Clock, Target,
  Shield, TrendingUp, Users, Coins, Building, Download,
  FileText, Zap, Globe, Send, Twitter, Instagram, Gift, Star, Award
} from 'lucide-react';
// Solana Core
import { createJupiterApiClient } from '@jup-ag/api';
//import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import {
  Connection,
  PublicKey,
  Transaction,
  VersionedTransaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
  TransactionInstruction
} from '@solana/web3.js';
// SPL Token
import {
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction
} from '@solana/spl-token';
// Anchor
import * as anchor from '@coral-xyz/anchor';
import { BN } from '@coral-xyz/anchor';
// lodash
import { debounce } from 'lodash';
import { supabase, dbHelpers } from './lib/supabase';
import { captureError, captureMessage } from './lib/sentry';

// ────────────────────────────────────────────────
// REOWN APPKIT IMPORTS
// ────────────────────────────────────────────────
import { useAppKit, useAppKitAccount } from '@reown/appkit/react'
// import { useAppKitConnection, useAppKitProvider } from '@reown/appkit-adapter-solana'  // ← FIXED: no /react
// import type { Provider } from '@reown/appkit-adapter-solana'  // ← FIXED: correct path + type import
import LLTYLogo from './components/LLTYLogo.jsx';

// ============================================================================
// TRANSLATIONS (ARABIC & ENGLISH) - UPDATED FOR V2
// ============================================================================
const translations = {
  ar: {
    title: 'Loyalty',
    subtitle: 'أول عملة استثمار عقاري عربي',
    connectWallet: 'ربط المحفظة',
    disconnect: 'قطع الاتصال',
    connecting: 'جاري الاتصال...',
    walletNotConnected: 'المحفظة غير متصلة',
    changeWallet: 'تغيير المحفظة',
    changeWalletConfirm: 'هل تريد تغيير المحفظة؟ سيتم قطع الاتصال بالمحفظة الحالية.',
    // VIP Early Access
    vipAccess: 'وصول VIP المبكر',
    vipTitle: '🌟 فترة VIP الحصرية - أول 50 مشتري',
    vipDescription: 'كن من أوائل المستثمرين واحصل على سعر حصري!',
    vipPrice: 'سعر VIP: $0.001 لكل LLTY',
    vipMinPurchase: 'الحد الأدنى: $1,000',
    vipDuration: 'مدة VIP: يومان قبل البيع العام',
    vipSlots: 'المقاعد المتبقية',
    vipBenefits: 'مزايا VIP',
    vipBenefit1: '✨ سعر حصري $0.001 (أقل من المرحلة 1 بـ 75%)',
    vipBenefit2: '🎯 ضمان الشراء قبل الآخرين',
    vipBenefit3: '🎁 مكافأة ولاء إضافية 10%',
    vipBenefit4: '👑 شارة VIP حصرية',
    vipEnded: 'انتهت فترة VIP',
    vipActive: 'فترة VIP نشطة الآن!',
    // Referral System
    referralTitle: 'نظام الإحالة',
    referralDescription: 'ادعُ أصدقاءك واحصل على مكافآت!',
    referralBonus: 'مكافأة الإحالة: 5% من مشترياتهم',
    referralHow: 'كيف يعمل؟',
    referralStep1: '1. شارك رابط الإحالة الخاص بك',
    referralStep2: '2. يشتري صديقك رموز LLTY',
    referralStep3: '3. تحصل على 5% إضافية من مشترياته',
    referralExample: 'مثال: إذا اشترى صديقك $1,000، تحصل على $50 رموز LLTY مجاناً!',
    yourReferralLink: 'رابط الإحالة الخاص بك',
    // Bonus Tiers
    bonusTitle: 'مستويات المكافآت',
    bonusDescription: 'اشترِ أكثر، احصل على أكثر!',
    bonusTier1: '💰 اشترِ $1,000+: احصل على 5% مكافأة',
    bonusTier2: '💎 اشترِ $5,000+: احصل على 10% مكافأة',
    bonusTier3: '👑 اشترِ $10,000+: احصل على 15% مكافأة',
    bonusExample: 'مثال: شراء $10,000 = 2,500,000 LLTY + 375,000 مكافأة = 2,875,000 LLTY إجمالي!',
    // Claim System
    claimTitle: 'نظام المطالبة',
    claimDescription: 'الرموز متاحة للمطالبة بعد انتهاء البيع المسبق',
    claimWhen: 'متى يمكنني المطالبة؟',
    claimAnswer: 'بعد انتهاء المرحلة 3، يمكنك المطالبة برموزك في أي وقت',
    claimButton: 'طالب برموز LLTY',
    claimAvailable: 'متاح للمطالبة',
    claimSuccess: 'تمت المطالبة بنجاح!',
    // Phases
    phase: 'المرحلة',
    nextPriceIn: 'السعر القادم خلال',
    presaleEnded: 'انتهى البيع المسبق',
    days: 'أيام',
    hours: 'ساعات',
    minutes: 'دقائق',
    seconds: 'ثواني',
    // Purchase
    selectCurrency: 'اختر العملة',
    enterAmount: 'أدخل المبلغ',
    youWillReceive: 'ستحصل على',
    buy: 'شراء رموز LLTY',
    processing: 'جاري المعالجة...',
    success: 'نجح الشراء!',
    error: 'خطأ',
    // Stats
    totalRaised: 'المبلغ المجموع',
    of: 'من',
    totalSupply: 'الإجمالي الكلي',
    tokenPrice: 'سعر العملة',
    cities: 'المدن',
    yourBalance: 'رصيدك',
    purchased: 'تم الشراء',
    investNow: 'استثمر الآن',
    // Withdrawal Info
    withdrawalTitle: 'معلومات السحب',
    withdrawalDuring: 'خلال البيع المسبق: يمكن سحب 60% فقط',
    withdrawalAfter: 'بعد البيع المسبق: يمكن سحب 100%',
    withdrawalReason: 'حماية ضد الاحتيال',
    // Navigation
navigation: {
  home: 'الرئيسية',
  about: 'من نحن',
  howItWorks: 'كيف يعمل',
  vipAccess: 'وصول VIP',
  bonuses: 'المكافآت',
  referrals: 'الإحالات',
  cities: 'المدن',
  tokenomics: 'اقتصاديات العملة',
  roadmapTitle: 'خارطة الطريق',
  // Q1 2026
  q1_2026: 'الربع الأول 2026',
  presale_launch: 'إطلاق البيع المسبق 🚀',
  presale_launch_desc: 'وصول VIP المبكر وإطلاق البيع العام',
  // Q2 2026
  q2_2026: 'الربع الثاني 2026',
  smart_contract_audit: 'تدقيق العقود الذكية 🔒',
  smart_contract_audit_desc: 'تدقيق أمني مع Certik وبناء المجتمع',
  // Q3 2026
  q3_2026: 'الربع الثالث 2026',
  mainnet_launch: 'الإطلاق على Mainnet 🌐',
  mainnet_launch_desc: 'الانتقال إلى الشبكة الرئيسية وتفعيل DAO',
  // Q4 2026
  q4_2026: 'الربع الرابع 2026',
  first_property: 'أول عقار في دبي 🏢',
  first_property_desc: 'الاستحواذ على أول عقار وتوزيع الأرباح',
  // Q1 2027
  q1_2027: 'الربع الأول 2027',
  dex_listing: 'إدراج DEX 💎',
  dex_listing_desc: 'الإدراج في Raydium وتفعيل الستيكينغ',
  // Q2 2027
  q2_2027: 'الربع الثاني 2027',
  expansion_5_cities: 'التوسع إلى 5+ مدن 🌍',
  expansion_5_cities_desc: 'عقارات في الرياض، القاهرة، عمّان والمزيد',
  // Q3 2027
  q3_2027: 'الربع الثالث 2027',
  mobile_app: 'إطلاق التطبيق 📱',
  mobile_app_desc: 'تطبيق iOS و Android مع شراكات دولية',
  // Q4 2027
  q4_2027: 'الربع الرابع 2027',
  portfolio_20_properties: 'محفظة 20+ عقار 👑',
  portfolio_20_properties_desc: 'محفظة تتجاوز 500 مليون دولار',
},

    // Other sections
    cityList: 'عَمّان، دبي، أبوظبي، الرياض، جدة، القاهرة، بيروت، الدوحة، الكويت',
    aboutTitle: 'عن Loyalty',
    aboutText: 'Loyalty (LLTY) هو أول عملة استثمار عقاري عربي يربط المستثمرين بفرص عقارية عالية الجودة في 9 مدن عربية كبرى. كل عملة LLTY يمثل حصة في محفظة عقارية متنوعة، مما يوفر عوائد مستقرة وإمكانات نمو طويلة الأجل.',
    howItWorks: 'كيف يعمل',
    mechanicsTitle1: 'شراء رموز LLTY',
    mechanicsDesc1: 'قم بشراء رموز LLTY خلال البيع المسبق بأسعار خاصة. السعر يزداد كل مرحلة.',
    mechanicsTitle2: 'استثمار عقاري',
    mechanicsDesc2: 'الأموال المجمعة تُستثمر في عقارات مختارة في 9 مدن عربية.',
    mechanicsTitle3: 'احصل على عوائد',
    mechanicsDesc3: 'اربح من إيجارات العقارات وارتفاع قيمتها.',
    tokenomicsTitle: 'اقتصاديات LLTY',
    presaleAllocation: 'البيع المسبق',
    liquidityPool: 'مجمع السيولة',
    team: 'الفريق',
    marketing: 'التسويق',
    reserve: 'الاحتياطي',
    socialImpact: 'الأثر الاجتماعي',
    roadmapTitle: 'خارطة الطريق',
    security: 'الأمان والشفافية',
    securityText: 'عقد ذكي محقق ومدقق بالكامل على Solana blockchain. جميع المعاملات شفافة ومحمية.',
    whitepaperAr: 'الورقة البيضاء (عربي)',
    whitepaperEn: 'الورقة البيضاء (English)',
    swapping: 'جاري التبديل إلى USDC...',
    swapSuccess: 'تم التبديل بنجاح',
    swapFailed: 'فشل التبديل',
  },
  en: {
    title: 'Loyalty',
    subtitle: 'The First Arab Real Estate Investment Token',
    connectWallet: 'Connect Wallet',
    disconnect: 'Disconnect',
    connecting: 'Connecting...',
    walletNotConnected: 'Wallet not connected',
    changeWallet: 'Change Wallet',
    changeWalletConfirm: 'Change wallet? This will disconnect your current wallet.',
    // VIP Early Access
    vipAccess: 'VIP Early Access',
    vipTitle: '🌟 Exclusive VIP Period - First 50 Buyers',
    vipDescription: 'Be among the first investors and get an exclusive price!',
    vipPrice: 'VIP Price: $0.001 per LLTY',
    vipMinPurchase: 'Minimum: $1,000',
    vipDuration: 'VIP Duration: 2 Days Before Public Sale',
    vipSlots: 'Slots Remaining',
    vipBenefits: 'VIP Benefits',
    vipBenefit1: '✨ Exclusive $0.001 price (75% cheaper than Phase 1)',
    vipBenefit2: '🎯 Guaranteed purchase before everyone else',
    vipBenefit3: '🎁 Extra 10% loyalty bonus',
    vipBenefit4: '👑 Exclusive VIP badge',
    vipEnded: 'VIP Period Ended',
    vipActive: 'VIP Period Active Now!',
    // Referral System
    referralTitle: 'Referral System',
    referralDescription: 'Invite your friends and earn rewards!',
    referralBonus: 'Referral Bonus: 5% of their purchases',
    referralHow: 'How it works?',
    referralStep1: '1. Share your unique referral link',
    referralStep2: '2. Your friend buys LLTY tokens',
    referralStep3: '3. You get 5% bonus from their purchase',
    referralExample: 'Example: Friend buys $1,000, you get $50 in LLTY tokens free!',
    yourReferralLink: 'Your Referral Link',
    // Bonus Tiers
    bonusTitle: 'Bonus Tiers',
    bonusDescription: 'Buy more, get more!',
    bonusTier1: '💰 Buy $1,000+: Get 5% Bonus',
    bonusTier2: '💎 Buy $5,000+: Get 10% Bonus',
    bonusTier3: '👑 Buy $10,000+: Get 15% Bonus',
    bonusExample: 'Example: Buy $10,000 = 2,500,000 LLTY + 375,000 bonus = 2,875,000 LLTY total!',
    // Claim System
    claimTitle: 'Claim System',
    claimDescription: 'Tokens available for claiming after presale ends',
    claimWhen: 'When can I claim?',
    claimAnswer: 'After Phase 3 ends, you can claim your tokens anytime',
    claimButton: 'Claim LLTY Tokens',
    claimAvailable: 'Available to Claim',
    claimSuccess: 'Successfully claimed!',
    // Phases
    phase: 'Phase',
    nextPriceIn: 'Next Price In',
    presaleEnded: 'Presale Ended',
    days: 'Days',
    hours: 'Hours',
    minutes: 'Minutes',
    seconds: 'Seconds',
    // Purchase
    selectCurrency: 'Select Currency',
    enterAmount: 'Enter Amount',
    youWillReceive: 'You Will Receive',
    buy: 'Buy LLTY Tokens',
    processing: 'Processing...',
    success: 'Purchase successful!',
    error: 'Error',
    // Stats
    totalRaised: 'Total Raised',
    of: 'of',
    totalSupply: 'Total Supply',
    tokenPrice: 'Token Price',
    cities: 'Cities',
    yourBalance: 'Your Balance',
    purchased: 'Purchased',
    investNow: 'Invest Now',
    // Withdrawal Info
    withdrawalTitle: 'Withdrawal Info',
    withdrawalDuring: 'During Presale: Only 60% can be withdrawn',
    withdrawalAfter: 'After Presale: 100% can be withdrawn',
    withdrawalReason: 'Protection against rug pulls',
    // Navigation
navigation: {
  home: 'Home',
  about: 'About',
  howItWorks: 'How It Works',
  vipAccess: 'VIP Access',
  bonuses: 'Bonuses',
  referrals: 'Referrals',
  cities: 'Cities',
  tokenomics: 'Tokenomics',
  roadmapTitle: 'Roadmap',
  // Q1 2026
  q1_2026: 'Q1 2026',
  presale_launch: 'Presale Launch 🚀',
  presale_launch_desc: 'VIP early access and public presale',
  // Q2 2026
  q2_2026: 'Q2 2026',
  smart_contract_audit: 'Smart Contract Audit 🔒',
  smart_contract_audit_desc: 'Security audit with Certik & community building',
  // Q3 2026
  q3_2026: 'Q3 2026',
  mainnet_launch: 'Mainnet Launch 🌐',
  mainnet_launch_desc: 'Migration to mainnet and DAO activation',
  // Q4 2026
  q4_2026: 'Q4 2026',
  first_property: 'First Dubai Property 🏢',
  first_property_desc: 'First property acquisition & profit distribution',
  // Q1 2027
  q1_2027: 'Q1 2027',
  dex_listing: 'DEX Listing 💎',
  dex_listing_desc: 'Raydium listing and staking activation',
  // Q2 2027
  q2_2027: 'Q2 2027',
  expansion_5_cities: 'Expand to 5+ Cities 🌍',
  expansion_5_cities_desc: 'Properties in Riyadh, Cairo, Amman & more',
  // Q3 2027
  q3_2027: 'Q3 2027',
  mobile_app: 'Mobile App Launch 📱',
  mobile_app_desc: 'iOS & Android app with international partnerships',
  // Q4 2027
  q4_2027: 'Q4 2027',
  portfolio_20_properties: '20+ Property Portfolio 👑',
  portfolio_20_properties_desc: 'Portfolio exceeding $500 million',
},


    // Other sections
    cityList: 'Amman, Dubai, Abu Dhabi, Riyadh, Jeddah, Cairo, Beirut, Doha, Kuwait City',
    aboutTitle: 'About Loyalty',
    aboutText: 'Loyalty (LLTY) is the first Arab real estate investment token connecting investors to high-quality real estate opportunities across 9 major Arab cities. Each LLTY token represents a share in a diversified real estate portfolio, providing stable returns and long-term growth potential.',
    howItWorks: 'How It Works',
    mechanicsTitle1: 'Buy LLTY Tokens',
    mechanicsDesc1: 'Purchase LLTY tokens during presale at special prices. Price increases each phase.',
    mechanicsTitle2: 'Real Estate Investment',
    mechanicsDesc2: 'Pooled funds are invested in selected properties across 9 Arab cities.',
    mechanicsTitle3: 'Earn Returns',
    mechanicsDesc3: 'Benefit from property rentals and appreciation.',
    tokenomicsTitle: 'LLTY Tokenomics',
    presaleAllocation: 'Presale',
    liquidityPool: 'Liquidity Pool',
    team: 'Team',
    marketing: 'Marketing',
    reserve: 'Reserve',
    socialImpact: 'Social Impact',
    roadmapTitle: 'Roadmap',
    security: 'Security & Transparency',
    securityText: 'Fully verified and audited smart contract on Solana blockchain. All transactions are transparent and secured.',
    whitepaperAr: 'Whitepaper (Arabic)',
    whitepaperEn: 'Whitepaper (English)',
    swapping: 'Swapping to USDC...',
    swapSuccess: 'Swap successful',
    swapFailed: 'Swap failed',
  }
};


// Cities carousel data
const citiesData = [
  { name: 'Amman, Jordan', image: 'https://images.unsplash.com/photo-1578894381163-e72c17f2d45f?w=800' },
  { name: 'Dubai, UAE', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800' },
  { name: 'Abu Dhabi, UAE', image: 'https://images.unsplash.com/photo-1512632578888-169bbbc64f33?w=800' },
  { name: 'Riyadh, Saudi Arabia', image: 'https://images.unsplash.com/photo-1591608971362-f08b2a75731a?w=800' },
  { name: 'Jeddah, Saudi Arabia', image: 'https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?w=800' },
  { name: 'Cairo, Egypt', image: 'https://images.unsplash.com/photo-1539768942893-daf53e448371?w=800' },
  { name: 'Beirut, Lebanon', image: 'https://images.unsplash.com/photo-1580922090158-85e89c1d9c9e?w=800' },
  { name: 'Doha, Qatar', image: 'https://images.unsplash.com/photo-1574164047321-cc3a85cc5e6d?w=800' },
  { name: 'Kuwait City, Kuwait', image: 'https://images.unsplash.com/photo-1577699113768-7a5e25863083?w=800' },
];

// Database Stats Component - FIXED VERSION (Prevents infinite loops)
const DatabaseStats = ({ wallet, lang }) => {
  const [stats, setStats] = React.useState(null);
  const [purchases, setPurchases] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [showWalletModal, setShowWalletModal] = useState(false);
  React.useEffect(() => {
    let isMounted = true; // Prevent state updates if unmounted
    const loadData = async () => {
      // Don't fetch if no wallet
      if (!wallet) {
        setLoading(false);
        return;
      }
      try {
        console.log('📊 Loading dashboard data for:', wallet.slice(0, 8) + '...');
        // Get user purchases
        const { data: userPurchases, error: purchasesError } = await dbHelpers.getUserPurchases(wallet);
        if (purchasesError) {
          console.warn('⚠️ Purchases error:', purchasesError);
          if (isMounted) setPurchases([]);
        } else {
          if (isMounted) setPurchases(userPurchases || []);
          console.log('✅ Loaded', userPurchases?.length || 0, 'purchases');
        }
        // Get overall stats
        const { data: presaleStats, error: statsError } = await dbHelpers.getPresaleStats();
        if (statsError) {
          console.warn('⚠️ Stats error:', statsError);
          if (isMounted) setStats(null);
        } else {
          if (isMounted) setStats(presaleStats);
          console.log('✅ Loaded presale stats');
        }
      } catch (err) {
        console.error('❌ Dashboard load error:', err);
        if (isMounted) {
          setError(err.message);
          setPurchases([]);
          setStats(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    loadData();
    return () => {
      isMounted = false;
    };
  }, [wallet]);
  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin inline-block w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full mb-4"></div>
        <p className="text-gray-400">{lang === 'ar' ? 'جاري التحميل...' : 'Loading...'}</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="mx-auto mb-4 text-red-400" size={48} />
        <p className="text-red-400 mb-2">{lang === 'ar' ? 'فشل تحميل البيانات' : 'Failed to load data'}</p>
        <p className="text-sm text-gray-500">{error}</p>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      {/* Overall Stats */}
      {stats && (
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg" style={{ background: 'rgba(251, 191, 36, 0.1)' }}>
            <p className="text-sm text-gray-400">{lang === 'ar' ? 'إجمالي المشتريات' : 'Total Purchases'}</p>
            <p className="text-2xl font-bold text-yellow-400">{stats.total_purchases || 0}</p>
          </div>
          <div className="p-4 rounded-lg" style={{ background: 'rgba(251, 191, 36, 0.1)' }}>
            <p className="text-sm text-gray-400">{lang === 'ar' ? 'المبلغ المجموع' : 'Total Raised'}</p>
            <p className="text-2xl font-bold text-yellow-400">${parseFloat(stats.total_raised || 0).toLocaleString()}</p>
          </div>
          <div className="p-4 rounded-lg" style={{ background: 'rgba(251, 191, 36, 0.1)' }}>
            <p className="text-sm text-gray-400">{lang === 'ar' ? 'مشترين فريدين' : 'Unique Buyers'}</p>
            <p className="text-2xl font-bold text-yellow-400">{stats.unique_buyers || 0}</p>
          </div>
        </div>
      )}
      {/* User Purchases */}
      <div>
        <h3 className="text-xl font-bold text-white mb-4">
          {lang === 'ar' ? 'مشترياتك' : 'Your Purchases'}
        </h3>
        {purchases.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400">{lang === 'ar' ? 'لا توجد مشتريات بعد' : 'No purchases yet'}</p>
            <p className="text-sm text-gray-500 mt-2">
              {lang === 'ar' ? 'قم بشراء رموز LLTY لرؤيتها هنا' : 'Buy LLTY tokens to see them here'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {purchases.map((purchase) => (
              <div key={purchase.id} className="p-4 rounded-lg border"
                style={{ background: 'rgba(51, 65, 85, 0.3)', borderColor: 'rgba(251, 191, 36, 0.2)' }}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-yellow-400">
                      {parseFloat(purchase.tokens_purchased).toLocaleString()} LLTY
                    </p>
                    <p className="text-sm text-gray-400">
                      ${parseFloat(purchase.usd_amount).toFixed(2)} • {purchase.currency}
                      {purchase.bonus_percentage > 0 && ` • +${purchase.bonus_percentage}% bonus`}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(purchase.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    {purchase.verified ? (
                      <span className="text-xs px-2 py-1 rounded bg-green-500/20 text-green-400">
                        ✓ {lang === 'ar' ? 'تم التحقق' : 'Verified'}
                      </span>
                    ) : (
                      <span className="text-xs px-2 py-1 rounded bg-yellow-500/20 text-yellow-400">
                        ⏳ {lang === 'ar' ? 'قيد المراجعة' : 'Pending'}
                      </span>
                    )}
                    <a href={`https://explorer.solana.com/tx/${purchase.transaction_signature}?cluster=${NETWORK}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-400 hover:underline block mt-1"
                    >
                      {lang === 'ar' ? 'عرض المعاملة' : 'View TX'}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const LLTYPresale = () => {
  // ────────────────────────────────────────────────
  // REOWN APPKIT HOOKS (replaces old wallet states)
  // ────────────────────────────────────────────────
  const RPC_ENDPOINT = 'https://api.devnet.solana.com';

  const fallbackConnection = new Connection(RPC_ENDPOINT, 'confirmed');
  const { open } = useAppKit()
  const { address, isConnected } = useAppKitAccount()
  const connection = useMemo(() => new Connection(RPC_ENDPOINT, 'confirmed'), [])
  //const { connection } = useAppKitConnection()  // CORRECT - from Solana adapter
  const { walletProvider } = useAppKit()
  const { disconnect } = useAppKit()
  
  // ============================================================
  // BALANCE STATES
  // ============================================================
  const [balance, setBalance] = useState(0); // LLTY balance
  const [walletBalances, setWalletBalances] = useState({
    SOL: 0,
    USDC: 0,
    USDT: 0
  });

  // ============================================================
  // TRANSACTION STATES
  // ============================================================
  const [loading, setLoading] = useState(false);
  const [txSignature, setTxSignature] = useState('');
  const [txStatus, setTxStatus] = useState(''); // 'pending', 'confirmed', 'failed'
  const [balancesLoading, setBalancesLoading] = useState(false);

  // ============================================================
  // PURCHASE STATES
  // ============================================================
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USDC');
  const [calculatedTokens, setCalculatedTokens] = useState(0);
  const [bonusPercentage, setBonusPercentage] = useState(0);
  const [purchased, setPurchased] = useState(0);

  // ============================================================
  // UI STATES
  // ============================================================
  const [lang, setLang] = useState('ar');
  const t = translations[lang];

// Roadmap data
// Roadmap data (now translated)
const roadmapData = [
  {
    quarter: translations[lang].navigation.q1_2026,
    title: translations[lang].navigation.presale_launch,
    desc: translations[lang].navigation.presale_launch_desc,
  },
  {
    quarter: translations[lang].navigation.q2_2026,
    title: translations[lang].navigation.global_marketing,
    desc: translations[lang].navigation.smart_contract_audit_desc,
  },
  {
    quarter: translations[lang].navigation.q3_2026,
    title: translations[lang].navigation.mainnet_launch,
    desc: translations[lang].navigation.mainnet_launch_desc,
  },
  {
    quarter: translations[lang].navigation.q4_2026,
    title: translations[lang].navigation.first_property,
    desc: translations[lang].navigation.first_property_desc,
  },
  {
    quarter: translations[lang].navigation.q1_2027,
    title: translations[lang].navigation.dex_listing,
    desc: translations[lang].navigation.dex_listing_desc,
  },
  {
    quarter: translations[lang].navigation.q2_2027,
    title: translations[lang].navigation.expansion_5_cities,
    desc: translations[lang].navigation.expansion_5_cities_desc,
  },
  {
    quarter: translations[lang].navigation.q3_2027,
    title: translations[lang].navigation.mobile_app,
    desc: translations[lang].navigation.mobile_app_desc,
  },
  {
    quarter: translations[lang].navigation.q4_2027,
    title: translations[lang].navigation.portfolio_20_properties,
    desc: translations[lang].navigation.portfolio_20_properties_desc,
  },
];

  const [menuOpen, setMenuOpen] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    type: '', // 'success', 'error', 'info', 'warning'
    message: ''
  });

  // ============================================================
  // PRESALE STATES
  // ============================================================
  const [currentPhase, setCurrentPhase] = useState(1);
  const [isVipPeriod, setIsVipPeriod] = useState(false);
  const [vipBuyersCount, setVipBuyersCount] = useState(0);
  const [presaleEnded, setPresaleEnded] = useState(false);
  const [phaseTimeRemaining, setPhaseTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [totalRaised, setTotalRaised] = useState(0);
  const [totalLLTYSold, setTotalLLTYSold] = useState(0);

  // ============================================================
  // CAROUSEL STATE
  // ============================================================
  const [currentCityIndex, setCurrentCityIndex] = useState(0);

  // ============================================================
  // PRICE DATA (from CoinGecko)
  // ============================================================
  const [solPrice, setSolPrice] = useState(0);

  // ✅ BLOCKCHAIN CONFIGURATION - V2
  const ADDRESSES = {
    PROGRAM_ID: new PublicKey('2oArywYY7xHyoV1xoF9g9QKkyKDHe3rA9kRyu1H8ZQxo'),
    LLTY_MINT: new PublicKey('6UYrC72Xseu8bSrjZz5VUZ3aGo68MEqpNNyMgqqcfajf'),
    USDC_MINT: new PublicKey('7e54j2gSb31gpeW3sLZktexZBqrA1tLzg14ncuiphrP4'),
    USDT_MINT: new PublicKey('Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuwSzGqKzNNc98FK'),
    PRESALE_PDA: new PublicKey('9b55xaKqELt1fYHn6MXA9vETy4ngTPxSZZ1SJmTQN1Kr'),
    LLTY_VAULT: new PublicKey('9UqwUfRpi41GBTVuHPiSjWXUoW4EoWah3aYdiUspfU7f'),
    USDC_VAULT: new PublicKey('Hzmv4eWhLFbfC7XpDmf3dpMCn6jHDXDSYWosv87Nmegh'),
    USDT_VAULT: new PublicKey('EfHXwphpyAkeGrogUEGPQVSiPwXQDvpaFZvwJBbkmB9k')
  };

  // ✅ PRESALE TIMING - V2
  const PRESALE_START = new Date('2026-01-01T00:00:00Z').getTime();
  const VIP_DURATION = 2 * 24 * 60 * 60 * 1000; // 2 days
  const PUBLIC_START = PRESALE_START + VIP_DURATION;
  const PRESALE_END = new Date('2026-02-11T23:59:59Z').getTime();
  const PHASE_DURATION = 14 * 24 * 60 * 60 * 1000; // 14 days

  // Phase prices and allocations
  const PHASE_PRICES_DISPLAY = {
    vip: 0.001, // VIP price
    1: 0.004, // Phase 1
    2: 0.005, // Phase 2
    3: 0.006 // Phase 3
  };
  const PHASE_ALLOCATIONS = {
    1: 1_000_000_000, // 1B tokens
    2: 1_500_000_000, // 1.5B tokens
    3: 1_500_000_000 // 1.5B tokens
  };

  // Calculate real presale target
  const PRESALE_TARGET = (
    (PHASE_ALLOCATIONS[1] * PHASE_PRICES_DISPLAY[1]) +
    (PHASE_ALLOCATIONS[2] * PHASE_PRICES_DISPLAY[2]) +
    (PHASE_ALLOCATIONS[3] * PHASE_PRICES_DISPLAY[3])
  ); // = $29,500,000


  // Shortened address display
  const shortenAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  // Scroll to section
  const scrollToSection = (id) => {
    setMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Show notification - ENHANCED
  const showNotification = useCallback((type, message, duration = 5000) => {
    setNotification({ show: true, type, message });
    if (duration > 0) {
      setTimeout(() => {
        setNotification(prev => ({ ...prev, show: false }));
      }, duration);
    }
  }, []);

  // Calculate bonus percentage based on USD amount
  const calculateBonus = (usdAmount) => {
    if (usdAmount >= 10000) return 15;
    if (usdAmount >= 5000) return 10;
    if (usdAmount >= 1000) return 5;
    return 0;
  };

  // Get urgency message based on phase
  const getUrgencyMessage = () => {
    if (isVipPeriod) {
      return lang === 'ar' ? '⚡ فترة VIP نشطة! فقط 50 مقعد متاح!' : '⚡ VIP Period Active! Only 50 Slots!';
    }
    const hoursLeft = Math.floor(phaseTimeRemaining.days * 24 + phaseTimeRemaining.hours);
    if (hoursLeft < 24) {
      return lang === 'ar' ? '⚡ أقل من 24 ساعة للسعر الحالي!' : '⚡ Less than 24 hours at this price!';
    }
    if (hoursLeft < 72) {
      return lang === 'ar' ? '🔥 السعر يرتفع قريباً!' : '🔥 Price increasing soon!';
    }
    return lang === 'ar' ? '⏰ وقت محدود بهذا السعر' : '⏰ Limited time at this price';
  };

  // ────────────────────────────────────────────────
  // AUTO-CONNECT & LOCALSTORAGE RESTORE (AppKit version)
  // ────────────────────────────────────────────────
  useEffect(() => {
    const stored = localStorage.getItem('llty_wallet');
    if (stored && isConnected && address) {
      try {
        const data = JSON.parse(stored);
        const timeSinceConnect = Date.now() - (data.lastConnected || 0);
        const oneDayInMs = 24 * 60 * 60 * 1000;
        if (timeSinceConnect < oneDayInMs && data.address === address) {
          // Already connected via AppKit → refresh balances
          fetchBalances();
        } else {
          localStorage.removeItem('llty_wallet');
        }
      } catch (err) {
        console.error('Failed to restore wallet data:', err);
        localStorage.removeItem('llty_wallet');
      }
    }
  }, [isConnected, address]);

  // Save to localStorage when connected
  useEffect(() => {
    if (isConnected && address) {
      const walletData = {
        address,
        walletType: 'Reown', // generic since AppKit handles multiple
        purchased: purchased,
        lastConnected: Date.now()
      };
      localStorage.setItem('llty_wallet', JSON.stringify(walletData));
    }
  }, [isConnected, address, purchased]);

  // ✅ ENTERPRISE-GRADE BALANCE FETCHING - AppKit version
  const fetchBalances = async (showLoadingIndicator = true) => {
    if (!isConnected || !address) {
      console.warn('Cannot fetch balances: not connected or no connection');
      return;
    }

    if (showLoadingIndicator) {
      setLoading(true);
      setBalancesLoading(true);
    }
    const effectiveConnection = connection || fallbackConnection;

    try {
      const pubKey = new PublicKey(address);
      console.log('🔍 Fetching balances from blockchain...', {
        wallet: pubKey.toString().slice(0, 8) + '...',
        timestamp: new Date().toLocaleTimeString()
      });

      const result = await blockchainService.fetchAllBalances(pubKey);
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch balances from blockchain');
      }

      setWalletBalances(result.balances);
      setBalance(result.balances.LLTY);

      console.log('✅ Balances fetched from blockchain:', {
        wallet: pubKey.toString().slice(0, 8) + '...',
        SOL: result.balances.SOL.toFixed(4),
        LLTY: result.balances.LLTY.toFixed(2),
        USDC: result.balances.USDC.toFixed(2),
        USDT: result.balances.USDT.toFixed(2),
        timestamp: new Date(result.timestamp).toLocaleTimeString(),
        source: 'BLOCKCHAIN',
        cached: result.cached || false
      });

      // Cache (non-critical)
      try {
        const cacheData = {
          wallet: pubKey.toString(),
          balances: result.balances,
          lastUpdate: result.timestamp,
          version: '2.0',
          _WARNING: 'This is cached data only. Blockchain is source of truth.'
        };
        localStorage.setItem('llty_balance_cache', JSON.stringify(cacheData));
      } catch (cacheErr) {
        console.warn('Cache save failed (non-critical):', cacheErr.message);
      }

      // Fetch purchased from DB
      try {
        const { data: userPurchases } = await dbHelpers.getUserPurchases(pubKey.toString());
        if (userPurchases && userPurchases.length > 0) {
          const totalPurchased = userPurchases.reduce((sum, p) => sum + parseFloat(p.tokens_purchased || 0), 0);
          setPurchased(totalPurchased);
        } else {
          setPurchased(result.balances.LLTY);
        }
      } catch (dbErr) {
        console.warn('Database fetch failed, using LLTY balance:', dbErr.message);
        setPurchased(result.balances.LLTY);
      }

    } catch (error) {
      console.error('❌ fetchBalances CRITICAL ERROR:', error);
      if (window.Sentry) {
        window.Sentry.captureException(error, {
          tags: { function: 'fetchBalances', wallet: address },
          extra: { network: NETWORK }
        });
      }
      showNotification(
        'error',
        lang === 'ar'
          ? 'فشل تحميل الأرصدة من البلوكشين. جاري المحاولة مرة أخرى...'
          : 'Failed to fetch balances from blockchain. Retrying...'
      );

      // Cache fallback
      try {
        const cached = localStorage.getItem('llty_balance_cache');
        if (cached) {
          const cacheData = JSON.parse(cached);
          const cacheAge = Date.now() - cacheData.lastUpdate;
          if (cacheAge < 2 * 60 * 1000 && cacheData.version === '2.0') {
            setWalletBalances(cacheData.balances);
            setBalance(cacheData.balances.LLTY);
            showNotification(
              'warning',
              lang === 'ar'
                ? `استخدام البيانات المخزنة (عمرها ${Math.floor(cacheAge / 1000)} ثانية)`
                : `Using cached data (${Math.floor(cacheAge / 1000)}s old - may not be current)`,
              8000
            );
          }
        }
      } catch (cacheError) {
        console.error('Cache fallback failed:', cacheError);
      }
    } finally {
      if (showLoadingIndicator) {
        setLoading(false);
        setBalancesLoading(false);
      }
    }
  };

  // Calculate token amount
  const calculateTokenAmount = () => {
    if (!amount || parseFloat(amount) <= 0) return 0;
    const price = isVipPeriod ? PHASE_PRICES_DISPLAY.vip : (PHASE_PRICES_DISPLAY[currentPhase] || PHASE_PRICES_DISPLAY[1]);
    let usdValue = parseFloat(amount);
    if (currency === 'SOL' && solPrice > 0) {
      usdValue = parseFloat(amount) * solPrice;
    }
    // Calculate base tokens
    const baseTokens = usdValue / price;
    // Calculate bonus
    let bonusPercentage = 0;
    if (usdValue >= 10000) bonusPercentage = 15;
    else if (usdValue >= 5000) bonusPercentage = 10;
    else if (usdValue >= 1000) bonusPercentage = 5;
    const bonusTokens = (baseTokens * bonusPercentage) / 100;
    const totalTokens = baseTokens + bonusTokens;
    return totalTokens.toFixed(2);
  };

  // Get bonus percentage
  const getBonusPercentage = () => {
    if (!amount || parseFloat(amount) <= 0) return 0;
    let usdValue = parseFloat(amount);
    if (currency === 'SOL' && solPrice > 0) {
      usdValue = parseFloat(amount) * solPrice;
    }
    if (usdValue >= 10000) return 15;
    if (usdValue >= 5000) return 10;
    if (usdValue >= 1000) return 5;
    return 0;
  };

// Swap to USDC via Jupiter API Client - CORRECTED
const swapToUSDC = async (inputMint, inputAmount) => {
  try {
    showNotification('info', t.swapping);
    
    console.log('🔄 Initializing Jupiter swap:', {
      inputMint: inputMint.toString(),
      outputMint: ADDRESSES.USDC_MINT.toString(),
      inputAmount,
      solPrice
    });

    // Calculate amount in smallest unit
    const amountInSmallestUnit = inputMint.equals(new PublicKey('So11111111111111111111111111111111111111112'))
      ? Math.floor(inputAmount * LAMPORTS_PER_SOL)
      : Math.floor(inputAmount * 1e6);

    console.log('💰 Amount to swap:', amountInSmallestUnit, 'smallest units');

    // Step 1: Create Jupiter API client
    //const jupiterQuoteApi = createJupiterApiClient();

// Use EXPLICIT devnet Jupiter API base
    const jupiterQuoteApi = createJupiterApiClient({
      basePath: 'https://quote-api.jup.ag/v4'  // ← v6 is stable for devnet
      // If still fails, try v4: 'https://quote-api.jup.ag/v4'
    });


    // Step 2: Get quote - FIXED PARAMETERS
    showNotification('info', lang === 'ar' ? 'جاري حساب أفضل سعر...' : 'Computing best price...');
    
    try {
      const quote = await jupiterQuoteApi.quoteGet({
        inputMint: inputMint.toString(),
        outputMint: ADDRESSES.USDC_MINT.toString(),
        amount: amountInSmallestUnit.toString(), // Convert to string
        slippageBps: 100, // 1% slippage
        onlyDirectRoutes: false,
        asLegacyTransaction: false,
      });

      if (!quote) {
        throw new Error(
          lang === 'ar'
            ? 'لم يتم العثور على سعر للتبديل'
            : 'No swap quote found'
        );
      }

      console.log('✅ Quote received:', {
        inputAmount: quote.inAmount,
        outputAmount: quote.outAmount,
        priceImpactPct: quote.priceImpactPct
      });

      // Show price impact warning if high
      if (quote.priceImpactPct && parseFloat(quote.priceImpactPct) > 2) {
        showNotification(
          'warning',
          lang === 'ar'
            ? `⚠️ تأثير السعر: ${parseFloat(quote.priceImpactPct).toFixed(2)}%`
            : `⚠️ Price impact: ${parseFloat(quote.priceImpactPct).toFixed(2)}%`,
          3000
        );
      }

      // Step 3: Get swap transaction
      showNotification('info', lang === 'ar' ? 'جاري إنشاء المعاملة...' : 'Creating transaction...');
      
      const swapResult = await jupiterQuoteApi.swapPost({
        swapRequest: {
          quoteResponse: quote,
          userPublicKey: address,
          wrapAndUnwrapSol: true,
          dynamicComputeUnitLimit: true,
          prioritizationFeeLamports: {
            autoMultiplier: 2
          },
        },
      });

      if (!swapResult || !swapResult.swapTransaction) {
        throw new Error(
          lang === 'ar'
            ? 'فشل إنشاء معاملة التبديل'
            : 'Failed to create swap transaction'
        );
      }

      console.log('✅ Swap transaction created');

      // Step 4: Deserialize and sign transaction
      showNotification('info', lang === 'ar' ? 'جاري التوقيع والإرسال...' : 'Signing and sending...');
      
      const swapTransactionBuf = Buffer.from(swapResult.swapTransaction, 'base64');
      const transaction = VersionedTransaction.deserialize(swapTransactionBuf);

      // Get wallet provider
      const provider = await walletProvider;
      if (!provider) {
        throw new Error('Wallet provider not available');
      }

      // Sign and send
      const { signature } = await provider.signAndSendTransaction(transaction);
      console.log('✅ Swap transaction sent:', signature);

      // Step 5: Confirm transaction
      showNotification('info', lang === 'ar' ? 'جاري تأكيد التبديل...' : 'Confirming swap...');
      
      const effectiveConnection = connection || fallbackConnection;
      await effectiveConnection.confirmTransaction(signature, 'confirmed');

      // Calculate USDC received
      const usdcReceived = parseFloat(quote.outAmount) / 1e6;
      
      console.log('✅ Swap completed successfully!', {
        signature,
        usdcReceived: usdcReceived
      });

      showNotification(
        'success',
        `${t.swapSuccess}: ${usdcReceived.toFixed(2)} USDC`,
        4000
      );

      // Wait for balance to update
      await new Promise(resolve => setTimeout(resolve, 2000));

      return usdcReceived;

    } catch (quoteError) {
      console.error('❌ Jupiter API Error Details:', quoteError);
      
      // Check if it's a specific API error
      if (quoteError.message && quoteError.message.includes('No routes found')) {
        throw new Error(
          lang === 'ar'
            ? 'لم يتم العثور على مسار للتبديل. قد يكون المبلغ صغير جداً أو كبير جداً.'
            : 'No swap route found. Amount might be too small or too large.'
        );
      }
      
      throw quoteError;
    }

  } catch (err) {
    console.error('❌ Jupiter swap error:', err);
    
    let errorMessage = err.message || 'Unknown error';
    
    if (errorMessage.includes('User rejected') || errorMessage.includes('User cancelled')) {
      errorMessage = lang === 'ar' ? 'تم إلغاء التبديل' : 'Swap cancelled';
    } else if (errorMessage.includes('No swap quote') || errorMessage.includes('No routes')) {
      errorMessage = lang === 'ar'
        ? 'لم يتم العثور على مسار للتبديل. حاول مبلغ مختلف.'
        : 'No swap route found. Try a different amount.';
    } else if (errorMessage.includes('Slippage')) {
      errorMessage = lang === 'ar'
        ? 'تجاوز حد الانزلاق. حاول مرة أخرى.'
        : 'Slippage tolerance exceeded. Please try again.';
    } else if (errorMessage.includes('Insufficient')) {
      errorMessage = lang === 'ar'
        ? 'رصيد SOL غير كافٍ'
        : 'Insufficient SOL balance';
    } else if (errorMessage.includes('Response returned an error code') || errorMessage.includes('400')) {
      errorMessage = lang === 'ar'
        ? 'فشل الحصول على سعر التبديل. حاول مبلغ أكبر (على الأقل 0.01 SOL)'
        : 'Failed to get swap quote. Try a larger amount (at least 0.01 SOL)';
    }
    
    throw new Error(errorMessage);
  }
};

// Disconnect Wallet
const handleDisconnect = async () => {
  try {
    await disconnect()
    showNotification('success', lang === 'ar' ? 'تم فصل المحفظة بنجاح' : 'Wallet disconnected successfully')
    // Optional: clear local state if needed
    // setAddress(null)
    // setIsConnected(false)
  } catch (error) {
    console.error('Disconnect failed:', error)
    showNotification('error', lang === 'ar' ? 'فشل فصل المحفظة' : 'Failed to disconnect wallet')
  }
}

  // Buy tokens - ENHANCED WITH DATABASE, MONITORING, RATE LIMITING, VALIDATION + REOWN SIGNING
  const buyTokens = async () => {
    if (!isConnected || !address) {
      showNotification('error', lang === 'ar' ? 'المحفظة غير متصلة' : 'Wallet not connected');
      return;
    }

    const amt = parseFloat(amount);
    if (!amt || amt <= 0 || isNaN(amt)) {
      showNotification('error', lang === 'ar' ? 'المبلغ غير صحيح' : 'Invalid amount');
      return;
    }

    if (isVipPeriod && amt < 1000) {
      showNotification('error', lang === 'ar' ? 'الحد الأدنى لـ VIP: $1,000' : 'VIP minimum: $1,000');
      return;
    }

    if (presaleEnded) {
      showNotification('error', lang === 'ar' ? 'انتهى البيع المسبق' : 'Presale has ended');
      return;
    }

    try {
      const rateLimitCheck = await dbHelpers.checkRateLimit(address);
      if (!rateLimitCheck.allowed) {
        showNotification(
          'error',
          lang === 'ar'
            ? `يرجى الانتظار ${rateLimitCheck.retryAfter} ثانية قبل المحاولة مرة أخرى`
            : `Please wait ${rateLimitCheck.retryAfter} seconds before trying again`
        );
        return;
      }
    } catch (err) {
      console.warn('Rate limit check failed:', err);
    }

    setLoading(true);
    setTxStatus('pending');

    let signature = '';
    let usdValue = amt;
    let tokensReceived = 0;
    let bonusPercentage = 0;

        //finalUsdcAmount = await swapToUSDC(inputMint, amt);
        //await new Promise(resolve => setTimeout(resolve, 2000));
      //}

try {
      // ═══════════════════════════════════════════════════════════
      // STEP 1: Handle SOL currency with proper validation
      // ═══════════════════════════════════════════════════════════
      if (currency === 'SOL') {
        // Check if SOL price is loaded
        if (solPrice === 0) {
          showNotification('error', lang === 'ar' ? 'جاري تحميل سعر SOL...' : 'Loading SOL price...');
          await fetchSolPrice();
          if (solPrice === 0) {
            throw new Error(lang === 'ar' ? 'فشل تحميل سعر SOL' : 'Failed to load SOL price');
          }
        }

        // Calculate USD value
        usdValue = amt * solPrice;

        // ═══════════════════════════════════════════════════════════
        // BALANCE VALIDATION - Check SOL balance BEFORE attempting swap
        // ═══════════════════════════════════════════════════════════
        const currentSOLBalance = walletBalances.SOL;
        const requiredSOL = amt + 0.01; // Add 0.01 SOL for transaction fees

        console.log('💰 SOL Balance Check:', {
          required: requiredSOL,
          available: currentSOLBalance,
          sufficient: currentSOLBalance >= requiredSOL
        });

        if (currentSOLBalance < requiredSOL) {
          showNotification(
            'error',
            lang === 'ar'
              ? `رصيد SOL غير كافٍ. تحتاج إلى ${requiredSOL.toFixed(4)} SOL (${amt} للشراء + 0.01 للرسوم). رصيدك الحالي: ${currentSOLBalance.toFixed(4)} SOL`
              : `Insufficient SOL balance. You need ${requiredSOL.toFixed(4)} SOL (${amt} for purchase + 0.01 for fees). Current balance: ${currentSOLBalance.toFixed(4)} SOL`,
            8000
          );
          return;
        }

        // Check minimum swap amount
        if (amt < 0.5) {
          showNotification(
            'error',
            lang === 'ar'
              ? 'الحد الأدنى للشراء بـ SOL هو 0.5 SOL'
              : 'Minimum purchase with SOL is 0.5 SOL',
            6000
          );
          return;
        }

        // All checks passed - proceed with swap
        try {
          showNotification(
            'info',
            lang === 'ar'
              ? `جاري تبديل ${amt} SOL إلى USDC...`
              : `Swapping ${amt} SOL to USDC...`,
            3000
          );

          const inputMint = new PublicKey('So11111111111111111111111111111111111111112');
          const usdcReceived = await swapToUSDC(inputMint, amt);
          
          await new Promise(resolve => setTimeout(resolve, 2000));
          await fetchBalances(false);

        } catch (swapError) {
          console.error('❌ Swap failed:', swapError);
          
          let swapErrorMessage = swapError.message || 'Swap failed';
          
          if (swapErrorMessage.includes('Insufficient')) {
            swapErrorMessage = lang === 'ar'
              ? 'رصيد SOL غير كافٍ لإتمام التبديل'
              : 'Insufficient SOL balance to complete swap';
          }
          
          showNotification('error', swapErrorMessage, 8000);
          throw swapError;
        }
      } else {
        usdValue = amt;
      }

      // ═══════════════════════════════════════════════════════════
      // STEP 2: Calculate tokens and bonus
      // ═══════════════════════════════════════════════════════════
      const price = isVipPeriod ? PHASE_PRICES_DISPLAY.vip : PHASE_PRICES_DISPLAY[currentPhase];
      const baseTokens = usdValue / price;
      bonusPercentage = calculateBonus(usdValue);
      const bonusTokens = (baseTokens * bonusPercentage) / 100;
      const totalTokens = baseTokens + bonusTokens;
      const tokenAmountInSmallestUnit = Math.floor(totalTokens * 1e9);

      let finalUsdcAmount = amt;

      if (currency === 'SOL') {
        const solAta = await getAssociatedTokenAddress(new PublicKey('So11111111111111111111111111111111111111112'), new PublicKey(address));
        const solAccountInfo = await connection.getAccountInfo(solAta);
        if (solAccountInfo) {
          const solTokenBalance = await connection.getTokenAccountBalance(solAta);
          finalUsdcAmount = parseFloat(solTokenBalance.value.uiAmount);
        }
      }

      // ═══════════════════════════════════════════════════════════
      // STEP 3: Check payment currency balance
      // ═══════════════════════════════════════════════════════════
      const paymentCurrency = currency === 'SOL' ? 'USDC' : currency;
      const requiredBalance = finalUsdcAmount;
      const currentBalance = walletBalances[paymentCurrency];

      console.log('💰 Payment Balance Check:', {
        currency: paymentCurrency,
        required: requiredBalance,
        available: currentBalance,
        sufficient: currentBalance >= requiredBalance
      });

      if (currentBalance < requiredBalance) {
        showNotification(
          'error',
          lang === 'ar'
            ? `رصيد ${paymentCurrency} غير كافٍ. تحتاج إلى ${requiredBalance.toFixed(2)} ${paymentCurrency}. رصيدك الحالي: ${currentBalance.toFixed(2)} ${paymentCurrency}`
            : `Insufficient ${paymentCurrency} balance. You need ${requiredBalance.toFixed(2)} ${paymentCurrency}. Current balance: ${currentBalance.toFixed(2)} ${paymentCurrency}`,
          8000
        );
        return;
      }

      const buyer = new PublicKey(address);

      const paymentMint = currency === 'USDT' ? ADDRESSES.USDT_MINT : ADDRESSES.USDC_MINT;
      const paymentVault = currency === 'USDT' ? ADDRESSES.USDT_VAULT : ADDRESSES.USDC_VAULT;
      const paymentAta = await getAssociatedTokenAddress(paymentMint, buyer);
      const lltyAta = await getAssociatedTokenAddress(ADDRESSES.LLTY_MINT, buyer);

      const tx = new Transaction();

      const lltyAccInfo = await connection.getAccountInfo(lltyAta);
      if (!lltyAccInfo) {
        tx.add(
          createAssociatedTokenAccountInstruction(buyer, lltyAta, buyer, ADDRESSES.LLTY_MINT)
        );
      }

      const discriminator = new Uint8Array([189, 21, 230, 133, 247, 2, 110, 42]);
      const amountBytes = new BN(tokenAmountInSmallestUnit).toArrayLike(Buffer, 'le', 8);
      const data = Buffer.concat([Buffer.from(discriminator), amountBytes]);

      tx.add(
        new TransactionInstruction({
          keys: [
            { pubkey: ADDRESSES.PRESALE_PDA, isSigner: false, isWritable: true },
            { pubkey: buyer, isSigner: true, isWritable: true },
            { pubkey: paymentAta, isSigner: false, isWritable: true },
            { pubkey: lltyAta, isSigner: false, isWritable: true },
            { pubkey: paymentVault, isSigner: false, isWritable: true },
            { pubkey: ADDRESSES.LLTY_VAULT, isSigner: false, isWritable: true },
            { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
            { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
          ],
          programId: ADDRESSES.PROGRAM_ID,
          data,
        })
      );

      tx.feePayer = buyer;
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('confirmed');
      tx.recentBlockhash = blockhash;

      showNotification('info', lang === 'ar' ? 'جاري المعالجة...' : 'Processing...');

      // ──── REOWN SIGNING & SENDING ────
      
      const signed = await walletProvider.signTransaction(tx);
      
      const effectiveConnection = connection || fallbackConnection;

      signature = await connection.sendRawTransaction(signed.serialize(), {
        skipPreflight: false,
        preflightCommitment: 'confirmed',
        maxRetries: 3
      });

      setTxSignature(signature);
      showNotification('info', lang === 'ar' ? 'جاري تأكيد المعاملة...' : 'Confirming transaction...');

      const confirmation = await connection.confirmTransaction({
        signature,
        blockhash,
        lastValidBlockHeight
      }, 'confirmed');

      if (confirmation.value.err) {
        throw new Error('Transaction failed on-chain');
      }

      setTxStatus('confirmed');
      tokensReceived = totalTokens;

      try {
        const verification = await dbHelpers.verifyTransaction(signature, connection);
        if (!verification.verified) {
          console.warn('Transaction verification failed:', verification.reason);
          captureMessage('Transaction verified but validation concerns', 'warning', {
            tags: { wallet: address, signature },
            extra: { reason: verification.reason }
          });
        }
      } catch (verifyErr) {
        console.error('Verification error:', verifyErr);
        captureError(verifyErr, {
          tags: { function: 'verifyTransaction', wallet: address },
          extra: { signature }
        });
      }

      try {
        const { data: dbRecord, error: dbError } = await dbHelpers.recordPurchase({
          walletAddress: address,
          tokensPurchased: tokensReceived,
          usdAmount: usdValue,
          currency,
          bonusPercentage,
          signature,
          phase: currentPhase,
          isVip: isVipPeriod
        });
        if (dbError) {
          console.error('Database error:', dbError);
          captureError(new Error('Database save failed'), {
            tags: { function: 'recordPurchase', wallet: address },
            extra: { error: dbError, signature }
          });
        } else {
          console.log('Purchase recorded in database:', dbRecord);
          setTimeout(async () => {
            await dbHelpers.markVerified(signature);
          }, 5000);
        }
      } catch (dbErr) {
        console.error('Database exception:', dbErr);
        captureError(dbErr, {
          tags: { function: 'recordPurchase', wallet: address },
          extra: { signature }
        });
      }

      const stored = localStorage.getItem('llty_wallet');
      const dataStored = stored ? JSON.parse(stored) : { address, purchased: 0 };
      dataStored.purchased = (dataStored.purchased || 0) + tokensReceived;
      dataStored.lastPurchase = Date.now();
      dataStored.lastSignature = signature;
      localStorage.setItem('llty_wallet', JSON.stringify(dataStored));
      setPurchased(dataStored.purchased);

      const totalData = localStorage.getItem('llty_total_raised');
      const currentTotal = totalData ? JSON.parse(totalData) : { raised: 0, sold: 0 };
      currentTotal.raised += usdValue;
      currentTotal.sold += tokensReceived;
      localStorage.setItem('llty_total_raised', JSON.stringify(currentTotal));
      setTotalRaised(currentTotal.raised);
      setTotalLLTYSold(currentTotal.sold);

      if (isVipPeriod) {
        const vipData = localStorage.getItem('llty_vip_count');
        const currentVipCount = vipData ? parseInt(vipData) : 0;
        const newVipCount = Math.min(currentVipCount + 1, 50);
        localStorage.setItem('llty_vip_count', newVipCount.toString());
        setVipBuyersCount(newVipCount);
      }

      setAmount('');
      setCalculatedTokens(0);
      setBonusPercentage(0);
      await fetchBalances();

      showNotification(
        'success',
        `${lang === 'ar' ? 'نجح الشراء!' : 'Purchase successful!'} ${tokensReceived.toLocaleString()} LLTY${bonusPercentage > 0 ? ` (+${bonusPercentage}% ${lang === 'ar' ? 'مكافأة' : 'bonus'})` : ''}`
      );

      captureMessage('Purchase completed', 'info', {
        tags: { wallet: address, currency, phase: currentPhase },
        extra: { tokens: tokensReceived, usdValue, bonus: bonusPercentage }
      });

      setTimeout(() => {
        showNotification(
          'info',
          `${lang === 'ar' ? 'عرض المعاملة' : 'View transaction'}: https://explorer.solana.com/tx/${signature}?cluster=${NETWORK}`
        );
      }, 2000);

    } catch (err) {
      console.error('Buy tokens error:', err);
      setTxStatus('failed');

      try {
        await dbHelpers.logError({
          walletAddress: address,
          type: 'purchase_error',
          message: err.message || 'Unknown error',
          function: 'buyTokens',
          extra: {
            amount: amt,
            currency,
            signature,
            usdValue,
            phase: currentPhase
          }
        });
      } catch (logErr) {
        console.error('Failed to log error:', logErr);
      }

      captureError(err, {
        tags: { function: 'buyTokens', wallet: address, currency },
        extra: { amount: amt, signature, usdValue }
      });

      let errorMessage = err.message || 'Unknown error';
      if (errorMessage.includes('User rejected')) {
        errorMessage = lang === 'ar' ? 'تم إلغاء المعاملة' : 'Transaction cancelled';
      } else if (errorMessage.includes('Insufficient')) {
        errorMessage = lang === 'ar' ? 'رصيد غير كافٍ' : errorMessage;
      } else if (errorMessage.includes('Blockhash not found')) {
        errorMessage = lang === 'ar'
          ? 'انتهت صلاحية المعاملة. حاول مرة أخرى'
          : 'Transaction expired. Please try again';
      } else if (errorMessage.includes('SOL price')) {
        errorMessage = lang === 'ar'
          ? 'فشل تحميل سعر SOL. حاول مرة أخرى'
          : 'Failed to load SOL price. Please try again';
      }
      showNotification('error', `${lang === 'ar' ? 'خطأ' : 'Error'}: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  // Fetch presale data from chain
  const fetchPresaleData = async (conn) => {
    try {
      const totalData = localStorage.getItem('llty_total_raised');
      if (totalData) {
        const data = JSON.parse(totalData);
        setTotalRaised(data.raised || 0);
        setTotalLLTYSold(data.sold || 0);
      }
    } catch (err) {
      console.error('Failed to fetch presale data:', err);
    }
  };

  // Fetch SOL price
  const fetchSolPrice = async () => {
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd');
      const data = await response.json();
      setSolPrice(data.solana?.usd || 150);
    } catch (err) {
      setSolPrice(150);
    }
  };

  // Timer calculations
  useEffect(() => {
    const updateTimer = () => {
      const now = Date.now();
      if (now >= PRESALE_START && now < PUBLIC_START) {
        setIsVipPeriod(true);
        const vipRemaining = PUBLIC_START - now;
        setPhaseTimeRemaining({
          days: Math.floor(vipRemaining / (1000 * 60 * 60 * 24)),
          hours: Math.floor((vipRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((vipRemaining % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((vipRemaining % (1000 * 60)) / 1000)
        });
        setCurrentPhase(0); // VIP phase
        return;
      }
      setIsVipPeriod(false);
      if (now < PUBLIC_START) {
        setCurrentPhase(0);
        return;
      }
      if (now > PRESALE_END) {
        setPresaleEnded(true);
        setPhaseTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      const elapsed = now - PUBLIC_START;
      const phase = Math.min(Math.floor(elapsed / PHASE_DURATION) + 1, 3);
      setCurrentPhase(phase);
      const phaseStart = PUBLIC_START + ((phase - 1) * PHASE_DURATION);
      const phaseEnd = phaseStart + PHASE_DURATION;
      const remaining = phaseEnd - now;
      setPhaseTimeRemaining({
        days: Math.floor(remaining / (1000 * 60 * 60 * 24)),
        hours: Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((remaining % (1000 * 60)) / 1000)
      });
    };
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  // City carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCityIndex((prev) => (prev + 1) % citiesData.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Initialize
  useEffect(() => {
    const conn = new Connection(RPC_ENDPOINT, 'confirmed');
    fetchSolPrice();
    fetchPresaleData(conn);
  }, []);

  const progressPercentage = Math.min((totalRaised / PRESALE_TARGET) * 100, 100);

  // Debounced buy function to prevent spam
  const buyTokensDebounced = useCallback(
    debounce(buyTokens, 2000, { leading: true, trailing: false }),
    [buyTokens]
  );

  // ────────────────────────────────────────────────
  // RENDER
  // ────────────────────────────────────────────────
  return (
    <div className={`min-h-screen ${lang === 'ar' ? 'rtl' : 'ltr'} font-sans`}
      style={{
        background: 'linear-gradient(to bottom, #0f172a 0%, #1e293b 50%, #334155 100%)',
        color: '#f1f5f9'
      }}>

      {/* ============================================================ */}
      {/* HEADER - Dark with high contrast */}
      {/* ============================================================ */}
      <header className="sticky top-0 z-50 backdrop-blur-md border-b border-yellow-500/20"
        style={{ background: 'rgba(15, 23, 42, 0.95)' }}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <LLTYLogo size={48} />
              <div>
                <h1 className="text-2xl font-bold text-yellow-400">{t.title}</h1>
                <p className="text-xs text-gray-300">{t.subtitle}</p>
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

              {isConnected ? (
                <div className="flex items-center gap-2">
                  <div className="hidden sm:block px-4 py-2 rounded-lg text-sm font-medium"
                    style={{ background: 'rgba(251, 191, 36, 0.1)', border: '1px solid rgba(251, 191, 36, 0.3)' }}>
                    <div className="text-yellow-400 font-bold">{shortenAddress(address)}</div>
                    <div className="text-xs text-gray-400">{balance.toFixed(2)} LLTY</div>
                  </div>
                  <button
                    onClick={() => open()}
                    className="p-2 rounded-lg hover:bg-yellow-500/20 transition-colors group"
                    title={lang === 'ar' ? 'تغيير المحفظة' : 'Change Wallet'}
                  >
                    <svg
                      width="20"
                      height="20"
                      fill="currentColor"
                      className="text-yellow-400 group-hover:rotate-180 transition-transform duration-300"
                      viewBox="0 0 16 16"
                    >
                      <path d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
                      <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
                    </svg>
                  </button>
                 <button 
                    onClick={handleDisconnect}
                    className="text-red-500 hover:text-red-700 font-medium flex items-center gap-1"
                    disabled={!isConnected}
                    >
                    <span>X</span> {lang === 'ar' ? 'فصل' : 'Disconnect'}
                 </button>
                </div>
              ) : (
                <button
                  onClick={() => open()}
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

      {/* ============================================================ */}
      {/* NOTIFICATION */}
      {/* ============================================================ */}
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
        {/* ============================================================ */}
        {/* HERO SECTION WITH BIGGER CENTERED TIMER */}
        {/* ============================================================ */}
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

          {/* BIGGER TIMER - CENTERED AT TOP */}
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
              {/* Timer Display - BIGGER */}
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

          {/* ============================================================ */}
          {/* PROGRESS BAR - FIXED CALCULATION */}
          {/* ============================================================ */}
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

        {/* ============================================================ */}
        {/* VIP EARLY ACCESS SECTION */}
        {/* ============================================================ */}
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

        {/* ============================================================ */}
        {/* BONUS TIERS SECTION */}
        {/* ============================================================ */}
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

        {/* ============================================================ */}
        {/* REFERRAL SYSTEM SECTION */}
        {/* ============================================================ */}
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
            {isConnected && (
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

        {/* ============================================================ */}
        {/* BUY SECTION */}
        {/* ============================================================ */}
        <section id="buy" className="mb-16">
          <div className="max-w-2xl mx-auto rounded-2xl p-8 shadow-2xl border-2"
            style={{
              background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
              borderColor: '#fbbf24'
            }}>
            <h2 className="text-3xl font-bold text-center mb-6 text-yellow-400">
              {isVipPeriod ? '👑 VIP Purchase' : t.investNow}
            </h2>
            {isConnected ? (
              <div className="space-y-6">
                {/* Currency Selection */}
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
                          border: `2px solid ${currency === curr ? '#fbbf24' : 'rgba(251, 191, 36, 0.3)'}`,
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

                {/* Amount Input */}
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

                {/* Bonus Display */}
                {getBonusPercentage() > 0 && (
                  <div className="rounded-lg p-4 text-center"
                    style={{ background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.3)' }}>
                    <Gift className="text-green-400 mx-auto mb-2" size={32} />
                    <p className="text-green-400 font-bold text-lg">
                      🎁 {getBonusPercentage()}% Bonus Applied!
                    </p>
                  </div>
                )}

                {/* Token Display */}
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

                {/* Buy Button */}
                <button
                  onClick={buyTokensDebounced}
                  disabled={loading || !amount || parseFloat(amount) <= 0}
                  className="w-full py-4 rounded-xl font-bold text-xl transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                    color: '#1e293b'
                  }}>
                  {loading ? t.processing : t.buy}
                </button>

                {/* User Stats */}
                {purchased > 0 && (
                  <div className="rounded-xl p-4 border"
                    style={{ background: 'rgba(251, 191, 36, 0.05)', borderColor: 'rgba(251, 191, 36, 0.2)' }}>
                    <p className="text-sm text-gray-400 mb-1">{t.yourBalance}</p>
                    <p className="text-2xl font-bold text-yellow-400">
                      {purchased.toLocaleString()} LLTY
                    </p>
                  </div>
                )}

                {/* Database Stats - Only for connected wallets */}
                <div className="mt-8">
                  <h3 className="text-2xl font-bold text-center mb-4 text-yellow-400">
                    {lang === 'ar' ? 'لوحة التحكم' : 'Your Dashboard'}
                  </h3>
                  <DatabaseStats wallet={address} lang={lang} />
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Wallet className="mx-auto mb-4 text-gray-500" size={64} />
                <p className="text-xl text-gray-400 mb-6">{t.walletNotConnected}</p>
                <button
                  onClick={() => open()}
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
        </section>

        {/* Withdrawal Info - OUTSIDE buy section */}
        <section className="mb-16">
          <div className="max-w-2xl mx-auto rounded-xl p-6 border"
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

        {/* ============================================================ */}
        {/* ABOUT SECTION */}
        {/* ============================================================ */}
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
            <span>{lang === 'ar' ? 'أول عملة عربية مدعومة بمحفظة عقارية متنوعة في 9 مدن رئيسية (عمان، دبي، الرياض، جدة، القاهرة، بيروت، الدوحة، الكويت، أبوظبي)' : 'First Arab token backed by a diversified real-estate portfolio across 9 major cities (Amman, Dubai, Riyadh, Jeddah, Cairo, Beirut, Doha, Kuwait, Abu Dhabi)'}</span>
          </li>
          <li className="flex items-start gap-4">
            <Building className="text-yellow-400 flex-shrink-0 mt-1.5" size={28} />
            <span>{lang === 'ar' ? 'استثمار حقيقي وليس مجرد وعود – الأموال تُحول إلى عقارات ملموسة تولد إيرادات حقيقية' : 'Real investment, not just promises – funds are converted into tangible properties generating actual rental income'}</span>
          </li>
          <li className="flex items-start gap-4">
            <Users className="text-yellow-400 flex-shrink-0 mt-1.5" size={28} />
            <span>{lang === 'ar' ? 'مجتمع قوي وشفافية كاملة – كل معاملة على سلسلة Solana مرئية ومدققة' : 'Strong community & full transparency – every transaction on Solana is visible and verifiable'}</span>
          </li>
          <li className="flex items-start gap-4">
            <TrendingUp className="text-yellow-400 flex-shrink-0 mt-1.5" size={28} />
            <span>{lang === 'ar' ? 'فرص نمو مزدوجة: ارتفاع سعر الرمز + توزيع أرباح من الإيجارات المستقبلية' : 'Dual growth opportunity: token price appreciation + future rental profit distribution to holders'}</span>
          </li>
        </ul>
      </div>

      <div className="space-y-6 bg-gradient-to-br from-yellow-950/30 to-amber-950/20 p-8 rounded-2xl border border-yellow-600/30">
        <h3 className="text-3xl font-bold text-yellow-400 mb-6">
          {lang === 'ar' ? 'كيف تربح من LLTY؟' : 'How Do You Profit from LLTY?'}
        </h3>
        <div className="space-y-8">
          <div>
            <p className="text-xl font-semibold text-white mb-2 flex items-center gap-3">
              <TrendingUp size={28} className="text-green-400" />
              {lang === 'ar' ? 'ارتفاع قيمة الرمز' : 'Token Price Appreciation'}
            </p>
            <p className="text-gray-300">
              {lang === 'ar'
                ? 'اشترِ الآن في البيع المسبق بأسعار منخفضة – السعر يرتفع مع كل مرحلة، ثم الإدراج في البورصات الكبرى.'
                : 'Buy now in presale at low prices – price increases each phase, then major exchange listings drive value.'}
            </p>
          </div>
          <div>
            <p className="text-xl font-semibold text-white mb-2 flex items-center gap-3">
              <Coins size={28} className="text-green-400" />
              {lang === 'ar' ? 'أرباح الإيجارات الموزعة' : 'Rental Profit Distribution'}
            </p>
            <p className="text-gray-300">
              {lang === 'ar'
                ? 'عندما تبدأ العقارات بتوليد إيرادات إيجارية، سيتم توزيع نسبة من الأرباح على حاملي LLTY (آلية مستقبلية مدققة).'
                : 'Once properties generate rental income, a portion of profits will be distributed to LLTY holders (future audited mechanism).'}
            </p>
          </div>
          <div>
            <p className="text-xl font-semibold text-white mb-2 flex items-center gap-3">
              <Award size={28} className="text-green-400" />
              {lang === 'ar' ? 'قيمة طويلة الأمد من العقارات' : 'Long-Term Real Estate Value'}
            </p>
            <p className="text-gray-300">
              {lang === 'ar'
                ? 'محفظة عقارية متنامية في أسواق عربية مزدهرة – كل LLTY تمثل حصة حقيقية في أصول تنمو قيمتها مع الزمن.'
                : 'Growing real-estate portfolio in booming Arab markets – each LLTY represents real ownership in appreciating assets.'}
            </p>
          </div>
        </div>
      </div>
    </div>

    {/* Urgency & Call to Action */}
    <div className="text-center mt-12 p-8 rounded-2xl bg-gradient-to-r from-yellow-950/50 to-amber-950/30 border border-yellow-600/40">
      <p className="text-2xl md:text-3xl font-bold text-yellow-300 mb-6">
        {lang === 'ar'
          ? 'فرصة محدودة – البيع المسبق يتقدم بسرعة والسعر يرتفع كل أسبوعين'
          : 'Limited Opportunity – Presale is advancing quickly and price increases every two weeks'}
      </p>
      <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto">
        {lang === 'ar'
          ? 'كن من المستثمرين الأوائل في أول عملة عقارية عربية حقيقية – قبل أن تصبح متاحة للجميع في البورصات العالمية.'
          : 'Be among the first investors in the first genuine Arab real-estate token – before it becomes available to everyone on global exchanges.'}
      </p>
      <button
        onClick={() => scrollToSection('buy')}
        className="px-12 py-5 rounded-full text-2xl font-bold shadow-2xl hover:scale-105 transition-all"
        style={{
          background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
          color: '#1e293b'
        }}
      >
        {lang === 'ar' ? 'استثمر الآن قبل ارتفاع السعر' : 'Invest Now Before Price Increase'}
      </button>
    </div>
  </div>
</section>
        {/* ============================================================ */}
        {/* HOW IT WORKS */}
        {/* ============================================================ */}
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

        {/* ============================================================ */}
        {/* CITIES CAROUSEL */}
        {/* ============================================================ */}
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

        {/* ============================================================ */}
        {/* TOKENOMICS - Updated percentages & Arabic labels */}
        {/* ============================================================ */}
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

        {/* ============================================================ */}
        {/* ROADMAP - Arabic labels fixed */}
        {/* ============================================================ */}
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
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ============================================================ */}
        {/* SECURITY */}
        {/* ============================================================ */}
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
                href="/whitepaper-ar.html"
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
                href="/whitepaper-en.html"
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

      {/* ============================================================ */}
      {/* FOOTER */}
      {/* ============================================================ */}
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
