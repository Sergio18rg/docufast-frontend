import { apiRequest, getAuthHeaders, METHODS } from "./api";
import type {
  ApiResponse,
  DocumentUploadPayload,
  Worker,
  WorkerPayload,
} from "@/types";

const WORKERS_URL = "/workers";

const getWorkers = async (token: string) =>
  apiRequest<ApiResponse<Worker[]>>({
    url: WORKERS_URL,
    method: METHODS.GET,
    headers: getAuthHeaders(token),
  });

const createWorker = async (token: string, payload: WorkerPayload) =>
  apiRequest<ApiResponse<Worker>>({
    url: WORKERS_URL,
    method: METHODS.POST,
    headers: getAuthHeaders(token),
    data: payload,
  });

const updateWorker = async (
  token: string,
  workerId: number,
  payload: WorkerPayload,
) =>
  apiRequest<ApiResponse<Worker>>({
    url: `${WORKERS_URL}/${workerId}`,
    method: METHODS.PUT,
    headers: getAuthHeaders(token),
    data: payload,
  });

const deleteWorker = async (token: string, workerId: number) =>
  apiRequest<ApiResponse<null>>({
    url: `${WORKERS_URL}/${workerId}`,
    method: METHODS.DELETE,
    headers: getAuthHeaders(token),
  });

const uploadWorkerDocument = async (
  token: string,
  payload: DocumentUploadPayload,
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

  if (payload.document.worker_document_id)
    formData.append(
      "replaceDocumentId",
      String(payload.document.worker_document_id),
    );

  return apiRequest<ApiResponse<Worker>>({
    url: `${WORKERS_URL}/${payload.workerId}/documents/upload`,
    method: METHODS.POST,
    headers: {
      ...getAuthHeaders(token),
      "Content-Type": "multipart/form-data",
    },
    data: formData,
  });
};

const restoreWorker = async (token: string, workerId: number) =>
  apiRequest<ApiResponse<null>>({
    url: `${WORKERS_URL}/${workerId}/restore`,
    method: METHODS.POST,
    headers: getAuthHeaders(token),
  });

const removeWorkerDocument = async (
  token: string,
  workerId: number,
  workerDocumentId: number,
) =>
  apiRequest<ApiResponse<Worker>>({
    url: `${WORKERS_URL}/${workerId}/documents/${workerDocumentId}`,
    method: METHODS.DELETE,
    headers: getAuthHeaders(token),
  });

export {
  getWorkers,
  createWorker,
  updateWorker,
  deleteWorker,
  uploadWorkerDocument,
  removeWorkerDocument,
  restoreWorker,
};
