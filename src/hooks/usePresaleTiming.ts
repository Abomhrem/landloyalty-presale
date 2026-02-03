import { useState, useEffect, useCallback, useMemo } from 'react';
import { fetchOnChainPresaleTiming, OnChainPresaleTiming } from '../services/presaleTimingService';
import {
  getCurrentPhase,
  getCurrentPhaseTimeRemaining,
  getTimeRemaining,
  PRESALE_PHASES,
  type PhaseInfo,
  type TimeRemaining,
  type PresalePhase,
} from '../config/presale-timing-config';

export interface UsePresaleTimingReturn {
  currentPhase: PhaseInfo;
  phaseName: PresalePhase;
  phaseNumber: number;
  currentPrice: number;
  timeRemaining: TimeRemaining;
  timeRemainingFormatted: string;
  isActive: boolean;
  hasStarted: boolean;
  hasEnded: boolean;
  isVipPhase: boolean;
  currentTime: number;
  phaseStartTime: number;
  phaseEndTime: number;
  presaleEndTime: number;
  phaseProgress: number;
  refresh: () => void;
  onChainTiming: OnChainPresaleTiming | null;
}

export function usePresaleTiming(updateInterval: number = 1000): UsePresaleTimingReturn {
  const [currentTime, setCurrentTime] = useState<number>(Date.now());
  const [onChainTiming, setOnChainTiming] = useState<OnChainPresaleTiming | null>(null);

  // Fetch on-chain timing on mount
  useEffect(() => {
    fetchOnChainPresaleTiming()
      .then(timing => {
        setOnChainTiming(timing);
        console.log("🔍 On-chain timing loaded:", timing);
      })
      .catch(err => console.error('Failed to fetch on-chain timing:', err));
  }, []);

  // Update current time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, updateInterval);
    return () => clearInterval(interval);
  }, [updateInterval]);

  // Determine if we're in VIP phase using ON-CHAIN data
  const isVipPhase = useMemo(() => {
    if (!onChainTiming) return false;
    const inVipTime = currentTime >= onChainTiming.vipStartTime && 
                      currentTime < onChainTiming.vipEndTime;
    const buyersNotFull = onChainTiming.vipBuyersCount < onChainTiming.vipMaxBuyers;
    const result = inVipTime && buyersNotFull;
    
    // console.log("🎯 isVipPhase calculated:", {
      // result,
      // currentTime: new Date(currentTime),
      // vipStart: new Date(onChainTiming.vipStartTime),
      // vipEnd: new Date(onChainTiming.vipEndTime),
      // inVipTime,
      // buyersNotFull,
      // buyersCount: onChainTiming.vipBuyersCount,
      // maxBuyers: onChainTiming.vipMaxBuyers
    // });
    
    return result;
  }, [onChainTiming, currentTime]);

  const currentPhase = useMemo(() => getCurrentPhase(currentTime), [currentTime]);
  
  // Calculate time remaining based on whether we're in VIP or not
  const timeRemaining = useMemo(() => {
    if (isVipPhase && onChainTiming) {
      // Use on-chain VIP end time
      const msRemaining = Math.max(0, onChainTiming.vipEndTime - currentTime);
      return {
        total: msRemaining,
        days: Math.floor(msRemaining / (1000 * 60 * 60 * 24)),
        hours: Math.floor((msRemaining / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((msRemaining / (1000 * 60)) % 60),
        seconds: Math.floor((msRemaining / 1000) % 60),
      };
    }
    // Fall back to hardcoded phase timing
    return getCurrentPhaseTimeRemaining(currentTime);
  }, [isVipPhase, onChainTiming, currentTime]);

  const timeRemainingFormatted = useMemo(() => {
    const { days, hours, minutes, seconds } = timeRemaining;
    if (days > 0) return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
    if (minutes > 0) return `${minutes}m ${seconds}s`;
    return `${seconds}s`;
  }, [timeRemaining]);

  const phaseProgress = useMemo(() => {
    if (!currentPhase.isActive) return 0;
    const phaseDuration = currentPhase.endTime - currentPhase.startTime;
    const phaseElapsed = currentTime - currentPhase.startTime;
    return Math.min(100, Math.max(0, (phaseElapsed / phaseDuration) * 100));
  }, [currentPhase, currentTime]);

  const refresh = useCallback(() => {
    setCurrentTime(Date.now());
    fetchOnChainPresaleTiming().then(setOnChainTiming).catch(console.error);
  }, []);

  const hasStarted = currentTime >= PRESALE_PHASES.PRESALE_START;
  const hasEnded = currentTime >= PRESALE_PHASES.PRESALE_END;

  return {
    currentPhase,
    phaseName: currentPhase.phase,
    phaseNumber: currentPhase.phaseNumber,
    currentPrice: currentPhase.price,
    timeRemaining,
    timeRemainingFormatted,
    isActive: currentPhase.isActive,
    hasStarted,
    hasEnded,
    isVipPhase,
    currentTime,
    phaseStartTime: currentPhase.startTime,
    phaseEndTime: currentPhase.endTime,
    presaleEndTime: PRESALE_PHASES.PRESALE_END,
    phaseProgress,
    refresh,
    onChainTiming,
  };
}

export default usePresaleTiming;
