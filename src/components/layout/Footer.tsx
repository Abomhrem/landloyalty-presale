import React from 'react';
import { Facebook, Send, Twitter, Instagram } from 'lucide-react';
import LLTYLogo from '../LLTYLogo.jsx';

interface FooterProps {
  lang: string;
}

const Footer: React.FC<FooterProps> = ({ lang }) => {
  return (
    <footer className="border-t border-yellow-500/20 py-12" style={{ background: 'rgba(15, 23, 42, 0.95)' }}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-8">
          <div className="flex flex-col items-center gap-3">
            <LLTYLogo size={64} />
            <div className="text-center">
              <h3 className="text-2xl font-bold text-yellow-400">LLTY</h3>
              <p className="text-lg font-semibold text-white mt-1">{lang === 'ar' ? 'لويالتي' : 'Loyalty'}</p>
              <p className="text-sm text-gray-400 mt-1">{lang === 'ar' ? 'عملة الاستثمار العقاري' : 'Real Estate Investment Token'}</p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-6">
            <a href="https://instagram.com/landloyalty" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full transition-all hover:scale-110" style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)' }}><Instagram size={24} style={{ color: '#E4405F' }} /></a>
            <a href="https://x.com/Landloyalt" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full transition-all hover:scale-110" style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)' }}><Twitter size={24} style={{ color: '#1DA1F2' }} /></a>
            <a href="https://t.me/landloyalty" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full transition-all hover:scale-110" style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)' }}><Send size={24} style={{ color: '#0088cc' }} /></a>
            <a href="https://facebook.com/landloyalty" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full transition-all hover:scale-110" style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)' }}><Facebook size={24} style={{ color: '#1877F2' }} /></a>
          </div>
          <div className="w-full max-w-md h-px bg-gradient-to-r from-transparent via-yellow-500/30 to-transparent"></div>
          <div className="text-center text-gray-400 text-sm">
            <p>© 2026 Loyalty. {lang === 'ar' ? 'جميع الحقوق محفوظة' : 'All rights reserved'}.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
