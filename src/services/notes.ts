"use server";
import apiClient from "@/config/apiClient";

// ====================== NOTES CONTENTS ======================

// Get all notes contents
export const getAllNotes = async () => {
  try {
    const { data } = await apiClient.get("/notes/contents/");
    return data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Get note content by ID
export const getNoteById = async (id: number) => {
  try {
    const { data } = await apiClient.get(`/notes/contents/${id}/`);
    console.log(data)
    return data;
  } catch (error: any) {
    console.log(error.response)
    throw new Error(error.message);
  }
};

// Get note content by slug
export const getNoteBySlug = async (slug: string) => {
  try {
    const { data } = await apiClient.get(`/notes/content/${slug}/`);
    return data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Create new note content
export const createNote = async (payload: Record<string, any>) => {
  try {
    const formData = new FormData();

    Object.entries(payload).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        // Handle arrays (e.g., multiple files or tags)
        value.forEach((v) => formData.append(key, v));
      } else {
        formData.append(key, value);
      }
    });

    const { data } = await apiClient.post("/notes/contents/", formData);
    return data;
  } catch (error: any) {
    throw new Error(error.response?.data?.detail || error.message);
  }
};

// Update note content
export const updateNote = async (id: number, payload: any) => {
 
  try {
    const { data } = await apiClient.put(`/notes/contents/${id}/`, payload);
    return data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Partial update note content
export const partialUpdateNote = async (id: number, payload: any) => {
   console.log(id,payload)
  try {
    const { data } = await apiClient.patch(`/notes/contents/${id}/`, payload);
    return data;
  } catch (error: any) {
    console.log(error.response?.data)

    throw new Error(error.message);
  }
};

// Delete note content
export const deleteNote = async (id: number) => {
  try {
    const { data } = await apiClient.delete(`/notes/contents/${id}/`);
    return data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// ====================== TOC (Table of Contents) ======================

// Get all TOC
export const getAllTOC = async () => {
  try {
    const { data } = await apiClient.get("/notes/toc/");
    return data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Get TOC by ID
export const getTOCById = async (id: number) => {
  try {
    const { data } = await apiClient.get(`/notes/toc/${id}/`);
    return data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Get filtered TOC
export const getFilteredTOC = async (params?: Record<string, any>) => {
  try {
    const { data } = await apiClient.get("/notes/toc/filter/", { params });
    return data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Create new TOC
export const createTOC = async (payload: any) => {
  try {
    const { data } = await apiClient.post("/notes/toc/", payload);
    return data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Update TOC
export const updateTOC = async (id: number, payload: any) => {
  try {
    const { data } = await apiClient.put(`/notes/toc/${id}/`, payload);
    return data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Partial update TOC
export const partialUpdateTOC = async (id: number, payload: any) => {
  try {
    const { data } = await apiClient.patch(`/notes/toc/${id}/`, payload);
    return data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Delete TOC
export const deleteTOC = async (id: number) => {
  try {
    const { data } = await apiClient.delete(`/notes/toc/${id}/`);
    return data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
