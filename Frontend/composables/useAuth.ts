import { useCookie, useRuntimeConfig } from "#app";
import type { AuthResponse, User } from "~/types/types";

export const useAuth = () => {
  const config = useRuntimeConfig();
  const baseURL = "http://localhost:5000/auth";

  const user = useState<User | null>("user", () => null);
  const accessToken = useCookie<string | null>("accessToken");
  const isAuthenticated = computed(() => !!user.value);

  const initAuth = async () => {
    if (accessToken.value) {
      try {
        const userData = await verifyToken();
        user.value = userData;
      } catch (error) {
        try {
          await refreshToken();
        } catch (error) {
          console.error("init auth error >>> ", error);
          user.value = null;
          accessToken.value = null;
        }
      }
    }
  };

  const verifyToken = async (): Promise<User> => {
    try {
      const response = await $fetch<AuthResponse>(`${baseURL}/verifyToken`, {
        credentials: "include",
      });

      return response.user;
    } catch (error: any) {
      throw new Error(error.data?.message);
    }
  };

  const register = async (
    username: string,
    email: string,
    pass: string
  ): Promise<AuthResponse> => {
    try {
      const response = await $fetch<AuthResponse>(`${baseURL}/register`, {
        method: "POST",
        body: { username, email, pass },
        credentials: "include",
      });

      user.value = response.user;
      return response;
    } catch (error: any) {
      throw new Error(error.data?.message || "Registration failed");
    }
  };

  const login = async (email: string, pass: string): Promise<AuthResponse> => {
    try {
      const response = await $fetch<AuthResponse>(`${baseURL}/login`, {
        method: "POST",
        body: { email, pass },
        credentials: "include",
      });

      user.value = response.user;
      return response;
    } catch (error: any) {
      throw new Error(error.data?.message || "Login failed");
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await $fetch("/logout", {
        method: "POST",
        credentials: "include",
      });
      user.value = null;
    } catch (error) {
      throw new Error("Logout failed");
    }
  };

  const refreshToken = async (): Promise<void> => {
    try {
      const response = await $fetch<AuthResponse>(`${baseURL}/refresh`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      user.value = response.user;
    } catch (error) {
      console.error("refresh token error >>> ", error);
      throw new Error("Token refresh failed");
    }
  };

  initAuth();

  return {
    user,
    isAuthenticated,
    register,
    login,
    logout,
    refreshToken,
    initAuth,
  };
};
