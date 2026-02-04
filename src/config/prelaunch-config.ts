// ============================================================================
// PRE-LAUNCH CONFIGURATION
// ============================================================================

// VIP Presale Launch Date - 5 weeks from Feb 4, 2026
// Change this date when you're ready to launch
export const VIP_LAUNCH_DATE = new Date('2026-03-11T12:00:00Z'); // March 11, 2026 at 12:00 UTC

// Check if we're in pre-launch mode
export const isPreLaunchMode = (): boolean => {
  return new Date() < VIP_LAUNCH_DATE;
};

// Get time remaining until launch (in milliseconds)
export const getTimeUntilLaunch = (): number => {
  return Math.max(0, VIP_LAUNCH_DATE.getTime() - Date.now());
};

// Pre-launch messages in both languages
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
