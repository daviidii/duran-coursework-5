import { useAuth } from "~/composables/useAuth";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const { isAuthenticated, refreshToken } = useAuth();

  const publicRoutes = ["/", "/register"];

  if (publicRoutes.includes(to.path)) {
    return;
  }

  if (!isAuthenticated.value) {
    try {
      await refreshToken();
    } catch (error) {
      const msg =
        error instanceof Error ? error.message : "refresh token error";

      console.error("Auth error >>> ", msg);
      return navigateTo("/");
    }
  }

  if (!isAuthenticated.value && to.path !== "/") {
    return navigateTo("/");
  }
});
