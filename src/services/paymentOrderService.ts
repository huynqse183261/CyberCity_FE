import axiosInstance from '../api/axiosInstance';

export interface PaymentOrder {
  uid: string;
  userName: string;
  userEmail: string;
  planName: string;
  amount: number;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'completed' | 'cancelled';
  approvalStatus: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  paidAt?: string;
  paymentCount?: number;
}

export interface PaymentInvoiceDetail {
  paymentUid: string;
  invoiceNumber: string;
  invoiceDate: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  orderUid: string;
  planName: string;
  durationDays: number;
  serviceStartDate: string;
  serviceEndDate: string;
  paymentMethod: string;
  transactionCode: string;
  amount: number;
  currency: string;
  status: 'pending' | 'paid' | 'failed' | 'completed' | 'cancelled';
  paidAt?: string;
  organizationName?: string | null;
  organizationCode?: string;
}

class PaymentOrderService {
  private readonly base = '/api/payment';

  async getAllOrdersAdmin(): Promise<{ data: PaymentOrder[]; total: number }> {
    const res = await axiosInstance.get(`${this.base}/orders`);
    const raw = res.data;
    if (raw?.success && Array.isArray(raw.data)) {
      return { data: raw.data as PaymentOrder[], total: Number(raw.total ?? raw.data.length) };
    }
    return { data: [], total: 0 };
  }

  async getOrdersByUser(userUid: string): Promise<{ data: PaymentOrder[]; total: number }> {
    const res = await axiosInstance.get(`${this.base}/orders/user/${encodeURIComponent(userUid)}`);
    const raw = res.data;
    if (raw?.success && Array.isArray(raw.data)) {
      return { data: raw.data as PaymentOrder[], total: Number(raw.total ?? raw.data.length) };
    }
    return { data: [], total: 0 };
  }

  async getOrderDetail(orderUid: string): Promise<PaymentOrder | null> {
    const res = await axiosInstance.get(`${this.base}/order/${encodeURIComponent(orderUid)}`);
    const raw = res.data;
    if (raw?.success && raw.data) {
      return raw.data as PaymentOrder;
    }
    return null;
  }

  async getInvoiceDetail(paymentUid: string): Promise<PaymentInvoiceDetail | null> {
    const res = await axiosInstance.get(`${this.base}/invoice/${encodeURIComponent(paymentUid)}`);
    const raw = res.data;
    if (raw?.success && raw.data) {
      return raw.data as PaymentInvoiceDetail;
    }
    return null;
  }

  async getPaymentHistory(userUid: string): Promise<any[]> {
    const res = await axiosInstance.get(`${this.base}/history/${encodeURIComponent(userUid)}`);
    const raw = res.data;
    if (raw?.success && Array.isArray(raw.data)) {
      return raw.data as any[];
    }
    return [];
  }
}

export default new PaymentOrderService();


