"use server"
import apiClient from "@/config/apiClient";

// Get all dashboard analytics
export const getDashboadAnalytics = async () => {
  try {
    const { data } = await apiClient.get("/dashboard/stats/");
    return data;
  } catch (error: any) {
        throw new Error(error.message);

  }
};
// Get Each subject Analytics
export const getEachSubjectAnalytics = async () => {
  try {
    const { data } = await apiClient.get("/dashboard/subjects/analytics");
    return data;
  } catch (error: any) {
        throw new Error(error.message);

  }
};
