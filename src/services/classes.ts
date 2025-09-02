"use server"
import apiClient from "@/config/apiClient";
import { revalidatePath } from "next/cache";

// Get all classes
export const getAllClasses = async () => {
  try {
    const { data } = await apiClient.get("/classes/");
    return data;
  } catch (error: any) {
        // throw new Error(error.message);
        return null;

  }
};





// Create new class


export const createClass = async (payload: any) => {
  try {
    const { data } = await apiClient.post("/classes/", payload);

    // ✅ Invalidate cache for the page where classes are listed
    revalidatePath("/"); // <-- use the actual route

    return data;
  } catch (error: any) {
    console.log(error);
        throw new Error(error.message);

  }
};
// update  class


export const updateClass = async (id:number,payload: any) => {
  try {
    const { data } = await apiClient.patch(`/classes/${id}/`, payload);

    // ✅ Invalidate cache for the page where classes are listed
    revalidatePath("/"); // <-- use the actual route

    return data;
  } catch (error: any) {
    console.error(error.response);
        throw new Error(error.message);

  }
};
// delete  class


export const deleteClass = async (id:number) => {
  console.log(id)
  try {
    const { data } = await apiClient.delete(`/classes/${id}/`);

    // ✅ Invalidate cache for the page where classes are listed
    revalidatePath("/"); // <-- use the actual route

    return data;
  } catch (error: any) {
    console.error(error);
        throw new Error(error.message);

  }
};

