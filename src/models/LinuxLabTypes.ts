// LinuxLab specific types and interfaces

export interface User {
  name: string;
  username: string;
  avatar: string;
}

export interface Stat {
  value: string;
  label: string;
}

export interface FeatureData {
  icon: string;
  title: string;
  description: string;
  features: string[];
  stats: Stat[];
  buttonText: string;
  buttonAction: () => void;
}

export interface Message {
  type: 'user' | 'bot';
  content: string;
}

export interface UserDropdownProps {
  user: User;
}

export interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  features: string[];
  stats: Stat[];
  buttonText: string;
  onButtonClick: () => void;
}

export interface AIAssistantProps {
  isExpanded: boolean;
  onToggle: () => void;
}

// Navigation menu item type
export interface NavigationItem {
  label: string;
  path: string;
  icon?: string;
  children?: NavigationItem[];
}

// Linux Lab Environment Types
export interface LinuxLabEnvironment {
  id: string;
  name: string;
  description?: string;
  os: 'ubuntu' | 'kali' | 'centos' | 'debian' | 'arch' | 'fedora';
  version: string;
  status: 'available' | 'building' | 'error' | 'maintenance';
  resources: {
    cpu: number;      // CPU cores
    memory: number;   // GB
    disk: number;     // GB
  };
  preInstalledTools: string[];
  dockerImage: string;
  tags: string[];
  isPublic: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

// Linux Lab Session Types
export interface LinuxLabSession {
  id: string;
  environmentId: string;
  userId: string;
  sessionName: string;
  status: 'starting' | 'running' | 'stopping' | 'stopped' | 'error';
  startTime: Date;
  endTime?: Date;
  maxDuration: number; // minutes
  actualDuration?: number;
  resources: {
    cpuUsage: number;    // percentage
    memoryUsage: number; // percentage
    diskUsage: number;   // percentage
  };
  accessUrl?: string;
  terminalUrl?: string;
  isShared: boolean;
  shareToken?: string;
  metadata: {
    userAgent?: string;
    ipAddress?: string;
    location?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Lab Exercise/Assignment Types  
export interface LabExercise {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  category: 'linux-basics' | 'networking' | 'security' | 'penetration-testing' | 'system-admin';
  estimatedTime: number; // minutes
  objectives: string[];
  prerequisites: string[];
  environment: {
    os: string;
    tools: string[];
    files?: string[];
  };
  instructions: {
    step: number;
    title: string;
    description: string;
    expectedOutput?: string;
    hints?: string[];
  }[];
  validation: {
    commands?: string[];
    expectedFiles?: string[];
    expectedOutput?: string[];
  };
  points: number;
  tags: string[];
  isPublished: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

// Lab Submission Types
export interface LabSubmission {
  id: string;
  exerciseId: string;
  userId: string;
  sessionId: string;
  status: 'in-progress' | 'completed' | 'failed' | 'timeout';
  startTime: Date;
  endTime?: Date;
  actualTime?: number; // minutes
  score?: number;
  maxScore: number;
  feedback?: string;
  submittedFiles?: string[];
  commandHistory: {
    command: string;
    output: string;
    timestamp: Date;
    exitCode: number;
  }[];
  screenshots?: string[];
  notes?: string;
  attempts: number;
  createdAt: Date;
  updatedAt: Date;
}