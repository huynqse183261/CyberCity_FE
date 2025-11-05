import axiosInstance from '../api/axiosInstance';

export interface UserPaymentDto {
  uid: string;
  order_id: string;
  amount: number;
  currency: string;
  payment_method: string;
  status: 'pending' | 'paid' | 'failed' | 'completed';
  description?: string;
  transaction_id?: string;
  created_at: string;
  completed_at?: string | null;
}

class PaymentsService {
  private readonly baseUrl = '/api/payments';

  async getMyPayments(): Promise<UserPaymentDto[]> {
    const res = await axiosInstance.get(`${this.baseUrl}/my`);
    const items = res.data?.data || [];
    // Chuẩn hóa key về định dạng FE đang dùng trong trang lịch sử
    return items.map((p: any) => ({
      uid: p.uid,
      order_id: p.orderId,
      amount: p.amount,
      currency: p.currency,
      payment_method: p.paymentMethod,
      status: (p.status === 'paid' ? 'completed' : p.status) as UserPaymentDto['status'],
      description: p.description,
      transaction_id: p.transactionId,
      created_at: p.createdAt,
      completed_at: p.completedAt ?? null,
    }));
  }
}

export const paymentsService = new PaymentsService();
export default paymentsService;


