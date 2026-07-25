import { baseApi } from './baseApi';
import { SupportTicket } from '@/types/support';

export const supportApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createPublicTicket: builder.mutation<SupportTicket, Partial<SupportTicket> & { attachmentKeys?: string[] }>({
      query: (body) => ({
        url: 'support/tickets',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const {
  useCreatePublicTicketMutation,
} = supportApi;
