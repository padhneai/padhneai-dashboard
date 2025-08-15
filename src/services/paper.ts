import apiClient from "@/config/apiClient";


export const getAllPapers = async (): Promise<Paper[]> => {
  try {
    const { data } = await apiClient.get<Paper[]>("/papers/");
    return data;
  } catch (error: any) {
    return error.message;
  }
};

export const getPaperById = async (id: number): Promise<Paper> => {
  try {
    const { data } = await apiClient.get<Paper>(`/papers/${id}/`);
    return data;
  } catch (error: any) {
    return error.message;
  }
};

export const createPaper = async (paper: Paper): Promise<Paper> => {
  console.log(paper);
  try {
    const { data } = await apiClient.post<Paper>("/papers/", paper);
    return data;
  } catch (error: any) {
    return error.message;
  }
};

export const updatePaper = async (
  id: number,
  paper: Paper
): Promise<Paper> => {
  try {
    const { data } = await apiClient.put<Paper>(`/papers/${id}/`, paper);
    return data;
  } catch (error: any) {
    return error.message;
  }
};

export const deletePaper = async (id: number): Promise< string> => {
  try {
    await apiClient.delete(`/papers/${id}/`);
    return "Deleted successfully";
  } catch (error: any) {
    return error.message;
  }
};
