import { baseApi } from './baseApi';
import { SupportTicket, PaginatedResponse, TicketMessage } from '@/types/support';

export interface GetMyTicketsParams {
  page?: number;
  limit?: number;
  status?: string;
  category?: string;
  search?: string;
}

export interface PostUserReplyRequest {
  message: string;
  attachmentKeys?: string[];
}

export const supportApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createPublicTicket: builder.mutation<SupportTicket, Partial<SupportTicket> & { attachmentKeys?: string[] }>({
      query: (body) => ({
        url: 'support/tickets',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Support'],
    }),


    getMyTickets: builder.query<PaginatedResponse<SupportTicket>, GetMyTicketsParams>({
      query: (params = {}) => ({
        url: 'support/tickets',
        params,
      }),
      providesTags: ['Support'],
    }),


    getTicketById: builder.query<SupportTicket, string>({
      query: (idOrTicketNumber) => ({
        url: `support/tickets/${idOrTicketNumber}`,
      }),
      providesTags: (_result, _err, id) => [{ type: 'Support', id }],
    }),

    postUserReply: builder.mutation<TicketMessage, { ticketId: string } & PostUserReplyRequest>({
      query: ({ ticketId, ...body }) => ({
        url: `support/tickets/${ticketId}/messages`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (_result, _err, { ticketId }) => [
        'Support',
        { type: 'Support', id: ticketId },
      ],
    }),
  }),
});

export const {
  useCreatePublicTicketMutation,
  useGetMyTicketsQuery,
  useGetTicketByIdQuery,
  usePostUserReplyMutation,
} = supportApi;
