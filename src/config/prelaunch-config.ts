// ============================================================================
// PRE-LAUNCH CONFIGURATION
// ============================================================================
// Set the launch date for VIP presale (5 weeks from now or specific date)

// Option 1: Set specific launch date
export const VIP_LAUNCH_DATE = new Date('2025-03-11T00:00:00Z'); // March 11, 2025

// Option 2: Dynamic 5 weeks from deployment (uncomment if preferred)
// export const VIP_LAUNCH_DATE = new Date(Date.now() + 5 * 7 * 24 * 60 * 60 * 1000);

// Check if we're in pre-launch mode
export const isPreLaunchMode = (): boolean => {
  return new Date() < VIP_LAUNCH_DATE;
};

// Get time remaining until launch
export const getTimeUntilLaunch = (): number => {
  return Math.max(0, VIP_LAUNCH_DATE.getTime() - Date.now());
};

// Pre-launch messages
export const PRELAUNCH_MESSAGES = {
  en: {
    title: 'VIP Presale Launching Soon',
    subtitle: 'The first Arab real estate investment token',
    description: 'Get ready for exclusive VIP access with 50% bonus tokens at the lowest price!',
    walletConnected: 'Presale has not started yet. Subscribe to get notified!',
    subscribe: 'Notify Me on Launch',
    subscribed: "You're on the list! We'll notify you when presale starts.",
  },
  ar: {
    title: 'البيع المسبق VIP قريباً',
    subtitle: 'أول عملة استثمار عقاري عربية',
    description: 'استعد للوصول الحصري VIP مع مكافأة 50% عملات إضافية بأقل سعر!',
    walletConnected: 'البيع المسبق لم يبدأ بعد. سجّل للحصول على إشعار!',
    subscribe: 'أبلغني عند الإطلاق',
    subscribed: 'أنت في القائمة! سنخبرك عند بدء البيع المسبق.',
  }
};
