import { apiRequest, getAuthHeaders, METHODS } from "./api";
import type { ApiResponse, Document, EntityType } from "@/types";

const AI_URL = "/ai/extract-data";

type ExtractedDocumentDates = {
  document_key: string;
  issue_date?: string | null;
  expiration_date?: string | null;
};

type ExtractionResponseData = {
  fields: Record<string, string>;
  documents: ExtractedDocumentDates[];
};

const extractDataFromDocuments = async ({
  token,
  entityType,
  documents,
  pendingFiles,
}: {
  token: string;
  entityType: EntityType;
  documents: Document[];
  pendingFiles: Record<string, File | null>;
}) => {
  const formData = new FormData();
  formData.append("entityType", entityType);
  formData.append(
    "documents",
    JSON.stringify(
      documents.map((document) => ({
        document_key: document.document_key,
        document_name: document.document_name,
        file_url: document.file_url,
        mime_type: document.mime_type,
        issue_date: document.issue_date,
        expiration_date: document.expiration_date,
        is_predefined: document.is_predefined,
      })),
    ),
  );

  Object.entries(pendingFiles).forEach(([documentKey, file]) => {
    if (file) formData.append(documentKey, file);
  });

  return apiRequest<ApiResponse<ExtractionResponseData>>({
    url: AI_URL,
    method: METHODS.POST,
    headers: {
      ...getAuthHeaders(token),
      "Content-Type": "multipart/form-data",
    },
    data: formData,
  });
};

export { extractDataFromDocuments };
