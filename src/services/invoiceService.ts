import axiosInstance from '../api/axiosInstance';

// ==========================================
// INVOICE TYPES based on existing DB schema
// ==========================================

export interface InvoiceDto {
  uid: string;
  invoiceNumber?: string;
  orderUid?: string;
  customerUid: string;
  orgUid?: string;
  baseAmount: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  issueDate: string;
  dueDate: string;
  paymentMethod?: string;
  transactionCode?: string;
  paidAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
  
  // Joined data
  customer?: {
    uid: string;
    fullName: string;
    email: string;
    username: string;
    role: string;
  };
  organization?: {
    uid: string;
    orgName: string;
    orgType: string;
    contactEmail?: string;
  };
  order?: {
    uid: string;
    userUid: string;
    orgUid?: string;
    planUid: string;
    amount: number;
    paymentStatus: string;
    approvalStatus: string;
    startAt?: string;
    endAt?: string;
  };
  pricingPlan?: {
    uid: string;
    planName: string;
    price: number;
    durationDays: number;
    features: string;
  };
  items?: InvoiceItemDto[];
}

export interface InvoiceItemDto {
  uid: string;
  invoiceUid: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  createdAt: string;
}

export interface CreateInvoiceRequest {
  orderUid: string;
  taxAmount?: number;
  discountAmount?: number;
  dueDate: string;
  notes?: string;
  autoSend?: boolean;
}

export interface CreateManualInvoiceRequest {
  customerUid: string;
  organizationUid?: string;
  planUid?: string;
  baseAmount: number;
  taxAmount?: number;
  discountAmount?: number;
  dueDate: string;
  paymentMethod?: string;
  notes?: string;
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>;
}

export interface UpdateInvoiceRequest {
  taxAmount?: number;
  discountAmount?: number;
  dueDate?: string;
  notes?: string;
  status?: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
}

export interface InvoiceStatsResponse {
  totalInvoices: number;
  draftInvoices: number;
  sentInvoices: number;
  paidInvoices: number;
  overdueInvoices: number;
  cancelledInvoices: number;
  totalRevenue: number;
  paidRevenue: number;
  pendingRevenue: number;
  averageInvoiceValue: number;
  paymentMethodStats: {
    [key: string]: number;
  };
  organizationStats: Array<{
    orgUid: string;
    orgName: string;
    invoiceCount: number;
    totalRevenue: number;
  }>;
  monthlyStats: Array<{
    month: number;
    year: number;
    invoiceCount: number;
    revenue: number;
    paidCount: number;
    overdueCount: number;
  }>;
}

