// Interface cho item trong hóa đơn
export interface InvoiceItem {
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

// Interface cho hóa đơn
export interface Invoice {
  key: string;
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  issueDate: string;
  dueDate: string;
  paymentMethod?: string;
  notes?: string;
}

// Interface cho thống kê hóa đơn
export interface InvoiceStats {
  totalInvoices: number;
  totalRevenue: number;
  pendingAmount: number;
  overdueCount: number;
  paidCount: number;
}

// Interface cho form tạo/sửa hóa đơn
export interface InvoiceFormData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  status: Invoice['status'];
  issueDate: string;
  dueDate: string;
  subtotal: number;
  tax?: number;
  discount?: number;
  paymentMethod?: string;
  notes?: string;
  items?: InvoiceItem[];
}

// Interface cho filter hóa đơn
export interface InvoiceFilter {
  searchText: string;
  status: string;
  dateRange?: [string, string];
  amountRange?: [number, number];
}

// Interface cho thanh toán hóa đơn
export interface InvoicePayment {
  invoiceId: string;
  amount: number;
  paymentMethod: string;
  paymentDate: string;
  transactionId?: string;
  notes?: string;
}
