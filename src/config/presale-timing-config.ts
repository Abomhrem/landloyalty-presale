// ============================================================================
// PRESALE TIMING CONFIGURATION - SINGLE SOURCE OF TRUTH
// ============================================================================
// This is the ONLY place where presale times should be defined
// All other files must import from here
// ============================================================================

/**
 * PRESALE TIMELINE CONFIGURATION
 * 
 * IMPORTANT: These dates must match your smart contract deployment
 * Update these values when you redeploy or want to change timing
 */

// ============================================================================
// MAIN CONFIGURATION
// ============================================================================
export const PRESALE_TIMING = {
  // VIP Phase - Starts when smart contract is deployed
  VIP_START: new Date('2026-01-29T00:00:00Z').getTime(), // Jan 29, 2026
  VIP_DURATION_MS: 2 * 24 * 60 * 60 * 1000, // 2 days
  
  // Regular Phases
  PHASE_1_DURATION_MS: 14 * 24 * 60 * 60 * 1000, // 14 days
  PHASE_2_DURATION_MS: 14 * 24 * 60 * 60 * 1000, // 14 days
  PHASE_3_DURATION_MS: 14 * 24 * 60 * 60 * 1000, // 14 days
} as const;

// ============================================================================
// CALCULATED TIMESTAMPS (Auto-computed from main config)
// ============================================================================
export const PRESALE_PHASES = {
  // VIP Phase
  VIP_START: PRESALE_TIMING.VIP_START,
  VIP_END: PRESALE_TIMING.VIP_START + PRESALE_TIMING.VIP_DURATION_MS,
  
  // Phase 1
  PHASE_1_START: PRESALE_TIMING.VIP_START + PRESALE_TIMING.VIP_DURATION_MS,
  PHASE_1_END: PRESALE_TIMING.VIP_START + PRESALE_TIMING.VIP_DURATION_MS + PRESALE_TIMING.PHASE_1_DURATION_MS,
  
  // Phase 2
  PHASE_2_START: PRESALE_TIMING.VIP_START + PRESALE_TIMING.VIP_DURATION_MS + PRESALE_TIMING.PHASE_1_DURATION_MS,
  PHASE_2_END: PRESALE_TIMING.VIP_START + PRESALE_TIMING.VIP_DURATION_MS + PRESALE_TIMING.PHASE_1_DURATION_MS + PRESALE_TIMING.PHASE_2_DURATION_MS,
  
  // Phase 3
  PHASE_3_START: PRESALE_TIMING.VIP_START + PRESALE_TIMING.VIP_DURATION_MS + PRESALE_TIMING.PHASE_1_DURATION_MS + PRESALE_TIMING.PHASE_2_DURATION_MS,
  PHASE_3_END: PRESALE_TIMING.VIP_START + PRESALE_TIMING.VIP_DURATION_MS + PRESALE_TIMING.PHASE_1_DURATION_MS + PRESALE_TIMING.PHASE_2_DURATION_MS + PRESALE_TIMING.PHASE_3_DURATION_MS,
  
  // Overall presale
  PRESALE_START: PRESALE_TIMING.VIP_START,
  PRESALE_END: PRESALE_TIMING.VIP_START + PRESALE_TIMING.VIP_DURATION_MS + PRESALE_TIMING.PHASE_1_DURATION_MS + PRESALE_TIMING.PHASE_2_DURATION_MS + PRESALE_TIMING.PHASE_3_DURATION_MS,
} as const;

// ============================================================================
// PHASE PRICES (USD)
// ============================================================================
export const PHASE_PRICES = {
  VIP: 0.001,
  PHASE_1: 0.004,
  PHASE_2: 0.005,
  PHASE_3: 0.006,
} as const;

// ============================================================================
// PHASE ALLOCATIONS (Tokens)
// ============================================================================
export const PHASE_ALLOCATIONS = {
  VIP: 500_000_000,
  PHASE_1: 1_000_000_000,
  PHASE_2: 1_500_000_000,
  PHASE_3: 1_500_000_000,
} as const;

