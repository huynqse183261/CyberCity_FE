// Interface cho thành viên đội ngũ
export interface TeamMember {
  key: string;
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  role: 'admin' | 'manager' | 'employee';
  status: 'active' | 'inactive';
  joinDate: string;
  avatar?: string;
  address: string;
  salary: number;
  skills: string[];
  bio?: string;
}

// Interface cho thống kê đội ngũ
export interface TeamStats {
  total: number;
  active: number;
  admins: number;
  managers: number;
  employees: number;
}

// Interface cho phòng ban
export interface Department {
  id: string;
  name: string;
  description?: string;
  managerId?: string;
}

// Interface cho form thành viên
export interface TeamMemberFormData {
  name: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  role: 'admin' | 'manager' | 'employee';
  status: 'active' | 'inactive';
  address: string;
  salary: number;
  skills?: string;
  bio?: string;
  avatar?: string;
}

// Interface cho filter đội ngũ
export interface TeamFilter {
  searchText: string;
  department: string;
  role: string;
  status?: 'active' | 'inactive' | 'all';
}
