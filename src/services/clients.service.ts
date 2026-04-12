import { ApiResponse, ClientSummary } from "@/types";
import { apiRequest, getAuthHeaders, METHODS } from "./api";

const CLIENTS_URL = "/clients";

const getClients = async (token: string) =>
  apiRequest<ApiResponse<ClientSummary[]>>({
    url: CLIENTS_URL,
    method: METHODS.GET,
    headers: getAuthHeaders(token),
  });

export { getClients };
