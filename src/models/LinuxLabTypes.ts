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
  href: string;
  action?: () => void;
}