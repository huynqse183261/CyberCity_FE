import axiosInstance from '../api/axiosInstance';
import type { PricingPlanDTO, PricingListDTO } from '../models/PricingTypes';

class PricingService {
  private readonly baseUrl = '/api/pricing-plans';
  private readonly studentBaseUrl = '/api/student/pricing-plans';

  async getAllPlans(descending = true, useStudentEndpoint = false): Promise<PricingListDTO | PricingPlanDTO[]> {
    try {
      const url = useStudentEndpoint ? this.studentBaseUrl : this.baseUrl;
      const params = descending ? '?descending=true' : '';
      const response = await axiosInstance.get(`${url}${params}`);
      
      // Xử lý response có thể là { data: [...] } hoặc { items: [...] } hoặc array trực tiếp
      const responseData = response.data;
      if (Array.isArray(responseData)) {
        return responseData;
      }
      if (responseData?.data && Array.isArray(responseData.data)) {
        return responseData.data;
      }
      if (responseData?.items && Array.isArray(responseData.items)) {
        return responseData.items;
      }
      
      console.warn('Unexpected response format:', responseData);
      return [];
    } catch (error: any) {
      console.error('Error fetching pricing plans:', error);
      throw error;
    }
  }

  async createPlan(data: Partial<PricingPlanDTO>) {
    try {
      const response = await axiosInstance.post(this.baseUrl, data);
      return response.data;
    } catch (error: any) {
      console.error('Error creating pricing plan:', error);
      throw error;
    }
  }

  async updatePlan(id: string, data: Partial<PricingPlanDTO>) {
    try {
      const response = await axiosInstance.put(`${this.baseUrl}/${id}`, data);
      return response.data;
    } catch (error: any) {
      console.error('Error updating pricing plan:', error);
      throw error;
    }
  }

  async deletePlan(id: string) {
    try {
      const response = await axiosInstance.delete(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Error deleting pricing plan:', error);
      throw error;
    }
  }
}

export default new PricingService();
