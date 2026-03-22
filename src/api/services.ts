import { apiClient } from "./client";
import type { IbgeSyncResponse, PollImportResponse } from "./contracts";

export async function syncIbge(force = true): Promise<IbgeSyncResponse> {
  const response = await apiClient.post<IbgeSyncResponse>(
    `/api/ibge/sync?force=${force}`,
  );
  return response.data;
}

export async function importPollCsv(file: File): Promise<PollImportResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await apiClient.post<PollImportResponse>(
    "/api/polls/import",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data;
}
