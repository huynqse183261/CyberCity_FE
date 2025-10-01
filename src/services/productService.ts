import { BaseApiService, API_ENDPOINTS } from './BaseApiService';
import type { 
  Product, 
  ProductCategory, 
  ProductStats,
  ApiResponse 
} from '../models';

class ProductService extends BaseApiService {
  constructor() {
    super(API_ENDPOINTS.PRODUCTS);
  }

  // Lấy thống kê sản phẩm
  async getStats(): Promise<ApiResponse<ProductStats>> {
    return this.getById<ProductStats>('stats');
  }

  // Lấy sản phẩm theo category
  async getByCategory(categoryId: string, params?: {
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<Product[]>> {
    const response = await this.getAll<Product>({
      ...params,
      category: categoryId
    });
    return response;
  }

  // Cập nhật stock của sản phẩm
  async updateStock(productId: string, quantity: number): Promise<ApiResponse<Product>> {
    return this.patch<Product, { stock: number }>(productId, { stock: quantity });
  }

  // Cập nhật trạng thái sản phẩm
  async updateStatus(productId: string, status: 'active' | 'inactive'): Promise<ApiResponse<Product>> {
    return this.patch<Product, { status: string }>(productId, { status });
  }

  // Upload hình ảnh sản phẩm
  async uploadImage(productId: string, imageFile: File): Promise<ApiResponse<{ imageUrl: string }>> {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    const response = await fetch(`${this.endpoint}/${productId}/upload-image`, {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      }
    });
    
    return response.json();
  }
}

class CategoryService extends BaseApiService {
  constructor() {
    super(API_ENDPOINTS.CATEGORIES);
  }

  // Lấy categories có hierarchical structure
  async getCategoriesTree(): Promise<ApiResponse<ProductCategory[]>> {
    return this.getById<ProductCategory[]>('tree');
  }
}

// Export instances
export const productService = new ProductService();
export const categoryService = new CategoryService();