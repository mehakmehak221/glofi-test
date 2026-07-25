export enum TicketStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  WAITING_FOR_USER = 'WAITING_FOR_USER',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
  ESCALATED = 'ESCALATED',
}

export enum TicketPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export enum TicketCategory {
  GENERAL = 'GENERAL',
  KYC = 'KYC',
  PAYMENT = 'PAYMENT',
  INVESTMENT = 'INVESTMENT',
  WITHDRAWAL = 'WITHDRAWAL',
  TECHNICAL = 'TECHNICAL',
  ACCOUNT = 'ACCOUNT',
  OTHER = 'OTHER',
}

export interface TicketAttachment {
  id: string;
  ticketId?: string;
  messageId?: string;
  fileUrl: string;
  signedUrl?: string;
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  createdAt: string;
}

export interface TicketMessage {
  id: string;
  ticketId: string;
  senderId?: string;
  senderEmail: string;
  message: string;
  isAdmin: boolean;
  createdAt: string;
  attachments?: TicketAttachment[];
  sender?: {
    id: string;
    email: string;
    role: string;
  };
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  userId?: string;
  email: string;
  subject: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  category: TicketCategory;
  assignedAdminId?: string;
  leadId?: string;
  resolvedAt?: string;
  closedAt?: string;
  createdAt: string;
  updatedAt: string;
  assignedAdmin?: {
    id: string;
    email: string;
    adminProfile?: { name: string };
  };
  messages?: TicketMessage[];
  attachments?: TicketAttachment[];
  _count?: {
    messages: number;
    attachments: number;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}
