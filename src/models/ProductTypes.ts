// Interface cho sản phẩm
export interface Product {
  key: string;
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: 'active' | 'inactive';
  image: string;
  description: string;
}

// Interface cho danh mục sản phẩm
export interface ProductCategory {
  id: string;
  name: string;
  description?: string;
}

// Interface cho thống kê sản phẩm
export interface ProductStats {
  total: number;
  active: number;
  outOfStock: number;
  totalValue: number;
}

// Interface cho form tạo/sửa sản phẩm
export interface ProductFormData {
  name: string;
  category: string;
  price: number;
  stock: number;
  status: 'active' | 'inactive';
  description?: string;
  image?: string;
}

// Interface cho filter sản phẩm
export interface ProductFilter {
  searchText: string;
  category: string;
  status?: 'active' | 'inactive' | 'all';
  priceRange?: [number, number];
}
