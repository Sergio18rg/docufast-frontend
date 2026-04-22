import { Document, Status, WorkerSummary } from "./generic.types";
interface ClientDocument extends Document {
  client_document_id?: number | null;
}
interface ClientSummary {
  client_id: number;
  client_code: string;
  business_name: string;
  contact_email?: string | null;
  contact_phone?: string | null;
  badge_color: string;
  contract_start_date?: string | null;
  contract_end_date?: string | null;
  status: Status;
  notes?: string | null;
  current_workers?: WorkerSummary[];
  current_workers_count?: number;
  documents?: ClientDocument[];
}
interface ClientPayload {
  client_code: string;
  business_name: string;
  contact_email: string;
  contact_phone?: string;
  badge_color: string;
  contract_start_date?: string;
  contract_end_date?: string;
  status: Status;
  notes?: string;
  documents: ClientDocument[];
}

export type { ClientDocument, ClientSummary, ClientPayload };
