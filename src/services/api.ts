import axios, { type AxiosRequestConfig } from "axios";

const METHODS = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE",
};

const LOCAL_API_URL = "http://localhost:4000/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL || LOCAL_API_URL;

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const getApiErrorMessage = (error: unknown, fallback = "Request failed") => {
  if (axios.isAxiosError(error)) {
    const responseMessage =
      (error.response?.data as { message?: string } | undefined)?.message ||
      error.message;

    return responseMessage || fallback;
  }

  if (error instanceof Error) return error.message;

  return fallback;
};

const apiRequest = async <T>(config: AxiosRequestConfig): Promise<T> => {
  try {
    const response = await apiClient.request<T>(config);
    return response.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
};

const getAuthHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
});

export {
  METHODS,
  API_URL,
  apiClient,
  apiRequest,
  getApiErrorMessage,
  getAuthHeaders,
};