// ============================================================================
// CURRENT PHASE DETECTION
// ============================================================================
export type PresalePhase = 'NOT_STARTED' | 'VIP' | 'PHASE_1' | 'PHASE_2' | 'PHASE_3' | 'ENDED';

export interface PhaseInfo {
  phase: PresalePhase;
  phaseNumber: number; // 0 = not started, 1-4 = phases, 5 = ended
  price: number;
  allocation: number;
  startTime: number;
  endTime: number;
  isActive: boolean;
  ended: boolean;
}

/**
 * Get current presale phase information
 */
export function getCurrentPhase(now: number = Date.now()): PhaseInfo {
  // Not started yet
  if (now < PRESALE_PHASES.VIP_START) {
    return {
      phase: 'NOT_STARTED',
      phaseNumber: 0,
      price: 0,
      allocation: 0,
      startTime: PRESALE_PHASES.VIP_START,
      endTime: PRESALE_PHASES.VIP_END,
      isActive: false,
      ended: false,
    };
  }
  
  // VIP Phase
  if (now >= PRESALE_PHASES.VIP_START && now < PRESALE_PHASES.VIP_END) {
    return {
      phase: 'VIP',
      phaseNumber: 1,
      price: PHASE_PRICES.VIP,
      allocation: PHASE_ALLOCATIONS.VIP,
      startTime: PRESALE_PHASES.VIP_START,
      endTime: PRESALE_PHASES.VIP_END,
      isActive: true,
      ended: false,
    };
  }
  
  // Phase 1
  if (now >= PRESALE_PHASES.PHASE_1_START && now < PRESALE_PHASES.PHASE_1_END) {
    return {
      phase: 'PHASE_1',
      phaseNumber: 2,
      price: PHASE_PRICES.PHASE_1,
      allocation: PHASE_ALLOCATIONS.PHASE_1,
      startTime: PRESALE_PHASES.PHASE_1_START,
      endTime: PRESALE_PHASES.PHASE_1_END,
      isActive: true,
      ended: false,
    };
  }
  
  // Phase 2
  if (now >= PRESALE_PHASES.PHASE_2_START && now < PRESALE_PHASES.PHASE_2_END) {
    return {
      phase: 'PHASE_2',
      phaseNumber: 3,
      price: PHASE_PRICES.PHASE_2,
      allocation: PHASE_ALLOCATIONS.PHASE_2,
      startTime: PRESALE_PHASES.PHASE_2_START,
      endTime: PRESALE_PHASES.PHASE_2_END,
      isActive: true,
      ended: false,
    };
  }
  
  // Phase 3
  if (now >= PRESALE_PHASES.PHASE_3_START && now < PRESALE_PHASES.PHASE_3_END) {
    return {
      phase: 'PHASE_3',
      phaseNumber: 4,
      price: PHASE_PRICES.PHASE_3,
      allocation: PHASE_ALLOCATIONS.PHASE_3,
      startTime: PRESALE_PHASES.PHASE_3_START,
      endTime: PRESALE_PHASES.PHASE_3_END,
      isActive: true,
      ended: false,
    };
  }
  
  // Presale ended
  return {
    phase: 'ENDED',
    phaseNumber: 5,
    price: 0,
    allocation: 0,
    startTime: PRESALE_PHASES.PRESALE_START,
    endTime: PRESALE_PHASES.PRESALE_END,
    isActive: false,
    ended: true,
  };
}

// ============================================================================
// TIME REMAINING HELPERS
// ============================================================================

export interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number; // Total milliseconds
}

/**
 * Calculate time remaining until a specific timestamp
 */
