// Export tất cả các types từ các file khác
export * from './RegisterTypes';
export * from './ProductTypes';
export * from './OrderTypes';
export * from './TeamTypes';
export * from './MessageTypes';
export * from './PricingTypes';
export * from './InvoiceTypes';
export * from './DashboardTypes';

// Interface chung cho API response
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

// Interface chung cho pagination
export interface PaginationConfig {
  current: number;
  pageSize: number;
  total: number;
  showSizeChanger?: boolean;
  showQuickJumper?: boolean;
  showTotal?: (total: number, range: [number, number]) => string;
}

// Interface chung cho table columns
export interface TableColumn<T> {
  title: string;
  dataIndex?: keyof T;
  key: string;
  width?: number;
  render?: (value: any, record: T) => React.ReactNode;
  sorter?: boolean | ((a: T, b: T) => number);
  filters?: Array<{text: string; value: any}>;
  onFilter?: (value: any, record: T) => boolean;
  fixed?: 'left' | 'right';
}

// Interface chung cho form validation
export interface ValidationRule {
  required?: boolean;
  message?: string;
  type?: 'email' | 'number' | 'url';
  min?: number;
  max?: number;
  pattern?: RegExp;
  validator?: (rule: any, value: any) => Promise<void>;
}

// Interface chung cho modal props
export interface ModalProps {
  open: boolean;
  title: string;
  onOk: () => void;
  onCancel: () => void;
  width?: number;
  okText?: string;
  cancelText?: string;
  confirmLoading?: boolean;
}

// Interface chung cho filter
export interface BaseFilter {
  searchText: string;
  dateRange?: [string, string];
}

// Interface chung cho statistics card
export interface StatCard {
  title: string;
  value: number | string;
  prefix?: React.ReactNode;
  suffix?: string;
  valueStyle?: React.CSSProperties;
  icon?: React.ReactNode;
  color?: string;
}
