"use server"
import apiClient from "@/config/apiClient";
import { revalidatePath } from "next/cache";

// Get all classes
export const getAllClasses = async () => {
  try {
    const { data } = await apiClient.get("/classes/");
    return data;
  } catch (error: any) {
        throw new Error(error.message);

  }
};





// Create new class


export const createClass = async (payload: any) => {
  try {
    const { data } = await apiClient.post("/classes/", payload);

    // ✅ Invalidate cache for the page where classes are listed
    revalidatePath("/classes"); // <-- use the actual route

    return data;
  } catch (error: any) {
    console.error(error);
        throw new Error(error.message);

  }
};

