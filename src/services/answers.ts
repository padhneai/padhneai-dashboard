"use server"
import apiClient from "@/config/apiClient";

// Get all answer sheets
export const getAllAnswerSheets = async () => {
  try {
    const { data } = await apiClient.get("/papers/answersheets/");
    return data;
  } catch (error: any) {
        throw new Error(error.message);

  }
};

// Get answer sheet by ID
export const getAnswerSheetById = async (id: number) => {
  try {
    const { data } = await apiClient.get(`/papers/answersheets/${id}/`);
    return data;
  } catch (error: any) {
        throw new Error(error.message);

  }
};

// Create answer sheet
export const createAnswerSheet = async (payload: any) => {
  try {
    const { data } = await apiClient.post("/papers/answersheets/", payload);
    return data;
  } catch (error: any) {
        throw new Error(error.message);

  }
};

// Update answer sheet
export const updateAnswerSheet = async (id: number, payload: any) => {
  try {
    const { data } = await apiClient.put(`/papers/answersheets/${id}/`, payload);
    return data;
  } catch (error: any) {
        throw new Error(error.message);

  }
};

// Delete answer sheet
export const deleteAnswerSheet = async (id: number) => {
  try {
    const { data } = await apiClient.delete(`/papers/answersheets/${id}/`);
    return data;
  } catch (error: any) {
        throw new Error(error.message);

  }
};
