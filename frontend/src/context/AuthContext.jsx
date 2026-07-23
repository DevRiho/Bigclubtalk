import { createContext, useContext, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { authService } from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const queryClient = useQueryClient();
  const [bootstrapped, setBootstrapped] = useState(Boolean(localStorage.getItem("bct_access_token")));
  const { data: user, refetch, isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: authService.me,
    enabled: bootstrapped,
    retry: false
  });

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      loading: bootstrapped && isLoading,
      async login(payload) {
        await authService.login(payload);
        setBootstrapped(true);
        await refetch();
      },
      async register(payload) {
        await authService.register(payload);
        setBootstrapped(true);
        await refetch();
      },
      async socialLogin(payload) {
        await authService.socialLogin(payload);
        setBootstrapped(true);
        await refetch();
      },
      async logout() {
        try {
          await authService.logout();
        } catch (error) {
          console.error("Logout request failed:", error);
        } finally {
          setBootstrapped(false);
          queryClient.setQueryData(["me"], null);
          queryClient.clear();
        }
      }
    }),
    [user, isLoading, bootstrapped, refetch, queryClient]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

