import { ApiResponse, VehicleSummary } from "@/types";
import { apiRequest, getAuthHeaders, METHODS } from "./api";

const VEHICLES_URL = "/vehicles";

const getVehicles = async (token: string) =>
  apiRequest<ApiResponse<VehicleSummary[]>>({
    url: VEHICLES_URL,
    method: METHODS.GET,
    headers: getAuthHeaders(token),
  });

export { getVehicles };
