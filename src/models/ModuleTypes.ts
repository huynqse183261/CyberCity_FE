export interface Module {
  uid: string;
  courseUid: string; // Đổi tên cho đồng bộ với BE
  title: string;
  description: string;
  orderIndex: number;
  status: 'draft' | 'published' | 'archived';
  createdAt: string;
  updatedAt: string;
}

export interface CreateModuleRequest {
  courseUid: string;
  title: string;
  description: string;
  orderIndex: number;
}

export interface UpdateModuleRequest {
  courseUid?: string;
  title?: string;
  description?: string;
  orderIndex?: number;
}