// Course/Product Types with Hierarchical Structure
export interface Course {
  uid: string;
  title: string;
  description: string;
  level: string;
  createdAt: string;
  updatedAt: string;
  price?: number;
  duration?: string;
  instructor?: string;
  thumbnail?: string;
  isActive?: boolean;
  modules?: Module[];
}

export interface Module {
  uid: string;
  courseId: string;
  title: string;
  description: string;
  order: number;
  orderIndex?: number; // API sử dụng orderIndex
  createdAt: string;
  updatedAt?: string;
  lessons?: Lesson[];
}

export interface Lesson {
  uid: string;
  moduleId: string;
  title: string;
  description: string;
  content?: string;
  videoUrl?: string;
  duration?: number; // in minutes
  order: number;
  createdAt: string;
  updatedAt: string;
  topics?: Topic[];
}

export interface Topic {
  uid: string;
  lessonId: string;
  title: string;
  description: string;
  content?: string;
  order: number;
  createdAt: string;
  updatedAt: string;
  subtopics?: Subtopic[];
}

export interface Subtopic {
  uid: string;
  topicId: string;
  title: string;
  description: string;
  content?: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface CourseFormData {
  title: string;
  description: string;
  level: string;
  price?: number;
  duration?: string;
  instructor?: string;
  thumbnail?: string;
  isActive?: boolean;
}

export interface ModuleFormData {
  title: string;
  description: string;
  order: number;
  courseId?: string; // Cần courseId khi tạo module
}

// Response từ API modules
export interface ModuleListResponse {
  items: Module[];
  totalCount?: number;
  pageNumber?: number;
  pageSize?: number;
  totalPages?: number;
}

// Params cho API modules
export interface ModuleListParams {
  pageNumber?: number;
  pageSize?: number;
  courseId?: string;
}

export interface LessonFormData {
  title: string;
  description: string;
  content?: string;
  videoUrl?: string;
  duration?: number;
  order: number;
}

export interface TopicFormData {
  title: string;
  description: string;
  content?: string;
  order: number;
}

export interface SubtopicFormData {
  title: string;
  description: string;
  content?: string;
  order: number;
}

export interface CourseListParams {
  pageNumber?: number;
  pageSize?: number;
  level?: string;
  descending?: boolean;
}

export interface CourseListResponse {
  items: Course[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export interface CreateCourseRequest {
  title: string;
  description: string;
  level: string;
}

export interface UpdateCourseRequest extends CreateCourseRequest {
  uid: string;
}

export interface CourseFilterState {
  level: string;
  searchQuery: string;
  isActive?: boolean;
}

// Hierarchical navigation state
export interface HierarchicalState {
  selectedCourse?: Course;
  selectedModule?: Module;
  selectedLesson?: Lesson;
  selectedTopic?: Topic;
  currentLevel: 'course' | 'module' | 'lesson' | 'topic' | 'subtopic';
}

// Content types for unified handling
export type ContentType = 'course' | 'module' | 'lesson' | 'topic' | 'subtopic';
export type ContentItem = Course | Module | Lesson | Topic | Subtopic;

// Form data union type
export type ContentFormData = CourseFormData | ModuleFormData | LessonFormData | TopicFormData | SubtopicFormData;