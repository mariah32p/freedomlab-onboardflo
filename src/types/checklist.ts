export interface Checklist {
  id: string;
  user_id: string;
  title: string;
  description: string;
  is_public: boolean;
  password_hash: string | null;
  brand_color: string;
  logo_url: string | null;
  completion_page_content: string;
  created_at: string;
  updated_at: string;
}

export type StepType = 'checkbox' | 'text' | 'textarea' | 'file_upload' | 'url' | 'email';

export interface ChecklistStep {
  id: string;
  checklist_id: string;
  title: string;
  description: string;
  step_type: StepType;
  options?: string; // JSON string for step-specific options
  order_index: number;
  is_required: boolean;
  created_at: string;
  updated_at: string;
}

export interface ChecklistWithSteps extends Checklist {
  steps: ChecklistStep[];
}

export interface CreateChecklistData {
  title: string;
  description: string;
  is_public: boolean;
  password?: string;
  brand_color: string;
  logo_url: string;
  completion_page_content: string;
}

export interface CreateStepData {
  title: string;
  description: string;
  step_type: StepType;
  options?: string;
  is_required: boolean;
}

export interface Customer {
  id: string;
  checklist_id: string;
  email: string;
  name: string;
  company: string;
  started_at: string;
  completed_at: string | null;
  last_activity: string;
  created_at: string;
}

export interface CustomerProgress {
  id: string;
  customer_id: string;
  step_id: string;
  completed_at: string;
  notes: string;
  created_at: string;
}