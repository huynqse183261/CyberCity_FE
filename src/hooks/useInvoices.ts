import { useState, useCallback, useEffect } from 'react';
import { message } from 'antd';
import invoiceService, { 
  type InvoiceDto, 
  type InvoiceListResponse, 
  type InvoiceStatsResponse,
  type InvoiceSearchParams,
  type CreateInvoiceRequest,
  type CreateManualInvoiceRequest,
  type UpdateInvoiceRequest,
  type OverdueInvoiceDto
} from '../services/invoiceService';

// ==========================================
// INVOICES HOOK
// ==========================================

interface UseInvoicesReturn {
  // State
  loading: boolean;
  invoices: InvoiceDto[];
  selectedInvoice: InvoiceDto | null;
  stats: InvoiceStatsResponse | null;
  overdueInvoices: OverdueInvoiceDto[];
  
  // Pagination
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNext: boolean;
  hasPrevious: boolean;
  
  // Search & Filter
  searchText: string;
  filters: {
    status: string;
    paymentStatus: string;
    orgUid: string;
    dateFrom: string;
    dateTo: string;
  };
  
  // Actions
  loadInvoices: (params?: InvoiceSearchParams) => Promise<void>;
  loadInvoiceById: (uid: string) => Promise<InvoiceDto | null>;
  createInvoice: (invoiceData: CreateInvoiceRequest) => Promise<InvoiceDto | null>;
  createManualInvoice: (invoiceData: CreateManualInvoiceRequest) => Promise<InvoiceDto | null>;
  updateInvoice: (uid: string, invoiceData: UpdateInvoiceRequest) => Promise<InvoiceDto | null>;
  deleteInvoice: (uid: string) => Promise<boolean>;
  sendInvoice: (uid: string, sendOptions?: any) => Promise<boolean>;
  markAsPaid: (uid: string, paymentData: any) => Promise<InvoiceDto | null>;
  markAsOverdue: (uid: string, notes?: string) => Promise<InvoiceDto | null>;
  cancelInvoice: (uid: string, reason: string) => Promise<InvoiceDto | null>;
  
  // Utilities
  handleSearch: (searchText: string) => void;
  handleFilter: (filterName: string, value: string) => void;
  handlePageChange: (page: number, pageSize?: number) => void;
  resetFilters: () => void;
  refreshInvoices: () => Promise<void>;
  refreshStats: () => Promise<void>;
  
  // Export & Reports
  exportInvoices: (format?: 'excel' | 'csv' | 'pdf') => Promise<string | null>;
  generatePDF: (uid: string, template?: string) => Promise<string | null>;
  loadOverdueInvoices: () => Promise<void>;
  sendPaymentReminder: (uid: string, reminderType?: string) => Promise<boolean>;
  duplicateInvoice: (uid: string, newData?: any) => Promise<InvoiceDto | null>;
}

