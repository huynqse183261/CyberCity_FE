import axiosInstance from '../api/axiosInstance';

export interface SubscriptionAccessResponse {
  success: boolean;
  data: {
    hasAccess: boolean;
    canViewAllModules: boolean;
    maxFreeModules: number;
    subscriptionInfo: {
      active: boolean;
      orderUid: string;
      planUid: string;
      planName: string;
      startAt: string;
      endAt: string | null;
      daysRemaining: number | null;
    } | null;
  };
  message?: string;
}

export interface ModuleAccessResponse {
  success: boolean;
  data: {
    canAccess: boolean;
    hasSubscription: boolean;
    moduleIndex: number;
    maxFreeModules: number;
    reason: string | null;
  };
}

const subscriptionService = {
  /**
   * Kiểm tra quyền truy cập subscription của user
   * GET /api/student/subscription/access
   * 
   * @returns {Promise<SubscriptionAccessResponse>} Subscription access information
   * @throws {Error} If API call fails
   */
  async checkAccess(): Promise<SubscriptionAccessResponse> {
    try {
      const res = await axiosInstance.get('/api/student/subscription/access');
      return res.data;
    } catch (error: any) {
      // Re-throw để component có thể handle
      throw error;
    }
  },

  /**
   * Kiểm tra quyền truy cập module cụ thể
   * GET /api/student/courses/{courseUid}/modules/{moduleIndex}/access
   * 
   * @param {string} courseUid - Course unique identifier
   * @param {number} moduleIndex - Module index (0-based)
   * @returns {Promise<ModuleAccessResponse>} Module access information
   * @throws {Error} If API call fails
   */
  async checkModuleAccess(courseUid: string, moduleIndex: number): Promise<ModuleAccessResponse> {
    try {
      // Validate inputs
      if (!courseUid || typeof courseUid !== 'string') {
        throw new Error('Invalid courseUid');
      }
      if (typeof moduleIndex !== 'number' || moduleIndex < 0) {
        throw new Error('Invalid moduleIndex');
      }

      const res = await axiosInstance.get(`/api/student/courses/${courseUid}/modules/${moduleIndex}/access`);
      return res.data;
    } catch (error: any) {
      // Re-throw để component có thể handle
      throw error;
    }
  }
};

export default subscriptionService;

