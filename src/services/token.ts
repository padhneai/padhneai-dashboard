"use server"
import apiClient from "@/config/apiClient";

// create Token
export const createToken = async () => {
  try {
    const { data } = await apiClient.post("/token/");
    return data;
  } catch (error: any) {
    return error.message;
  }
};


// create Access Token
export const createAccessToken = async () => {
  try {
    const { data } = await apiClient.post("/token/refresh/");
    return data;
  } catch (error: any) {
    return error.message;
  }
};