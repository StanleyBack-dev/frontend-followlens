import "server-only";
import { backendFetch } from "@/server/http/backend-client";
import type {
  Paginated,
  SendSupportMessageInput,
  SentSupportMessage,
  SupportCategory,
  SupportMessageStatus,
  SupportTicket,
  SupportTicketStatus,
} from "@/shared/contracts/api";

const TICKETS = "/admin/support/tickets";

export const supportService = {
  // === user ===
  status(token: string): Promise<SupportMessageStatus> {
    return backendFetch("/support/status", { token });
  },

  send(
    token: string,
    input: SendSupportMessageInput,
  ): Promise<SentSupportMessage> {
    return backendFetch("/support/messages", {
      method: "POST",
      token,
      body: input,
    });
  },

  // === admin (the backend's AdminGuard is the real gate) ===
  tickets(
    token: string,
    params: {
      status?: SupportTicketStatus;
      category?: SupportCategory;
      page?: number;
      limit?: number;
    },
  ): Promise<Paginated<SupportTicket>> {
    return backendFetch(TICKETS, { token, query: params });
  },

  ticket(token: string, id: string): Promise<SupportTicket> {
    return backendFetch(`${TICKETS}/${encodeURIComponent(id)}`, { token });
  },

  reply(token: string, id: string, reply: string): Promise<SupportTicket> {
    return backendFetch(`${TICKETS}/${encodeURIComponent(id)}/reply`, {
      method: "POST",
      token,
      body: { reply },
    });
  },

  finalize(token: string, id: string): Promise<SupportTicket> {
    return backendFetch(`${TICKETS}/${encodeURIComponent(id)}/finalize`, {
      method: "POST",
      token,
    });
  },
};
