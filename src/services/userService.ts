import BaseApiService, { API_ENDPOINTS } from './BaseApiService';
import axiosInstance from '../api/axiosInstance';

class UserService extends BaseApiService {
  constructor() {
    super(API_ENDPOINTS.USERS);
  }

  // Override to return raw data shape from backend when necessary
  async getUsers(params?: { pageNumber?: number; pageSize?: number; descending?: boolean; }): Promise<any> {
    const resp = await axiosInstance.get(this.endpoint, { params });
    return resp.data;
  }

  async getUserById(id: string) {
    const resp = await axiosInstance.get(`${this.endpoint}/${id}`);
    return resp.data;
  }

  async createUser(data: any) {
    const resp = await axiosInstance.post(this.endpoint, data);
    return resp.data;
  }

  async updateUser(id: string, data: any) {
    const resp = await axiosInstance.put(`${this.endpoint}/${id}`, data);
    return resp.data;
  }

  async deleteUser(id: string) {
    const resp = await axiosInstance.delete(`${this.endpoint}/${id}`);
    return resp.data;
  }

  // Update user role
  async updateUserRole(id: string, role: string) {
    const resp = await axiosInstance.put(`${this.endpoint}/${id}/role`, { role });
    return resp.data;
  }

  // Update user status (Active/Inactive)
  async updateUserStatus(id: string, status: 'Active' | 'Inactive') {
    const resp = await axiosInstance.put(`${this.endpoint}/${id}/status`, { status });
    return resp.data;
  }

  // Update user avatar
  async updateUserAvatar(id: string, avatar: string) {
    const resp = await axiosInstance.put(`${this.endpoint}/${id}/avatar`, { avatar });
    return resp.data;
  }
}

export default new UserService();
