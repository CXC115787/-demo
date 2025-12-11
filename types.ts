
import { LucideIcon } from 'lucide-react';

export interface SubMenuItem {
  id: string;
  label: string;
  isAiFeature?: boolean;
}

export interface MenuItem {
  id: string;
  label: string;
  icon: LucideIcon;
  children?: SubMenuItem[];
}

export interface DashboardStat {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: LucideIcon;
}

export interface PendingTask {
  id: string;
  project: string;
  applicant: string;
  amount: string;
  date: string;
  status: 'pending' | 'reviewing';
  aiRiskScore: number; // 0-100, higher is riskier
}

// --- Custom Forms Types ---

export type FormStatus = 'draft' | 'active' | 'ended';

export interface FormItem {
  id: string;
  title: string;
  status: FormStatus;
  submitCountToday: number;
  submitCountTotal: number;
  lastUpdated: string;
  channels: ('app' | 'qr')[];
}

export interface SubmissionData {
  id: string;
  formName: string;
  submitTime: string;
  channelName: string; // Specific channel name e.g., "Canteen Poster"
  // Flexible key-value pairs for form content (e.g., Name, Phone, Reason)
  formData: Record<string, string>; 
}

export interface Channel {
  id: string;
  name: string;
  tag: string;
  views: number;
  submissions: number;
  createTime: string;
  status: 'active' | 'disabled';
  isSystem?: boolean; // New field to identify default system channels
}

// --- Template Types ---

export interface TemplateField {
  type: string;
  label: string;
  defaultProps: any;
}

export interface ComponentTemplate {
  id: string;
  title: string;
  category: string;
  type: 'system' | 'custom';
  description?: string;
  fields: TemplateField[];
  icon?: any;
  createTime?: string;
}
