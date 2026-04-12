interface ClientSummary {
  client_id: number;
  business_name: string;
  contact_email?: string | null;
  contact_phone?: string | null;
  badge_color: string;
}

export type { ClientSummary };
