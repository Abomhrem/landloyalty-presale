const LLTYPresale = () => {
  const { 
    lang, setLang, t, 
    notification, showNotification, 
    menuOpen, setMenuOpen, 
    scrollToSection 
  } = useGlobalState();
  
  const presale = usePresale(lang, t, showNotification);

  return (
    <div className={`min-h-screen ${lang === 'ar' ? 'rtl' : 'ltr'} font-sans`}
      style={{
        background: 'linear-gradient(to bottom, #0f172a 0%, #1e293b 50%, #334155 100%)',
        color: '#f1f5f9'
      }}>

      <Header 
        lang={lang} setLang={setLang} t={t} 
        menuOpen={menuOpen} setMenuOpen={setMenuOpen} 
        scrollToSection={scrollToSection} 
        notification={notification}
      />

      <main className="container mx-auto px-4 py-8">
        <HeroSection t={t} lang={lang} />
        
        <div className="grid lg:grid-cols-2 gap-12 items-start mb-16">
          <BuySection 
            t={t} lang={lang} 
            {...presale} 
          />
          <DatabaseStats wallet={presale.address} lang={lang} />
        </div>

        <VIPSection t={t} lang={lang} />
        <BonusTiersSection t={t} lang={lang} />
        <AboutSection t={t} lang={lang} />
        <RoadmapSection t={t} roadmapData={roadmapData} lang={lang} />
      </main>

      <Footer />
    </div>
  );
};

export default LLTYPresale;
