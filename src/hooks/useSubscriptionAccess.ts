import { useState, useEffect, useCallback } from 'react';
import subscriptionService, { type SubscriptionAccessResponse } from '../services/subscriptionService';

export interface UseSubscriptionAccessReturn {
  hasSubscription: boolean;
  canViewAllModules: boolean;
  maxFreeModules: number;
  subscriptionInfo: SubscriptionAccessResponse['data']['subscriptionInfo'];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

/**
 * Custom hook để kiểm tra quyền truy cập subscription
 * @returns {UseSubscriptionAccessReturn} Subscription access state và methods
 */
export const useSubscriptionAccess = (): UseSubscriptionAccessReturn => {
  const [hasSubscription, setHasSubscription] = useState<boolean>(false);
  const [canViewAllModules, setCanViewAllModules] = useState<boolean>(false);
  const [maxFreeModules, setMaxFreeModules] = useState<number>(2);
  const [subscriptionInfo, setSubscriptionInfo] = useState<SubscriptionAccessResponse['data']['subscriptionInfo']>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadAccess = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await subscriptionService.checkAccess();
      
      if (response.success && response.data) {
        setHasSubscription(response.data.hasAccess);
        setCanViewAllModules(response.data.canViewAllModules);
        setMaxFreeModules(response.data.maxFreeModules || 2);
        setSubscriptionInfo(response.data.subscriptionInfo);
      } else {
        // API trả về success: true nhưng không có data hoặc success: false
        setHasSubscription(false);
        setCanViewAllModules(false);
        setMaxFreeModules(2);
        setSubscriptionInfo(null);
        if (response.message) {
          setError(response.message);
        }
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message 
        || err?.message 
        || 'Không thể kiểm tra quyền truy cập. Vui lòng thử lại.';
      setError(errorMessage);
      setHasSubscription(false);
      setCanViewAllModules(false);
      setMaxFreeModules(2);
      setSubscriptionInfo(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAccess();
  }, [loadAccess]);

  const refresh = useCallback(async () => {
    await loadAccess();
  }, [loadAccess]);

  return {
    hasSubscription,
    canViewAllModules,
    maxFreeModules,
    subscriptionInfo,
    loading,
    error,
    refresh
  };
};

