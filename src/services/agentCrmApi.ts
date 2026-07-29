import {
  Lead,
  LeadNote,
  FollowUp,
  LeadActivity,
  PaginatedResponse,
  CreateLeadDto,
  UpdateLeadDto,
  QueryLeadsDto,
  ScheduleFollowUpDto,
  FollowUpStatus,
} from '@/types/crm';
import { API_URL } from '@/constants';

const BASE_URL = API_URL;

async function fetcher<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const storedAttrId = typeof window !== 'undefined' ? localStorage.getItem('glofi_attr_id') : null;
  const headers = new Headers(options?.headers);
  headers.set('Content-Type', 'application/json');
  if (storedAttrId) {
    headers.set('X-Attribution-ID', storedAttrId);
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: 'include',
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ message: `API request failed with code ${res.status}` }));
    throw new Error(errorData.message || 'API request failed');
  }

  return await res.json();
}

/**
 * Service handlers for Agent CRM APIs
 */
export const agentCrmApi = {
  // 1. Create Lead (POST /agent/crm/leads)
  createLead: async (data: CreateLeadDto): Promise<Lead> => {
    return fetcher<Lead>('/agent/crm/leads', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // 2. List Assigned Leads (GET /agent/crm/leads)
  getLeads: async (params?: QueryLeadsDto): Promise<PaginatedResponse<Lead>> => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          searchParams.append(key, String(val));
        }
      });
    }
    const queryStr = searchParams.toString() ? `?${searchParams.toString()}` : '';
    return fetcher<PaginatedResponse<Lead>>(`/agent/crm/leads${queryStr}`);
  },

  // 3. Get Lead Details (GET /agent/crm/leads/:id)
  getLeadById: async (id: string): Promise<Lead> => {
    return fetcher<Lead>(`/agent/crm/leads/${id}`);
  },

  // 4. Update Lead / Change Status (PATCH /agent/crm/leads/:id)
  updateLead: async (id: string, data: UpdateLeadDto): Promise<Lead> => {
    return fetcher<Lead>(`/agent/crm/leads/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  // 5. Delete Lead (DELETE /agent/crm/leads/:id)
  deleteLead: async (id: string): Promise<void> => {
    await fetcher<void>(`/agent/crm/leads/${id}`, { method: 'DELETE' });
  },

  // 6. Add Note to Lead (POST /agent/crm/leads/:id/notes)
  addNote: async (leadId: string, note: string): Promise<LeadNote> => {
    return fetcher<LeadNote>(`/agent/crm/leads/${leadId}/notes`, {
      method: 'POST',
      body: JSON.stringify({ note }),
    });
  },

  // 6. List Lead Notes (GET /agent/crm/leads/:id/notes)
  getNotes: async (leadId: string): Promise<LeadNote[]> => {
    return fetcher<LeadNote[]>(`/agent/crm/leads/${leadId}/notes`);
  },

  // 7. Schedule Follow-Up (POST /agent/crm/leads/:id/followups)
  scheduleFollowUp: async (leadId: string, data: ScheduleFollowUpDto): Promise<FollowUp> => {
    return fetcher<FollowUp>(`/agent/crm/leads/${leadId}/followups`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // 8. Update Follow-Up Status (PATCH /agent/crm/followups/:id)
  updateFollowUpStatus: async (followUpId: string, status: FollowUpStatus.COMPLETED | FollowUpStatus.CANCELLED): Promise<FollowUp> => {
    return fetcher<FollowUp>(`/agent/crm/followups/${followUpId}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  // 9. List Agent Follow-Ups (GET /agent/crm/followups)
  getAgentFollowUps: async (params?: { status?: FollowUpStatus; page?: number; limit?: number }): Promise<PaginatedResponse<FollowUp>> => {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.append('status', params.status);
    if (params?.page) searchParams.append('page', String(params.page));
    if (params?.limit) searchParams.append('limit', String(params.limit));

    const queryStr = searchParams.toString() ? `?${searchParams.toString()}` : '';
    return fetcher<PaginatedResponse<FollowUp>>(`/agent/crm/followups${queryStr}`);
  },

  // 10. Get Lead Timeline Feed (GET /agent/crm/leads/:id/timeline)
  getLeadTimeline: async (leadId: string): Promise<LeadActivity[]> => {
    return fetcher<LeadActivity[]>(`/agent/crm/leads/${leadId}/timeline`);
  },
};
