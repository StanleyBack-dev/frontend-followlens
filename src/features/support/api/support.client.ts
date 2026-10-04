import type {
  SendSupportMessageInput,
  SentSupportMessage,
  SupportTicket,
} from "@/shared/contracts/api";
import { apiRequest } from "@/shared/lib/api-client";

export const supportClient = {
  send(input: SendSupportMessageInput) {
    return apiRequest<SentSupportMessage>("/support/messages", {
      method: "POST",
      body: JSON.stringify(input),
    });
  },

  reply(ticketId: string, reply: string) {
    return apiRequest<SupportTicket>(
      `/admin/support/${encodeURIComponent(ticketId)}/reply`,
      { method: "POST", body: JSON.stringify({ reply }) },
    );
  },

  finalize(ticketId: string) {
    return apiRequest<SupportTicket>(
      `/admin/support/${encodeURIComponent(ticketId)}/finalize`,
      { method: "POST" },
    );
  },
};
