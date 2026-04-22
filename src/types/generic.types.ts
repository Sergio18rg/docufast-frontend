type DocumentStatus =
  | "Not uploaded"
  | "Valid"
  | "Expiring soon"
  | "Expired"
  | "Inactive";

type SecurityLevel = "Internal" | "Private" | "External";

type DialogMode = "create" | "edit" | "view";

type Status = "Active" | "Absence" | "Inactive";

type PredefinedDocument = { key: string; name: string; shortLabel?: string };
interface Document {
  document_id?: number | null;
  document_key: string;
  document_name: string;
  is_predefined: boolean;
  is_active?: boolean;
  file_url?: string | null;
  file_name?: string | null;
  mime_type?: string | null;
  security_level: SecurityLevel;
  status: DocumentStatus;
  issue_date?: string | null;
  expiration_date?: string | null;
  notes?: string | null;
}
interface WorkerSummary {
  worker_id: number;
  first_name: string;
  last_name_1: string;
  full_name: string;
}

export type {
  PredefinedDocument,
  Document,
  DocumentStatus,
  SecurityLevel,
  DialogMode,
  Status,
  WorkerSummary,
};
