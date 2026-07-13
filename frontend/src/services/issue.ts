import { api } from "@/lib/api";
import { Issue } from "@/types";

export const issueService = {
  createIssue: async (formData: FormData): Promise<Issue> => {
    // Content-Type is automatically set by Axios when passing FormData
    const response = await api.post<Issue>("/issues", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  getIssues: async (): Promise<Issue[]> => {
    const response = await api.get<Issue[]>("/issues");
    return response.data;
  },
};
