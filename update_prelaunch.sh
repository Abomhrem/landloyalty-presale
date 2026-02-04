#!/bin/bash

# Fix the className syntax error on line 854
sed -i '854s/.*/    <div className={`min-h-screen ${lang === '"'"'ar'"'"' ? '"'"'rtl'"'"' : '"'"'ltr'"'"'} font-sans`}/' src/App.tsx

# Add pre-launch conditional rendering after the notification div (around line 872)
# Find the line with </Header> and add the conditional before <main>

# Create the new App.tsx section to insert
cat > /tmp/prelaunch_insert.txt << 'INSERTEOF'

      {/* Pre-Launch Mode: Show countdown instead of main content */}
      {isPreLaunch ? (
        <>
          <Header
            lang={lang}
            setLang={setLang}
            t={t}
            isConnected={isConnected}
            address={address}
            balance={balance}
            menuOpen={menuOpen}
            setMenuOpen={setMenuOpen}
            loading={loading}
            open={open}
            handleDisconnect={handleDisconnect}
            scrollToSection={scrollToSection}
            shortenAddress={shortenAddress}
          />
          <PreLaunchCountdown
            lang={lang}
            launchDate={VIP_LAUNCH_DATE}
            onLaunchComplete={handleLaunchComplete}
            showNotification={showNotification}
          />
          <Footer lang={lang} />
          {showWalletNotReady && (
            <WalletNotReadyMessage
              lang={lang}
              onSubscribe={() => {
                setShowWalletNotReady(false);
                document.getElementById('notification-signup')?.scrollIntoView({ behavior: 'smooth' });
              }}
            />
          )}
        </>
      ) : (
        <>
INSERTEOF

echo "Script created - manual integration needed"