export const useInvoices = (): UseInvoicesReturn => {
  // State management
  const [loading, setLoading] = useState(false);
  const [invoices, setInvoices] = useState<InvoiceDto[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceDto | null>(null);
  const [stats, setStats] = useState<InvoiceStatsResponse | null>(null);
  const [overdueInvoices, setOverdueInvoices] = useState<OverdueInvoiceDto[]>([]);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  
  // Search & Filter state
  const [searchText, setSearchText] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    paymentStatus: 'all',
    orgUid: '',
    dateFrom: '',
    dateTo: ''
  });

  /**
   * Load invoices with pagination and filtering
   */
  const loadInvoices = useCallback(async (params: InvoiceSearchParams = {}) => {
    try {
      setLoading(true);
      
      const searchParams: InvoiceSearchParams = {
        page: currentPage,
        limit: itemsPerPage,
        search: searchText || undefined,
        ...filters,
        ...params
      };
      
      // Clean up empty filter values
      Object.keys(searchParams).forEach(key => {
        const value = searchParams[key as keyof InvoiceSearchParams];
        if (!value || value === 'all' || value === '') {
          delete searchParams[key as keyof InvoiceSearchParams];
        }
      });

      const response: InvoiceListResponse = await invoiceService.getInvoices(searchParams);
      
      setInvoices(response.invoices);
      setCurrentPage(response.pagination.currentPage);
      setTotalPages(response.pagination.totalPages);
      setTotalItems(response.pagination.totalItems);
      setItemsPerPage(response.pagination.itemsPerPage);
      setHasNext(response.pagination.hasNext);
      setHasPrevious(response.pagination.hasPrevious);
      
    } catch (error: any) {
      console.error('Failed to load invoices:', error);
      message.error('Không thể tải danh sách hóa đơn');
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage, searchText, filters]);

  /**
   * Load invoice by ID
   */
  const loadInvoiceById = useCallback(async (uid: string): Promise<InvoiceDto | null> => {
    try {
      setLoading(true);
      const invoice = await invoiceService.getInvoiceById(uid);
      setSelectedInvoice(invoice);
      return invoice;
    } catch (error: any) {
      console.error('Failed to load invoice:', error);
      message.error('Không thể tải thông tin hóa đơn');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Create invoice from order
   */
  const createInvoice = useCallback(async (invoiceData: CreateInvoiceRequest): Promise<InvoiceDto | null> => {
    try {
      setLoading(true);
      const newInvoice = await invoiceService.createInvoice(invoiceData);
      
      message.success('Tạo hóa đơn thành công!');
      await refreshInvoices();
      return newInvoice;
      
    } catch (error: any) {
      console.error('Failed to create invoice:', error);
      message.error(error.response?.data?.error?.message || 'Không thể tạo hóa đơn');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Create manual invoice
   */
  const createManualInvoice = useCallback(async (invoiceData: CreateManualInvoiceRequest): Promise<InvoiceDto | null> => {
    try {
      setLoading(true);
      const newInvoice = await invoiceService.createManualInvoice(invoiceData);
      
      message.success('Tạo hóa đơn thủ công thành công!');
      await refreshInvoices();
      return newInvoice;
      
    } catch (error: any) {
      console.error('Failed to create manual invoice:', error);
      message.error(error.response?.data?.error?.message || 'Không thể tạo hóa đơn thủ công');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Update existing invoice
   */
  const updateInvoice = useCallback(async (uid: string, invoiceData: UpdateInvoiceRequest): Promise<InvoiceDto | null> => {
    try {
      setLoading(true);
      const updatedInvoice = await invoiceService.updateInvoice(uid, invoiceData);
      
      // Update local state
      setInvoices(prev => prev.map(invoice => 
        invoice.uid === uid ? updatedInvoice : invoice
      ));
      
      if (selectedInvoice?.uid === uid) {
        setSelectedInvoice(updatedInvoice);
      }
      
      message.success('Cập nhật hóa đơn thành công!');
      return updatedInvoice;
      
    } catch (error: any) {
      console.error('Failed to update invoice:', error);
      message.error(error.response?.data?.error?.message || 'Không thể cập nhật hóa đơn');
      return null;
    } finally {
      setLoading(false);
    }
  }, [selectedInvoice]);

  /**
   * Delete invoice
   */
  const deleteInvoice = useCallback(async (uid: string): Promise<boolean> => {
    try {
      setLoading(true);
      await invoiceService.deleteInvoice(uid);
      
      // Remove from local state
      setInvoices(prev => prev.filter(invoice => invoice.uid !== uid));
      
      if (selectedInvoice?.uid === uid) {
        setSelectedInvoice(null);
      }
      
      message.success('Xóa hóa đơn thành công!');
      return true;
      
    } catch (error: any) {
      console.error('Failed to delete invoice:', error);
      message.error(error.response?.data?.error?.message || 'Không thể xóa hóa đơn');
      return false;
    } finally {
      setLoading(false);
    }
  }, [selectedInvoice]);

  /**
   * Send invoice
   */
  const sendInvoice = useCallback(async (uid: string, sendOptions: any = {}): Promise<boolean> => {
    try {
      setLoading(true);
      await invoiceService.sendInvoice(uid, sendOptions);
      
      // Update local state
      setInvoices(prev => prev.map(invoice => 
        invoice.uid === uid ? { ...invoice, status: 'sent' as const } : invoice
      ));
      
      if (selectedInvoice?.uid === uid) {
        setSelectedInvoice(prev => prev ? { ...prev, status: 'sent' as const } : null);
      }
      
      message.success('Gửi hóa đơn thành công!');
      return true;
      
    } catch (error: any) {
      console.error('Failed to send invoice:', error);
      message.error(error.response?.data?.error?.message || 'Không thể gửi hóa đơn');
      return false;
    } finally {
      setLoading(false);
    }
  }, [selectedInvoice]);

  /**
   * Mark invoice as paid
   */
  const markAsPaid = useCallback(async (uid: string, paymentData: any): Promise<InvoiceDto | null> => {
    try {
      setLoading(true);
      const paidInvoice = await invoiceService.markAsPaid(uid, paymentData);
      
      // Update local state
      setInvoices(prev => prev.map(invoice => 
        invoice.uid === uid ? paidInvoice : invoice
      ));
      
      if (selectedInvoice?.uid === uid) {
        setSelectedInvoice(paidInvoice);
      }
      
      message.success('Đánh dấu thanh toán thành công!');
      await refreshStats();
      return paidInvoice;
      
    } catch (error: any) {
      console.error('Failed to mark as paid:', error);
      message.error(error.response?.data?.error?.message || 'Không thể đánh dấu thanh toán');
      return null;
    } finally {
      setLoading(false);
    }
  }, [selectedInvoice]);

  /**
   * Mark invoice as overdue
   */
  const markAsOverdue = useCallback(async (uid: string, notes?: string): Promise<InvoiceDto | null> => {
    try {
      setLoading(true);
      const overdueInvoice = await invoiceService.markAsOverdue(uid, notes);
      
      // Update local state
      setInvoices(prev => prev.map(invoice => 
        invoice.uid === uid ? overdueInvoice : invoice
      ));
      
      if (selectedInvoice?.uid === uid) {
        setSelectedInvoice(overdueInvoice);
      }
      
      message.success('Đánh dấu quá hạn thành công!');
      await refreshStats();
      return overdueInvoice;
      
    } catch (error: any) {
      console.error('Failed to mark as overdue:', error);
      message.error(error.response?.data?.error?.message || 'Không thể đánh dấu quá hạn');
      return null;
    } finally {
      setLoading(false);
    }
  }, [selectedInvoice]);

  /**
   * Cancel invoice
   */
  const cancelInvoice = useCallback(async (uid: string, reason: string): Promise<InvoiceDto | null> => {
    try {
      setLoading(true);
      const cancelledInvoice = await invoiceService.cancelInvoice(uid, reason);
      
      // Update local state
      setInvoices(prev => prev.map(invoice => 
        invoice.uid === uid ? cancelledInvoice : invoice
      ));
      
      if (selectedInvoice?.uid === uid) {
        setSelectedInvoice(cancelledInvoice);
      }
      
      message.success('Hủy hóa đơn thành công!');
      await refreshStats();
      return cancelledInvoice;
      
    } catch (error: any) {
      console.error('Failed to cancel invoice:', error);
      message.error(error.response?.data?.error?.message || 'Không thể hủy hóa đơn');
      return null;
    } finally {
      setLoading(false);
    }
  }, [selectedInvoice]);

  /**
   * Handle search
   */
  const handleSearch = useCallback((newSearchText: string) => {
    setSearchText(newSearchText);
    setCurrentPage(1); // Reset to first page when searching
  }, []);

  /**
   * Handle filter change
   */
  const handleFilter = useCallback((filterName: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
    setCurrentPage(1); // Reset to first page when filtering
  }, []);

  /**
   * Handle page change
   */
  const handlePageChange = useCallback((page: number, pageSize?: number) => {
    setCurrentPage(page);
    if (pageSize && pageSize !== itemsPerPage) {
      setItemsPerPage(pageSize);
    }
  }, [itemsPerPage]);

  /**
   * Reset all filters
   */
  const resetFilters = useCallback(() => {
    setSearchText('');
    setFilters({
      status: 'all',
      paymentStatus: 'all',
      orgUid: '',
      dateFrom: '',
      dateTo: ''
    });
    setCurrentPage(1);
  }, []);

  /**
   * Refresh invoices list
   */
  const refreshInvoices = useCallback(async () => {
    await loadInvoices();
  }, [loadInvoices]);

  /**
   * Load and refresh stats
   */
  const refreshStats = useCallback(async () => {
    try {
      const statsData = await invoiceService.getInvoiceStats();
      setStats(statsData);
    } catch (error: any) {
      console.error('Failed to load invoice stats:', error);
      message.error('Không thể tải thống kê hóa đơn');
    }
  }, []);

  /**
   * Export invoices
   */
  const exportInvoices = useCallback(async (format: 'excel' | 'csv' | 'pdf' = 'excel'): Promise<string | null> => {
    try {
      const exportParams = {
        format,
        ...filters,
        dateFrom: filters.dateFrom || undefined,
        dateTo: filters.dateTo || undefined
      };
      
      const result = await invoiceService.exportInvoices(exportParams);
      message.success(`Xuất file ${format.toUpperCase()} thành công!`);
      return result.downloadUrl;
      
    } catch (error: any) {
      console.error('Failed to export invoices:', error);
      message.error('Không thể xuất dữ liệu hóa đơn');
      return null;
    }
  }, [filters]);

  /**
   * Generate invoice PDF
   */
  const generatePDF = useCallback(async (uid: string, template: string = 'standard'): Promise<string | null> => {
    try {
      const result = await invoiceService.generateInvoicePDF(uid, { template: template as any });
      message.success('Tạo PDF thành công!');
      return result.pdfUrl;
    } catch (error: any) {
      console.error('Failed to generate PDF:', error);
      message.error('Không thể tạo file PDF');
      return null;
    }
  }, []);

  /**
   * Load overdue invoices
   */
  const loadOverdueInvoices = useCallback(async () => {
    try {
      const result = await invoiceService.getOverdueInvoices();
      setOverdueInvoices(result.overdueInvoices);
    } catch (error: any) {
      console.error('Failed to load overdue invoices:', error);
      message.error('Không thể tải danh sách hóa đơn quá hạn');
    }
  }, []);

  /**
   * Send payment reminder
   */
  const sendPaymentReminder = useCallback(async (uid: string, reminderType: string = 'gentle'): Promise<boolean> => {
    try {
      const result = await invoiceService.sendPaymentReminder(uid, { reminderType: reminderType as any });
      message.success('Gửi nhắc nhở thanh toán thành công!');
      return result.sent;
    } catch (error: any) {
      console.error('Failed to send payment reminder:', error);
      message.error('Không thể gửi nhắc nhở thanh toán');
      return false;
    }
  }, []);

  /**
   * Duplicate invoice
   */
  const duplicateInvoice = useCallback(async (uid: string, newData: any = {}): Promise<InvoiceDto | null> => {
    try {
      setLoading(true);
      const duplicatedInvoice = await invoiceService.duplicateInvoice(uid, newData);
      
      message.success('Sao chép hóa đơn thành công!');
      await refreshInvoices();
      return duplicatedInvoice;
      
    } catch (error: any) {
      console.error('Failed to duplicate invoice:', error);
      message.error(error.response?.data?.error?.message || 'Không thể sao chép hóa đơn');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Load initial data
  useEffect(() => {
    loadInvoices();
    refreshStats();
    loadOverdueInvoices();
  }, [currentPage, itemsPerPage]);

  // Reload when search or filters change
  useEffect(() => {
    loadInvoices();
  }, [searchText, filters]);

  return {
    // State
    loading,
    invoices,
    selectedInvoice,
    stats,
    overdueInvoices,
    
    // Pagination
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    hasNext,
    hasPrevious,
    
    // Search & Filter
    searchText,
    filters,
    
    // Actions
    loadInvoices,
    loadInvoiceById,
    createInvoice,
    createManualInvoice,
    updateInvoice,
    deleteInvoice,
    sendInvoice,
    markAsPaid,
    markAsOverdue,
    cancelInvoice,
    
    // Utilities
    handleSearch,
    handleFilter,
    handlePageChange,
    resetFilters,
    refreshInvoices,
    refreshStats,
    
    // Export & Reports
    exportInvoices,
    generatePDF,
    loadOverdueInvoices,
    sendPaymentReminder,
    duplicateInvoice
  };
};

export default useInvoices;