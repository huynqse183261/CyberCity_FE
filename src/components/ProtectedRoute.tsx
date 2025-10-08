import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import authService from '../services/authService';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Array<'admin' | 'teacher' | 'student'>;
  requireAuth?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles,
  requireAuth = true 
}) => {
  const location = useLocation();
  const isAuthenticated = authService.isAuthenticated();
  const currentUser = authService.getCurrentUser();

  // Nếu yêu cầu auth nhưng chưa đăng nhập
  if (requireAuth && !isAuthenticated) {
    // Redirect to login with return URL
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Nếu đã đăng nhập nhưng không có quyền truy cập
  if (isAuthenticated && allowedRoles && currentUser) {
    // Chặn người dùng không Active
    const status = (currentUser as any).status as string | undefined;
    if (status && status !== 'Active') {
      return <Navigate to="/access-denied" replace />;
    }

    const roleMap = {
      admin: 'admin',
      teacher: 'teacher',
      student: 'student'
    } as const;
    const mappedRole = roleMap[currentUser.role as keyof typeof roleMap] as 'admin' | 'teacher' | 'student';
    const hasPermission = allowedRoles.includes(mappedRole);

    if (!hasPermission) {
      // Redirect based on user role
      const redirectPath = getDefaultRouteForRole(mappedRole);
      return <Navigate to={redirectPath} replace />;
    }
  }

  return <>{children}</>;
};

// Helper function để lấy default route theo role
const getDefaultRouteForRole = (role: 'admin' | 'teacher' | 'student'): string => {
  switch (role) {
    case 'admin':
      return '/admin';
    case 'teacher':
      return '/teacher';
    case 'student':
      return '/student';
    default:
      console.warn('Unknown role:', role);
      return '/';
  }
};

export default ProtectedRoute;

// Specific role-based route guards
export const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute allowedRoles={['admin']}>
    {children}
  </ProtectedRoute>
);

export const TeacherRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute allowedRoles={['teacher', 'admin']}>
    {children}
  </ProtectedRoute>
);

export const StudentRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute allowedRoles={['student']}>
    {children}
  </ProtectedRoute>
);

export const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute requireAuth={false}>
    {children}
  </ProtectedRoute>
);