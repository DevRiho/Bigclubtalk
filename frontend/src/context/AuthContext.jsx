import { createContext, useContext, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { authService } from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [bootstrapped, setBootstrapped] = useState(Boolean(localStorage.getItem("bct_access_token")));
  const { data: user, refetch } = useQuery({
    queryKey: ["me"],
    queryFn: authService.me,
    enabled: bootstrapped,
    retry: false
  });

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
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
      logout() {
        authService.logout();
        setBootstrapped(false);
      }
    }),
    [user, refetch]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