export function getTimeRemaining(targetTime: number, now: number = Date.now()): TimeRemaining {
  const total = Math.max(0, targetTime - now);
  
  return {
    total,
    days: Math.floor(total / (1000 * 60 * 60 * 24)),
    hours: Math.floor((total / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((total / (1000 * 60)) % 60),
    seconds: Math.floor((total / 1000) % 60),
  };
}

/**
 * Get time remaining in current phase
 */
export function getCurrentPhaseTimeRemaining(now: number = Date.now()): TimeRemaining {
  const currentPhase = getCurrentPhase(now);
  return getTimeRemaining(currentPhase.endTime, now);
}

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

/**
 * Validate that presale configuration is correct
 */
export function validatePresaleConfig(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Check that phases are in order
  if (PRESALE_PHASES.VIP_START >= PRESALE_PHASES.VIP_END) {
    errors.push('VIP phase: start time must be before end time');
  }
  
  if (PRESALE_PHASES.PHASE_1_START !== PRESALE_PHASES.VIP_END) {
    errors.push('Phase 1 must start when VIP ends');
  }
  
  if (PRESALE_PHASES.PHASE_2_START !== PRESALE_PHASES.PHASE_1_END) {
    errors.push('Phase 2 must start when Phase 1 ends');
  }
  
  if (PRESALE_PHASES.PHASE_3_START !== PRESALE_PHASES.PHASE_2_END) {
    errors.push('Phase 3 must start when Phase 2 ends');
  }
  
  // Check that prices are ascending
  if (PHASE_PRICES.VIP >= PHASE_PRICES.PHASE_1) {
    errors.push('Phase 1 price must be higher than VIP price');
  }
  
  if (PHASE_PRICES.PHASE_1 >= PHASE_PRICES.PHASE_2) {
    errors.push('Phase 2 price must be higher than Phase 1 price');
  }
  
  if (PHASE_PRICES.PHASE_2 >= PHASE_PRICES.PHASE_3) {
    errors.push('Phase 3 price must be higher than Phase 2 price');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

// ============================================================================
// DEBUGGING & LOGGING
// ============================================================================

/**
 * Get human-readable presale info for debugging
 */
export function getPresaleDebugInfo() {
  const now = Date.now();
  const currentPhase = getCurrentPhase(now);
  const timeRemaining = getCurrentPhaseTimeRemaining(now);
  const validation = validatePresaleConfig();
  
  return {
    currentTime: new Date(now).toISOString(),
    currentPhase: currentPhase.phase,
    phaseNumber: currentPhase.phaseNumber,
    currentPrice: currentPhase.price,
    timeRemainingInPhase: `${timeRemaining.days}d ${timeRemaining.hours}h ${timeRemaining.minutes}m ${timeRemaining.seconds}s`,
    phases: {
      vip: {
        start: new Date(PRESALE_PHASES.VIP_START).toISOString(),
        end: new Date(PRESALE_PHASES.VIP_END).toISOString(),
        price: PHASE_PRICES.VIP,
      },
      phase1: {
        start: new Date(PRESALE_PHASES.PHASE_1_START).toISOString(),
        end: new Date(PRESALE_PHASES.PHASE_1_END).toISOString(),
        price: PHASE_PRICES.PHASE_1,
      },
      phase2: {
        start: new Date(PRESALE_PHASES.PHASE_2_START).toISOString(),
        end: new Date(PRESALE_PHASES.PHASE_2_END).toISOString(),
        price: PHASE_PRICES.PHASE_2,
      },
      phase3: {
        start: new Date(PRESALE_PHASES.PHASE_3_START).toISOString(),
        end: new Date(PRESALE_PHASES.PHASE_3_END).toISOString(),
        price: PHASE_PRICES.PHASE_3,
      },
    },
    validation,
  };
}

// Log configuration on module load (only in browser)
if (typeof window !== 'undefined') {
  const debugInfo = getPresaleDebugInfo();
  console.log('🚀 Presale Timing Loaded:', debugInfo);
  
  if (!debugInfo.validation.valid) {
    console.error('❌ PRESALE CONFIG ERRORS:', debugInfo.validation.errors);
  }
}
