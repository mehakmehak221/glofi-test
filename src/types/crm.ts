export enum LeadStatus {
  NEW = 'NEW',
  CONTACTED = 'CONTACTED',
  INTERESTED = 'INTERESTED',
  KYC_STARTED = 'KYC_STARTED',
  INVESTED = 'INVESTED',
  CLOSED = 'CLOSED',
  LOST = 'LOST',
}

export enum FollowUpStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum LeadActivityType {
  LEAD_CREATED = 'LEAD_CREATED',
  LEAD_ASSIGNED = 'LEAD_ASSIGNED',
  STATUS_CHANGED = 'STATUS_CHANGED',
  NOTE_ADDED = 'NOTE_ADDED',
  FOLLOWUP_CREATED = 'FOLLOWUP_CREATED',
  FOLLOWUP_COMPLETED = 'FOLLOWUP_COMPLETED',
  CALL_LOGGED = 'CALL_LOGGED',
  EMAIL_SENT = 'EMAIL_SENT',
  WHATSAPP_SENT = 'WHATSAPP_SENT',
  KYC_STARTED = 'KYC_STARTED',
  INVESTED = 'INVESTED',
}

export interface UserSummary {
  id: string;
  email: string;
  agentProfile?: {
    fullName?: string;
  };
  kycStatus?: string;
}

export interface LeadNote {
  id: string;
  leadId: string;
  authorId: string;
  note: string;
  createdAt: string;
  author?: UserSummary;
}

export interface FollowUp {
  id: string;
  leadId: string;
  assignedToId: string;
  title: string;
  description?: string;
  dueAt: string;
  reminderAt?: string;
  completedAt?: string;
  status: FollowUpStatus;
  createdAt: string;
  updatedAt: string;
  assignedTo?: UserSummary;
  lead?: {
    id: string;
    name: string;
    phone: string;
    email?: string;
    status: LeadStatus;
  };
}

export interface LeadActivity {
  id: string;
  leadId: string;
  performedById: string;
  type: LeadActivityType;
  metadata?: Record<string, any>;
  createdAt: string;
  performedBy?: UserSummary;
}

export interface Lead {
  id: string;
  userId?: string;
  assignedAgentId?: string;
  name: string;
  email?: string;
  phone: string;
  source?: string;
  priority?: 'HIGH' | 'MEDIUM' | 'LOW' | string;
  status: LeadStatus;
  lastContactedAt?: string;
  convertedAt?: string;
  closedAt?: string;
  createdAt: string;
  updatedAt: string;
  assignedAgent?: UserSummary;
  user?: UserSummary;
  notes?: LeadNote[];
  followUps?: FollowUp[];
  activities?: LeadActivity[];
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CrmDashboardMetrics {
  totalLeads: number;
  newLeads: number;
  contacted: number;
  interested: number;
  kycStarted: number;
  invested: number;
  closed: number;
  lost: number;
  conversionRate: number;
  leadsByAgent: Array<{
    agentId: string | null;
    agentName: string;
    count: number;
  }>;
  leadsBySource: Array<{
    source: string;
    count: number;
  }>;
  pendingFollowUps: number;
  todaysFollowUps: number;
  overdueFollowUps: number;
  avgConversionTimeDays: number;
  avgDaysInStage: number;
}

export const ALLOWED_STATUS_TRANSITIONS: Record<LeadStatus, LeadStatus[]> = {
  [LeadStatus.NEW]: [LeadStatus.CONTACTED, LeadStatus.LOST],
  [LeadStatus.CONTACTED]: [LeadStatus.INTERESTED, LeadStatus.LOST],
  [LeadStatus.INTERESTED]: [LeadStatus.KYC_STARTED, LeadStatus.LOST],
  [LeadStatus.KYC_STARTED]: [LeadStatus.INVESTED, LeadStatus.LOST],
  [LeadStatus.INVESTED]: [LeadStatus.CLOSED, LeadStatus.LOST],
  [LeadStatus.CLOSED]: [], // Terminal state
  [LeadStatus.LOST]: [LeadStatus.NEW, LeadStatus.CONTACTED], // Reopen flow
};

// DTO Interfaces
export interface CreateLeadDto {
  name: string;
  phone: string;
  email?: string;
  source?: string;
  priority?: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface UpdateLeadDto {
  status?: LeadStatus;
  priority?: 'HIGH' | 'MEDIUM' | 'LOW' | string;
  email?: string;
  phone?: string;
  name?: string;
  source?: string;
}

export interface QueryLeadsDto {
  search?: string;
  status?: LeadStatus;
  source?: string;
  priority?: 'HIGH' | 'MEDIUM' | 'LOW';
  createdFrom?: string;
  createdTo?: string;
  page?: number;
  limit?: number;
  assignedAgentId?: string;
}

export interface ScheduleFollowUpDto {
  title: string;
  description?: string;
  dueAt: string;
  reminderAt?: string;
}
