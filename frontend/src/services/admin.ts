import { api } from "@/lib/api";
import { AdminStats, Issue } from "@/types";

export interface StatsResponse {
  success: boolean;
  data: AdminStats;
}

export interface StatusUpdateResponse {
  success: boolean;
  message: string;
  data: Issue;
}

export const adminService = {
  getStats: async (): Promise<AdminStats> => {
    const response = await api.get<StatsResponse>("/admin/stats");
    return response.data.data;
  },

  updateIssueStatus: async (id: string, status: string): Promise<Issue> => {
    const response = await api.patch<StatusUpdateResponse>(
      `/admin/issues/${id}/status`,
      { status }
    );
    return response.data.data;
  },
};
