import axiosInstance from '../api/axiosInstance';
import type { PricingPlanDTO, PricingListDTO } from '../models/PricingTypes';

class PricingService {
  private readonly baseUrl = '/api/pricing-plans';

  async getAllPlans(descending = true): Promise<PricingListDTO | PricingPlanDTO[]> {
    try {
      const params = descending ? '?descending=true' : '';
      const response = await axiosInstance.get(`${this.baseUrl}${params}`);
      // Backend may return an array or a paged object; return as-is
      return response.data;
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
