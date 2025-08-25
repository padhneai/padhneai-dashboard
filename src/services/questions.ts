"use server";
import apiClient from "@/config/apiClient";

// Get all questions
export const getAllQuestions = async () => {
  try {
    const { data } = await apiClient.get("/papers/questions/");
    return data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Get question by ID
export const getQuestionById = async (id: number) => {
  try {
    const { data } = await apiClient.get(`/papers/questions/${id}/`);
    return data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Create question
export const createQuestion = async (payload: any) => {
  try {
    const { data } = await apiClient.post("/papers/questions/all/", payload);
    return data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Update question
export const updateQuestion = async (id: number, payload: any) => {
  try {
    const { data } = await apiClient.put(`/papers/questions/${id}/`, payload);
    return data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Delete question
export const deleteQuestion = async (id: number) => {
  try {
    const { data } = await apiClient.delete(`/papers/questions/${id}/`);
    return data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
