import { ClientSummary } from "./client.types";
import { Document, DocumentStatus, SecurityLevel } from "./generic.types";
import { VehicleSummary } from "./vehicle.types";

type WorkerStatus = "Active" | "Absence" | "Inactive";

interface Worker {
  worker_id: number;
  company_worker_code: string;
  first_name: string;
  last_name_1: string;
  last_name_2?: string | null;
  email?: string | null;
  phone?: string | null;
  document_number?: string | null;
  social_security_number?: string | null;
  birth_date?: string | null;
  address?: string | null;
  emergency_contact_name?: string | null;
  emergency_contact_phone?: string | null;
  contract_start_date?: string | null;
  contract_end_date?: string | null;
  status: WorkerStatus;
  notes?: string | null;
  client_id?: number | null;
  current_vehicle_id?: number | null;
  client?: ClientSummary | null;
  current_vehicle?: VehicleSummary | null;
  documents: WorkerDocument[];
}

interface WorkerPayload {
  company_worker_code: string;
  first_name: string;
  last_name_1: string;
  last_name_2?: string;
  email?: string;
  phone?: string;
  document_number?: string;
  social_security_number?: string;
  birth_date?: string;
  address?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  contract_start_date?: string;
  contract_end_date?: string;
  status: WorkerStatus;
  notes?: string;
  client_id?: number | null;
  current_vehicle_id?: number | null;
  documents: WorkerDocument[];
}

interface WorkerDocument extends Document {
  worker_document_id?: number | null;
}

interface DocumentUploadPayload {
  workerId: number;
  document: WorkerDocument;
  file: File;
}

export type {
  WorkerStatus,
  WorkerDocument,
  Worker,
  WorkerPayload,
  DocumentUploadPayload,
};
