type DocumentStatus =
  | "Not uploaded"
  | "Valid"
  | "Expiring soon"
  | "Expired"
  | "Inactive";

type SecurityLevel = "Internal" | "Private" | "External";

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

export type { Document, DocumentStatus, SecurityLevel };
