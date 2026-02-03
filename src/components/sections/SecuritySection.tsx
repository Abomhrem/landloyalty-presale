import React from 'react';
import { Shield, Download } from 'lucide-react';

interface SecuritySectionProps {
  lang: string;
  t: any;
}

const SecuritySection: React.FC<SecuritySectionProps> = ({ lang, t }) => {
  return (
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
          <a href="/whitepaper-ar.html" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all hover:scale-105" style={{ background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)', color: '#1e293b' }}>
            <Download size={20} />
            {t.whitepaperAr}
          </a>
          <a href="/whitepaper-en.html" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all hover:scale-105" style={{ background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)', color: '#1e293b' }}>
            <Download size={20} />
            {t.whitepaperEn}
          </a>
        </div>
      </div>
    </section>
  );
};

export default SecuritySection;
