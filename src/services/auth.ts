"use server"
import apiClient from "@/config/apiClient";

// Register user
export const registerUser = async (payload: { email: string; password: string; name?: string }) => {
  try {
    const { data } = await apiClient.post("/auth/register/", payload);
    return data;
  } catch (error: any) {
        throw new Error(error.message);

  }
};

// Login user
export const loginUser = async (payload: { email: string; password: string }) => {
  try {
    const { data } = await apiClient.post("/auth/login/", payload);
    return data;
  } catch (error: any) {
    console.log(error)
        throw new Error(error.message);

  }
};

// Logout user
export const logoutUser = async () => {
  try {
    const { data } = await apiClient.post("/auth/logout/");
    return data;
  } catch (error: any) {
        throw new Error(error.message);

  }
};

// Verify OTP
export const verifyOtp = async (payload: { email: string; otp: string }) => {
  try {
    const { data } = await apiClient.post("/auth/verify-otp/", payload);
    return data;
  } catch (error: any) {
        throw new Error(error.message);

  }
};

// Google login redirect
export const googleLoginRedirect = async () => {
  try {
    const { data } = await apiClient.get("/auth/google/login/redirect/");
    return data;
  } catch (error: any) {
        throw new Error(error.message);

  }
};