export interface InvoiceSearchParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  paymentStatus?: string;
  dateFrom?: string;
  dateTo?: string;
  orgUid?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface InvoiceListResponse {
  invoices: InvoiceDto[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

export interface OverdueInvoiceDto {
  uid: string;
  invoiceNumber: string;
  customerName: string;
  organizationName?: string;
  totalAmount: number;
  dueDate: string;
  daysOverdue: number;
  status: string;
  customerEmail: string;
  customerPhone?: string;
}

// ==========================================
// INVOICE SERVICE
// ==========================================

class InvoiceService {
  private readonly baseUrl = '/api/v1/invoices';

  /**
   * Get invoices with pagination and filtering
   */
  async getInvoices(params: InvoiceSearchParams = {}): Promise<InvoiceListResponse> {
    const response = await axiosInstance.get(this.baseUrl, { params });
    return response.data.data;
  }

  /**
   * Get invoice by ID with full details
   */
  async getInvoiceById(uid: string): Promise<InvoiceDto> {
    const response = await axiosInstance.get(`${this.baseUrl}/${uid}`);
    return response.data.data;
  }

  /**
   * Create invoice from order
   */
  async createInvoice(invoiceData: CreateInvoiceRequest): Promise<InvoiceDto> {
    const response = await axiosInstance.post(this.baseUrl, invoiceData);
    return response.data.data;
  }

  /**
   * Create manual invoice
   */
  async createManualInvoice(invoiceData: CreateManualInvoiceRequest): Promise<InvoiceDto> {
    const response = await axiosInstance.post(`${this.baseUrl}/manual`, invoiceData);
    return response.data.data;
  }

  /**
   * Update existing invoice
   */
  async updateInvoice(uid: string, invoiceData: UpdateInvoiceRequest): Promise<InvoiceDto> {
    const response = await axiosInstance.put(`${this.baseUrl}/${uid}`, invoiceData);
    return response.data.data;
  }

  /**
   * Update invoice status
   */
  async updateInvoiceStatus(
    uid: string, 
    statusData: {
      status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
      paymentMethod?: string;
      transactionCode?: string;
      paidAt?: string;
      notes?: string;
    }
  ): Promise<InvoiceDto> {
    const response = await axiosInstance.patch(`${this.baseUrl}/${uid}/status`, statusData);
    return response.data.data;
  }

  /**
   * Send invoice
   */
  async sendInvoice(
    uid: string,
    sendData: {
      sendEmail?: boolean;
      emailTemplate?: string;
      customMessage?: string;
      attachments?: string[];
    } = {}
  ): Promise<{
    uid: string;
    invoiceNumber: string;
    status: string;
    sentAt: string;
    emailSent: boolean;
    emailDeliveryStatus: string;
  }> {
    const response = await axiosInstance.post(`${this.baseUrl}/${uid}/send`, sendData);
    return response.data.data;
  }

  /**
   * Delete invoice
   */
  async deleteInvoice(uid: string): Promise<{ uid: string; deletedAt: string }> {
    const response = await axiosInstance.delete(`${this.baseUrl}/${uid}`);
    return response.data.data;
  }

  /**
   * Get invoice statistics
   */
  async getInvoiceStats(params: {
    period?: 'day' | 'week' | 'month' | 'year';
    dateFrom?: string;
    dateTo?: string;
    orgUid?: string;
  } = {}): Promise<InvoiceStatsResponse> {
    const response = await axiosInstance.get(`${this.baseUrl}/stats`, { params });
    return response.data.data;
  }

  /**
   * Generate invoice PDF
   */
  async generateInvoicePDF(uid: string, options: {
    template?: 'standard' | 'premium' | 'minimal';
    download?: boolean;
  } = {}): Promise<{
    pdfUrl: string;
    filename: string;
    fileSize: number;
    expiresAt: string;
  }> {
    const response = await axiosInstance.get(`${this.baseUrl}/${uid}/pdf`, { params: options });
    return response.data.data;
  }

  /**
   * Export invoices
   */
  async exportInvoices(params: {
    format?: 'excel' | 'csv' | 'pdf';
    dateFrom?: string;
    dateTo?: string;
    status?: string;
    orgUid?: string;
  } = {}): Promise<{
    downloadUrl: string;
    filename: string;
    fileSize: number;
    recordCount: number;
    expiresAt: string;
  }> {
    const response = await axiosInstance.get(`${this.baseUrl}/export`, { params });
    return response.data.data;
  }

  /**
   * Get overdue invoices
   */
  async getOverdueInvoices(params: {
    daysOverdue?: number;
    orgUid?: string;
    limit?: number;
  } = {}): Promise<{
    overdueInvoices: OverdueInvoiceDto[];
    totalOverdueAmount: number;
    totalOverdueCount: number;
    averageDaysOverdue: number;
  }> {
    const response = await axiosInstance.get(`${this.baseUrl}/overdue`, { params });
    return response.data.data;
  }

  /**
   * Search invoices
   */
  async searchInvoices(query: string, options: {
    fields?: string;
    limit?: number;
  } = {}): Promise<{
    invoices: InvoiceDto[];
    totalResults: number;
    searchTime: number;
  }> {
    const params = { q: query, ...options };
    const response = await axiosInstance.get(`${this.baseUrl}/search`, { params });
    return response.data.data;
  }

  /**
   * Mark invoice as paid
   */
  async markAsPaid(uid: string, paymentData: {
    paymentMethod: string;
    transactionCode?: string;
    paidAt?: string;
    notes?: string;
  }): Promise<InvoiceDto> {
    return this.updateInvoiceStatus(uid, {
      status: 'paid',
      ...paymentData
    });
  }

  /**
   * Mark invoice as overdue
   */
  async markAsOverdue(uid: string, notes?: string): Promise<InvoiceDto> {
    return this.updateInvoiceStatus(uid, {
      status: 'overdue',
      notes
    });
  }

  /**
   * Cancel invoice
   */
  async cancelInvoice(uid: string, reason: string): Promise<InvoiceDto> {
    return this.updateInvoiceStatus(uid, {
      status: 'cancelled',
      notes: reason
    });
  }

  /**
   * Duplicate invoice
   */
  async duplicateInvoice(uid: string, newData?: {
    customerUid?: string;
    dueDate?: string;
    notes?: string;
  }): Promise<InvoiceDto> {
    const response = await axiosInstance.post(`${this.baseUrl}/${uid}/duplicate`, newData || {});
    return response.data.data;
  }

  /**
   * Get invoice preview
   */
  async getInvoicePreview(uid: string): Promise<{
    previewUrl: string;
    expiresAt: string;
  }> {
    const response = await axiosInstance.get(`${this.baseUrl}/${uid}/preview`);
    return response.data.data;
  }

  /**
   * Send payment reminder
   */
  async sendPaymentReminder(uid: string, reminderData: {
    emailTemplate?: string;
    customMessage?: string;
    reminderType?: 'gentle' | 'firm' | 'final';
  } = {}): Promise<{
    sent: boolean;
    emailDeliveryStatus: string;
    sentAt: string;
  }> {
    const response = await axiosInstance.post(`${this.baseUrl}/${uid}/remind`, reminderData);
    return response.data.data;
  }

  /**
   * Get invoice aging report
   */
  async getAgingReport(params: {
    orgUid?: string;
    periods?: number[];
  } = {}): Promise<{
    current: number;
    days30: number;
    days60: number;
    days90: number;
    over90: number;
    totalAmount: number;
    totalInvoices: number;
  }> {
    const response = await axiosInstance.get(`${this.baseUrl}/aging-report`, { params });
    return response.data.data;
  }
}

// Export singleton instance
export const invoiceService = new InvoiceService();
export default invoiceService;