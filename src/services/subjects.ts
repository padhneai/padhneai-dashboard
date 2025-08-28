"use server";
import apiClient from "@/config/apiClient";

// Get all subjects
export const getAllSubjects = async () => {
  try {
    const { data } = await apiClient.get("/subjects/");
    return data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Create new subject
export const createSubject = async (payload: any) => {
  try {
    const { data } = await apiClient.post("/subjects/", payload);
    return data;
  } catch (error: any) {
    console.log(error.response.data)
    throw new Error(error.message);
  }
};
