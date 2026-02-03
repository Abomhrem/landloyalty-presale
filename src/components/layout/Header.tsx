import React from 'react';
import { Wallet, Menu, X } from 'lucide-react';
import LLTYLogo from '../LLTYLogo.jsx';

interface HeaderProps {
  lang: string;
  setLang: (lang: string) => void;
  t: any;
  isConnected: boolean;
  address: string | undefined;
  balance: number;
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  loading: boolean;
  open: () => void;
  handleDisconnect: () => Promise<void>;
  scrollToSection: (id: string) => void;
  shortenAddress: (address: string) => string;
}

const Header: React.FC<HeaderProps> = ({
  lang,
  setLang,
  t,
  isConnected,
  address,
  balance,
  menuOpen,
  setMenuOpen,
  loading,
  open,
  handleDisconnect,
  scrollToSection,
  shortenAddress
}) => {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md border-b border-yellow-500/20"
      style={{ background: 'rgba(15, 23, 42, 0.95)' }}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <LLTYLogo size={48} />
            <div>
              <h1 className="text-xl lg:text-2xl font-bold text-yellow-400">{t.title}</h1>
              <p className="text-xs text-gray-300 hidden sm:block">{t.subtitle}</p>
            </div>
          </div>

          {/* Desktop Navigation - ALWAYS VISIBLE */}
          <nav className="flex items-center gap-2 lg:gap-4 xl:gap-6 flex-1 justify-center max-w-3xl">
            <button 
              onClick={() => scrollToSection('buy')} 
              className="text-gray-200 hover:text-yellow-400 transition-colors font-medium text-xs lg:text-sm xl:text-base whitespace-nowrap px-2"
            >
              {lang === 'ar' ? '💰 شراء' : '💰 Buy'}
            </button>
            <button 
              onClick={() => scrollToSection('staking')} 
              className="text-gray-200 hover:text-purple-400 transition-colors font-medium text-xs lg:text-sm xl:text-base whitespace-nowrap px-2"
            >
              {lang === 'ar' ? '💎 تخزين' : '💎 Stake'}
            </button>
            <button 
              onClick={() => scrollToSection('governance')} 
              className="text-gray-200 hover:text-blue-400 transition-colors font-medium text-xs lg:text-sm xl:text-base whitespace-nowrap px-2"
            >
              {lang === 'ar' ? '🏛️ حوكمة' : '🏛️ DAO'}
            </button>
            <button
              onClick={() => scrollToSection('profit-distribution')}
              className="text-gray-200 hover:text-green-400 transition-colors font-medium text-xs lg:text-sm xl:text-base whitespace-nowrap px-2"
            >
              {lang === 'ar' ? '💵 أرباح' : '💵 Profits'}
            </button>
            <button 
              onClick={() => scrollToSection('about')} 
              className="text-gray-200 hover:text-yellow-400 transition-colors font-medium text-xs lg:text-sm xl:text-base whitespace-nowrap px-2 hidden sm:block"
            >
              {lang === 'ar' ? 'عن' : 'About'}
            </button>
            <button 
              onClick={() => scrollToSection('tokenomics')} 
              className="text-gray-200 hover:text-yellow-400 transition-colors font-medium text-xs lg:text-sm xl:text-base whitespace-nowrap px-2 hidden md:block"
            >
              {lang === 'ar' ? 'توزيع' : 'Tokenomics'}
            </button>
            <button 
              onClick={() => scrollToSection('roadmap')} 
              className="text-gray-200 hover:text-yellow-400 transition-colors font-medium text-xs lg:text-sm xl:text-base whitespace-nowrap px-2 hidden lg:block"
            >
              {lang === 'ar' ? 'خطة' : 'Roadmap'}
            </button>
          </nav>

          {/* Right side - Language switcher and wallet */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Language Toggle */}
            <button
              onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
              className="px-3 py-2 rounded-lg font-bold text-sm transition-all hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                color: '#1e293b'
              }}>
              {lang === 'ar' ? 'EN' : 'عربي'}
            </button>

            {/* Wallet Section */}
            {isConnected ? (
              <div className="flex items-center gap-2">
                <div className="hidden lg:block px-3 py-2 rounded-lg text-sm font-medium"
                  style={{ background: 'rgba(251, 191, 36, 0.1)', border: '1px solid rgba(251, 191, 36, 0.3)' }}>
                  <div className="text-yellow-400 font-bold text-xs">{shortenAddress(address || '')}</div>
                  <div className="text-xs text-gray-400">{balance.toFixed(2)} LLTY</div>
                </div>
                <button
                  onClick={() => open()}
                  className="p-2 rounded-lg hover:bg-yellow-500/20 transition-colors group"
                  title={lang === 'ar' ? 'تغيير المحفظة' : 'Change Wallet'}
                >
                  <Wallet className="text-yellow-400" size={20} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => open()}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all hover:scale-105 disabled:opacity-50"
                style={{
                  background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                  color: '#1e293b'
                }}>
                <Wallet size={18} />
                <span className="hidden sm:inline text-xs lg:text-sm">{loading ? t.connecting : t.connectWallet}</span>
              </button>
            )}

            {/* Mobile Menu Button - Only show on small screens */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="sm:hidden p-2 text-gray-200 hover:text-yellow-400"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Only for very small screens */}
      {menuOpen && (
        <div className="sm:hidden border-t border-yellow-500/20 py-4"
          style={{ background: 'rgba(15, 23, 42, 0.98)' }}>
          <div className="container mx-auto px-4 flex flex-col gap-3">
            <button 
              onClick={() => { scrollToSection('buy'); setMenuOpen(false); }} 
              className="text-left py-2 text-gray-200 hover:text-yellow-400 font-medium"
            >
              💰 {lang === 'ar' ? 'شراء LLTY' : 'Buy LLTY'}
            </button>
            <button 
              onClick={() => { scrollToSection('staking'); setMenuOpen(false); }} 
              className="text-left py-2 text-gray-200 hover:text-purple-400 font-medium"
            >
              💎 {lang === 'ar' ? 'التخزينينغ' : 'Staking'}
            </button>
            <button 
              onClick={() => { scrollToSection('governance'); setMenuOpen(false); }} 
              className="text-left py-2 text-gray-200 hover:text-blue-400 font-medium"
            >
              🏛️ {lang === 'ar' ? 'الحوكمة (DAO)' : 'Governance (DAO)'}
            </button>
            <button
              onClick={() => { scrollToSection('profit-distribution'); setMenuOpen(false); }}
              className="text-left py-2 text-gray-200 hover:text-green-400 font-medium"
            >
              💵 {lang === 'ar' ? 'توزيع الأرباح' : 'Profit Distribution'}
            </button>
            <button 
              onClick={() => { scrollToSection('about'); setMenuOpen(false); }} 
              className="text-left py-2 text-gray-200 hover:text-yellow-400 font-medium"
            >
              ℹ️ {lang === 'ar' ? 'عن المشروع' : 'About'}
            </button>
            <button 
              onClick={() => { scrollToSection('tokenomics'); setMenuOpen(false); }} 
              className="text-left py-2 text-gray-200 hover:text-yellow-400 font-medium"
            >
              📊 {lang === 'ar' ? 'التوزيع' : 'Tokenomics'}
            </button>
            <button 
              onClick={() => { scrollToSection('roadmap'); setMenuOpen(false); }} 
              className="text-left py-2 text-gray-200 hover:text-yellow-400 font-medium"
            >
              🗺️ {lang === 'ar' ? 'خارطة الطريق' : 'Roadmap'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
