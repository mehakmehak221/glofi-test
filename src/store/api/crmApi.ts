import { baseApi } from './baseApi';
import {
  Lead,
  CreateLeadDto,
  UpdateLeadDto,
  QueryLeadsDto,
  PaginatedResponse,
  LeadNote,
  FollowUp,
  LeadActivity,
} from '@/types/crm';

export const crmApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    createLead: builder.mutation<Lead, CreateLeadDto>({
      query: (data) => ({
        url: 'agent/crm/leads',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Lead', id: 'LIST' }],
    }),
    getLeads: builder.query<PaginatedResponse<Lead>, QueryLeadsDto | void>({
      query: (arg) => {
        const { search, status, source, priority, createdFrom, createdTo, page = 1, limit = 10 } = arg || {};
        const params = new URLSearchParams({ page: String(page), limit: String(limit) });
        if (search) params.append('search', search);
        if (status) params.append('status', status);
        if (source) params.append('source', source);
        if (priority) params.append('priority', priority);
        if (createdFrom) params.append('createdFrom', createdFrom);
        if (createdTo) params.append('createdTo', createdTo);
        return {
          url: `agent/crm/leads?${params.toString()}`,
          method: 'GET',
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({ type: 'Lead' as const, id })),
              { type: 'Lead', id: 'LIST' },
            ]
          : [{ type: 'Lead', id: 'LIST' }],
    }),
    getLeadById: builder.query<Lead, string>({
      query: (id) => ({
        url: `agent/crm/leads/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Lead', id }],
    }),
    updateLead: builder.mutation<Lead, { id: string } & UpdateLeadDto>({
      query: ({ id, ...body }) => ({
        url: `agent/crm/leads/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Lead', id },
        { type: 'Lead', id: 'LIST' },
      ],
    }),
    addNote: builder.mutation<LeadNote, { leadId: string; note: string }>({
      query: ({ leadId, note }) => ({
        url: `agent/crm/leads/${leadId}/notes`,
        method: 'POST',
        body: { note },
      }),
      invalidatesTags: (result, error, { leadId }) => [
        { type: 'Lead', id: leadId },
        { type: 'LeadNote', id: 'LIST' },
      ],
    }),
    getNotes: builder.query<LeadNote[], string>({
      query: (leadId) => ({
        url: `agent/crm/leads/${leadId}/notes`,
        method: 'GET',
      }),
      providesTags: (result, error, leadId) => [{ type: 'LeadNote', id: leadId }],
    }),
    scheduleFollowUp: builder.mutation<FollowUp, { leadId: string; title: string; dueAt: string; reminderAt?: string; description?: string }>({
      query: ({ leadId, ...body }) => ({
        url: `agent/crm/leads/${leadId}/followups`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (result, error, { leadId }) => [
        { type: 'Lead', id: leadId },
        { type: 'FollowUp', id: 'LIST' },
      ],
    }),
    updateFollowUpStatus: builder.mutation<FollowUp, { id: string; status: 'COMPLETED' | 'CANCELLED' }>({
      query: ({ id, status }) => ({
        url: `agent/crm/followups/${id}`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: () => [
        { type: 'FollowUp', id: 'LIST' },
        { type: 'Lead', id: 'LIST' },
      ],
    }),
    getFollowUps: builder.query<PaginatedResponse<FollowUp>, { status?: string; page?: number; limit?: number } | void>({
      query: (arg) => {
        const { status, page = 1, limit = 10 } = arg || {};
        const params = new URLSearchParams({ page: String(page), limit: String(limit) });
        if (status) params.append('status', status);
        return {
          url: `agent/crm/followups?${params.toString()}`,
          method: 'GET',
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({ type: 'FollowUp' as const, id })),
              { type: 'FollowUp', id: 'LIST' },
            ]
          : [{ type: 'FollowUp', id: 'LIST' }],
    }),
    getLeadTimeline: builder.query<LeadActivity[], string>({
      query: (leadId) => ({
        url: `agent/crm/leads/${leadId}/timeline`,
        method: 'GET',
      }),
      providesTags: (result, error, leadId) => [{ type: 'LeadActivity', id: leadId }],
    }),
  }),
});

export const {
  useCreateLeadMutation,
  useGetLeadsQuery,
  useGetLeadByIdQuery,
  useUpdateLeadMutation,
  useAddNoteMutation,
  useGetNotesQuery,
  useScheduleFollowUpMutation,
  useUpdateFollowUpStatusMutation,
  useGetFollowUpsQuery,
  useGetLeadTimelineQuery,
} = crmApi;
