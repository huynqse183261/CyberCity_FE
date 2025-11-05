import axiosInstance from '../api/axiosInstance';

export type CreatePaymentLinkRequest = {
  userUid: string;
  planUid: string;
  returnUrl: string;
  cancelUrl: string;
};

export type CreatePaymentLinkResponse = {
  success: boolean;
  message?: string;
  data?: {
    uid: string; // paymentUid
    checkoutUrl: string;
    qrCode: string;
    orderCode: number;
    status: 'PENDING' | 'PAID' | 'CANCELLED';
    amount: number;
    description?: string;
    userName?: string;
    planName?: string;
  };
};

export type PaymentStatusResponse = {
  success: boolean;
  data?: {
    orderCode: number;
    amount: number;
    amountPaid: string;
    amountRemaining: number;
    status: 'PENDING' | 'PAID' | 'CANCELLED';
    createdAt: string;
    canceledAt?: string | null;
    cancellationReason?: string | null;
  };
};

export type PaymentInvoiceResponse = {
  success: boolean;
  data?: any;
};

const paymentService = {
  async createPaymentLink(payload: CreatePaymentLinkRequest): Promise<CreatePaymentLinkResponse> {
    const res = await axiosInstance.post('/api/payment/create-payment-link', payload);
    return res.data;
  },

  async getPaymentStatus(orderCode: number): Promise<PaymentStatusResponse> {
    const res = await axiosInstance.get(`/api/payment/status/${orderCode}`);
    return res.data;
  },

  async getInvoice(paymentUid: string): Promise<PaymentInvoiceResponse> {
    const res = await axiosInstance.get(`/api/payment/invoice/${paymentUid}`);
    return res.data;
  },

  async getPaymentHistory(userUid: string): Promise<{ success: boolean; data?: any[] }> {
    const res = await axiosInstance.get(`/api/payment/history/${userUid}`);
    return res.data;
  },

  async cancelPayment(orderCode: number, reason?: string): Promise<{ success: boolean; message?: string }> {
    const params = reason ? `?reason=${encodeURIComponent(reason)}` : '';
    const res = await axiosInstance.post(`/api/payment/cancel/${orderCode}${params}`);
    return res.data;
  }
};

export default paymentService;


