#!/bin/bash

# Backup
cp src/App.tsx src/App.tsx.pre-timing-update

# Remove old state declarations (lines 170-177 approximately)
# We'll remove these specific lines
sed -i '/const \[currentPhase, setCurrentPhase\] = useState(1);/d' src/App.tsx
sed -i '/const \[isVipPeriod, setIsVipPeriod\] = useState(false);/d' src/App.tsx
sed -i '/const \[presaleEnded, setPresaleEnded\] = useState(false);/d' src/App.tsx
sed -i '/const \[phaseTimeRemaining, setPhaseTimeRemaining\] = useState({/,/});/d' src/App.tsx

# Remove the old timer useEffect block (from "// Timer calculations" to the interval cleanup)
sed -i '/\/\/ Timer calculations/,/return () => clearInterval(interval);/d' src/App.tsx
sed -i '/}, \[\]);/d' src/App.tsx

# Now add derived values from timing hook after the hook declaration
# Find the line with "const timing = usePresaleTiming();" and add after it
sed -i '/const timing = usePresaleTiming();/a\
\
  \/\/ Derived values from timing hook (for backward compatibility)\
  const currentPhase = timing.phaseNumber - 1; \/\/ Convert to 0-3 range\
  const isVipPeriod = timing.isVipPhase;\
  const presaleEnded = timing.hasEnded;\
  const phaseTimeRemaining = {\
    days: timing.timeRemaining.days,\
    hours: timing.timeRemaining.hours,\
    minutes: timing.timeRemaining.minutes,\
    seconds: timing.timeRemaining.seconds\
  };' src/App.tsx

echo "✅ App.tsx updated successfully!"
echo "📝 Old version saved as: src/App.tsx.pre-timing-update"
