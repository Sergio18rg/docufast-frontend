import { apiRequest, getAuthHeaders, METHODS } from "./api";
import type {
  ApiResponse,
  VehicleDocument,
  VehiclePayload,
  VehicleSummary,
} from "@/types";

const VEHICLES_URL = "/vehicles";

const getVehicles = async (token: string) =>
  apiRequest<ApiResponse<VehicleSummary[]>>({
    url: VEHICLES_URL,
    method: METHODS.GET,
    headers: getAuthHeaders(token),
  });

const createVehicle = async (token: string, payload: VehiclePayload) =>
  apiRequest<ApiResponse<VehicleSummary>>({
    url: VEHICLES_URL,
    method: METHODS.POST,
    headers: getAuthHeaders(token),
    data: payload,
  });

const updateVehicle = async (
  token: string,
  vehicleId: number,
  payload: VehiclePayload,
) =>
  apiRequest<ApiResponse<VehicleSummary>>({
    url: `${VEHICLES_URL}/${vehicleId}`,
    method: METHODS.PUT,
    headers: getAuthHeaders(token),
    data: payload,
  });

const deleteVehicle = async (token: string, vehicleId: number) =>
  apiRequest<ApiResponse<null>>({
    url: `${VEHICLES_URL}/${vehicleId}`,
    method: METHODS.DELETE,
    headers: getAuthHeaders(token),
  });

const restoreVehicle = async (token: string, vehicleId: number) =>
  apiRequest<ApiResponse<null>>({
    url: `${VEHICLES_URL}/${vehicleId}/restore`,
    method: METHODS.POST,
    headers: getAuthHeaders(token),
  });

const uploadVehicleDocument = async (
  token: string,
  payload: { vehicleId: number; document: VehicleDocument; file: File },
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

  if (payload.document.vehicle_document_id)
    formData.append(
      "replaceDocumentId",
      String(payload.document.vehicle_document_id),
    );

  return apiRequest<ApiResponse<VehicleSummary>>({
    url: `${VEHICLES_URL}/${payload.vehicleId}/documents/upload`,
    method: METHODS.POST,
    headers: {
      ...getAuthHeaders(token),
      "Content-Type": "multipart/form-data",
    },
    data: formData,
  });
};

const removeVehicleDocument = async (
  token: string,
  vehicleId: number,
  vehicleDocumentId: number,
) =>
  apiRequest<ApiResponse<VehicleSummary>>({
    url: `${VEHICLES_URL}/${vehicleId}/documents/${vehicleDocumentId}`,
    method: METHODS.DELETE,
    headers: getAuthHeaders(token),
  });

export {
  getVehicles,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  restoreVehicle,
  uploadVehicleDocument,
  removeVehicleDocument,
};
