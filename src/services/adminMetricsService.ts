import axiosInstance from '../api/axiosInstance';

class AdminMetricsService {
  async getTotalRevenue(): Promise<number> {
    const res = await axiosInstance.get('/api/admin/total-revenue');
    const raw = res.data;
    if (typeof raw === 'number') return raw;
    if (raw?.data && typeof raw.data === 'number') return raw.data;
    if (raw?.totalRevenue && typeof raw.totalRevenue === 'number') return raw.totalRevenue;
    return 0;
  }

  async getTotalOrders(): Promise<number> {
    const res = await axiosInstance.get('/api/admin/total-orders');
    const raw = res.data;
    if (typeof raw === 'number') return raw;
    if (raw?.data && typeof raw.data === 'number') return raw.data;
    if (raw?.totalOrders && typeof raw.totalOrders === 'number') return raw.totalOrders;
    return 0;
  }
}

export default new AdminMetricsService();


