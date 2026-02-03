import React from 'react';

interface CitiesSectionProps {
  lang: string;
  t: any;
  citiesData: Array<{ name: string; image: string }>;
  currentCityIndex: number;
  setCurrentCityIndex: (index: number) => void;
}

const CitiesSection: React.FC<CitiesSectionProps> = ({
  lang,
  t,
  citiesData,
  currentCityIndex,
  setCurrentCityIndex
}) => {
  return (
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
  );
};

export default CitiesSection;
