import React from 'react';

interface RoadmapItem {
  quarter: string;
  title: string;
  desc: string;
}

interface RoadmapSectionProps {
  lang: string;
  t: any;
  roadmapData: RoadmapItem[];
}

const RoadmapSection: React.FC<RoadmapSectionProps> = ({ lang, t, roadmapData }) => {
  return (
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
  );
};

export default RoadmapSection;
