export type SeverityLevel = 'low' | 'moderate' | 'high' | 'emergency';

export type LanguageCode = 'en' | 'hi';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  preferred_language: LanguageCode;
  created_at: string;
}

export interface EmergencyContact {
  id: string;
  user_id: string;
  name: string;
  email: string;
  phone: string;
  relationship: string;
  is_primary: boolean;
  created_at: string;
}

export interface IncidentReport {
  id: string;
  user_id: string;
  input_type: 'text' | 'image' | 'multimodal';
  input_text?: string;
  image_url?: string;
  incident_type: string;
  severity: SeverityLevel;
  confidence: number;
  escalation_required: boolean;
  created_at: string;
}

export interface GuidanceData {
  id?: string;
  incident_id?: string;
  language: LanguageCode;
  incident_type: string;
  severity: SeverityLevel;
  confidence: number;
  immediate_actions: string[];
  avoid_actions: string[];
  escalation_required: boolean;
  escalation_conditions?: string;
  warning: string;
  created_at?: string;
}

export interface AlertLog {
  id: string;
  incident_id: string;
  contact_id: string;
  status: 'pending' | 'sent' | 'failed' | 'simulated';
  sent_at: string;
  error_message?: string;
}
