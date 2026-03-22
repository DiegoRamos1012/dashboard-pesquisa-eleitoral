import axios, { AxiosError } from "axios";

import type { ApiErrorResponse } from "./contracts";

const DEFAULT_BASE_URL = "http://localhost:8080";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? DEFAULT_BASE_URL,
  timeout: 60000,
});

export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    const responseMessage = axiosError.response?.data?.message;

    if (responseMessage) {
      return responseMessage;
    }

    if (axiosError.response?.status) {
      return `A API retornou erro ${axiosError.response.status}. Tente novamente.`;
    }

    if (axiosError.message) {
      return axiosError.message;
    }
  }

  return "Não foi possível concluir a operação. Verifique sua conexão e tente novamente.";
}
