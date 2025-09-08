"use server";
import apiClient from "@/config/apiClient";

// ====================== PAPERS ======================




// Get all papers
export const getAllPapers = async () => {
  try {
    const { data } = await apiClient.get("/papers/");
    return data;
  } catch (error: any) {
    // throw new Error(error.message);
    return null;
  }
};

// Get paper by ID
export const getPaperById = async (id: number) => {
  try {
    const { data } = await apiClient.get(`/papers/${id}/`);
    return data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Create new paper
export const createPaper = async (payload: any) => {
  console.log(payload)
  try {
    const { data } = await apiClient.post("/papers/", payload);
// console.log(data)
    return data;
  } catch (error: any) {
    console.log(error.response)
    throw new Error(error.message);
  }
};





// Update paper
export const updatePaper = async (id: number, payload: any) => {
  try {
    const { data } = await apiClient.put(`/papers/${id}/`, payload);
    return data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Partial update paper
export const partialUpdatePaper = async (id: number, payload: any) => {
  try {
    const { data } = await apiClient.patch(`/papers/${id}/`, payload);
    return data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Delete paper
export const deletePaper = async (id: number) => {
  try {
    const { data } = await apiClient.delete(`/papers/${id}/`);
    return data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Get papers with filter
export const getFilteredPapers = async (params?: Record<string, any>) => {
  try {
    const { data } = await apiClient.get("/papers/filter/", { params });
    return data;
  } catch (error: any) {
    // throw new Error(error.message);
    return null;
   
}
};

// Get paper by slug
export const getPaperBySlug = async (slug: string) => {
  try {
    const { data } = await apiClient.get(`/papers/${slug}/`);
    return data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// English papers
export const getEnglishPapers = async () => {
  try {
    const { data } = await apiClient.get("/papers/english/");
    return data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Nepali papers
export const getNepaliPapers = async () => {
  try {
    const { data } = await apiClient.get("/papers/nepali/");
    return data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// ====================== ANSWER SHEETS ======================

export const getAllAnswerSheets = async () => {
  try {
    const { data } = await apiClient.get("/papers/answersheets/");
    return data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const getAnswerSheetById = async (id: number) => {
  try {
    const { data } = await apiClient.get(`/papers/answersheets/${id}/`);
    return data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const createAnswerSheet = async (payload: any) => {
  try {
    const { data } = await apiClient.post("/papers/answersheets/", payload);
    return data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const updateAnswerSheet = async (id: number, payload: any) => {
  try {
    const { data } = await apiClient.put(`/papers/answersheets/${id}/`, payload);
    return data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const partialUpdateAnswerSheet = async (id: number, payload: any) => {
  try {
    const { data } = await apiClient.patch(`/papers/answersheets/${id}/`, payload);
    return data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const deleteAnswerSheet = async (id: number) => {
  try {
    const { data } = await apiClient.delete(`/papers/answersheets/${id}/`);
    return data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// ====================== QUESTIONS ======================

export const getAllQuestions = async () => {
  try {
    const { data } = await apiClient.get("/papers/questions/");
    return data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const getAllQuestionsWithLanguage = async () => {
  try {
    const { data } = await apiClient.get("/papers/questions/all/");
    return data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const createQuestion = async (payload: any) => {
  try {
    const { data } = await apiClient.post("/papers/questions/all/", payload);
    return data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const getQuestionById = async (id: number) => {
  try {
    const { data } = await apiClient.get(`/papers/questions/${id}/`);
    return data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const updateQuestion = async (id: number, payload: any) => {
  try {
    const { data } = await apiClient.put(`/papers/questions/${id}/`, payload);
    return data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const partialUpdateQuestion = async (id: number, payload: any) => {
  try {
    const { data } = await apiClient.patch(`/papers/questions/${id}/`, payload);
    return data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const deleteQuestion = async (id: number) => {
  try {
    const { data } = await apiClient.delete(`/papers/questions/${id}/`);
    return data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
