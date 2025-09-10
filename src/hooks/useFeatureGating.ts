import { useSubscription } from './useSubscription';

export interface FeatureAccess {
  // Plan limits
  canCreateMoreChecklists: boolean;
  maxChecklists: number;
  currentChecklistCount: number;
  hasReachedChecklistLimit: boolean;
  
  // Monthly submission limits
  canAcceptMoreSubmissions: boolean;
  maxMonthlySubmissions: number;
  currentMonthlySubmissions: number;
  hasReachedSubmissionLimit: boolean;
  
  // Feature access
  canUsePasswordProtection: boolean;
  canCustomizeFonts: boolean;
  canSetBusinessName: boolean;
  canCustomizeCompletionPages: boolean;
  
  // Plan info
  isPro: boolean;
  isTrialing: boolean;
  planName: string;
}

export function useFeatureGating(currentChecklistCount: number = 0, currentMonthlySubmissions: number = 0): FeatureAccess {
  const { subscription, getAccessStatus } = useSubscription();
  const accessStatus = getAccessStatus();

  // During trial: Full access (Pro-level features)
  if (accessStatus.isTrialing) {
    return {
      canCreateMoreChecklists: true,
      maxChecklists: -1, // Unlimited during trial
      currentChecklistCount,
      hasReachedChecklistLimit: false,
      
      canAcceptMoreSubmissions: true,
      maxMonthlySubmissions: -1, // Unlimited during trial
      currentMonthlySubmissions,
      hasReachedSubmissionLimit: false,
      
      canUsePasswordProtection: true,
      canCustomizeFonts: true,
      canSetBusinessName: true,
      canCustomizeCompletionPages: true,
      
      isPro: true, // Treat as Pro during trial
      isTrialing: true,
      planName: 'Trial (Pro Features)',
    };
  }

  // After trial: Check actual plan
  const isPro = accessStatus.isPro;

  if (isPro) {
    // Pro plan: Full access
    return {
      canCreateMoreChecklists: true,
      maxChecklists: -1, // Unlimited
      currentChecklistCount,
      hasReachedChecklistLimit: false,
      
      canAcceptMoreSubmissions: true,
      maxMonthlySubmissions: -1, // Unlimited
      currentMonthlySubmissions,
      hasReachedSubmissionLimit: false,
      
      canUsePasswordProtection: true,
      canCustomizeFonts: true,
      canSetBusinessName: true,
      canCustomizeCompletionPages: true,
      
      isPro: true,
      isTrialing: false,
      planName: 'Pro',
    };
  } else {
    // Standard plan: Limited access
    const STANDARD_LIMITS = {
      MAX_CHECKLISTS: 3,
      MAX_MONTHLY_SUBMISSIONS: 50,
    };

    return {
      canCreateMoreChecklists: currentChecklistCount < STANDARD_LIMITS.MAX_CHECKLISTS,
      maxChecklists: STANDARD_LIMITS.MAX_CHECKLISTS,
      currentChecklistCount,
      hasReachedChecklistLimit: currentChecklistCount >= STANDARD_LIMITS.MAX_CHECKLISTS,
      
      canAcceptMoreSubmissions: currentMonthlySubmissions < STANDARD_LIMITS.MAX_MONTHLY_SUBMISSIONS,
      maxMonthlySubmissions: STANDARD_LIMITS.MAX_MONTHLY_SUBMISSIONS,
      currentMonthlySubmissions,
      hasReachedSubmissionLimit: currentMonthlySubmissions >= STANDARD_LIMITS.MAX_MONTHLY_SUBMISSIONS,
      
      canUsePasswordProtection: false,
      canCustomizeFonts: false,
      canSetBusinessName: false,
      canCustomizeCompletionPages: false,
      
      isPro: false,
      isTrialing: false,
      planName: 'Standard',
    };
  }
}