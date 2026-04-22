import { apiRequest, getAuthHeaders, METHODS } from "./api";
import type {
  ApiResponse,
  ClientDocument,
  ClientPayload,
  ClientSummary,
} from "@/types";

const CLIENTS_URL = "/clients";

const getClients = async (token: string) =>
  apiRequest<ApiResponse<ClientSummary[]>>({
    url: CLIENTS_URL,
    method: METHODS.GET,
    headers: getAuthHeaders(token),
  });

const createClient = async (token: string, payload: ClientPayload) =>
  apiRequest<ApiResponse<ClientSummary>>({
    url: CLIENTS_URL,
    method: METHODS.POST,
    headers: getAuthHeaders(token),
    data: payload,
  });

const updateClient = async (
  token: string,
  clientId: number,
  payload: ClientPayload,
) =>
  apiRequest<ApiResponse<ClientSummary>>({
    url: `${CLIENTS_URL}/${clientId}`,
    method: METHODS.PUT,
    headers: getAuthHeaders(token),
    data: payload,
  });

const deleteClient = async (token: string, clientId: number) =>
  apiRequest<ApiResponse<null>>({
    url: `${CLIENTS_URL}/${clientId}`,
    method: METHODS.DELETE,
    headers: getAuthHeaders(token),
  });

const restoreClient = async (token: string, clientId: number) =>
  apiRequest<ApiResponse<ClientSummary>>({
    url: `${CLIENTS_URL}/${clientId}/restore`,
    method: METHODS.POST,
    headers: getAuthHeaders(token),
  });

const uploadClientDocument = async (
  token: string,
  payload: { clientId: number; document: ClientDocument; file: File },
) => {
  const formData = new FormData();
  formData.append("file", payload.file);
  formData.append("documentKey", payload.document.document_key);
  formData.append("documentName", payload.document.document_name);
  formData.append("securityLevel", payload.document.security_level);
  formData.append("issueDate", payload.document.issue_date || "");
  formData.append("expirationDate", payload.document.expiration_date || "");
  formData.append("notes", payload.document.notes || "");
  formData.append("isPredefined", String(payload.document.is_predefined));
  if (payload.document.client_document_id)
    formData.append(
      "replaceDocumentId",
      String(payload.document.client_document_id),
    );

  return apiRequest<ApiResponse<ClientSummary>>({
    url: `${CLIENTS_URL}/${payload.clientId}/documents/upload`,
    method: METHODS.POST,
    headers: {
      ...getAuthHeaders(token),
      "Content-Type": "multipart/form-data",
    },
    data: formData,
  });
};

const removeClientDocument = async (
  token: string,
  clientId: number,
  clientDocumentId: number,
) =>
  apiRequest<ApiResponse<ClientSummary>>({
    url: `${CLIENTS_URL}/${clientId}/documents/${clientDocumentId}`,
    method: METHODS.DELETE,
    headers: getAuthHeaders(token),
  });

export {
  getClients,
  createClient,
  updateClient,
  deleteClient,
  restoreClient,
  uploadClientDocument,
  removeClientDocument,
};
