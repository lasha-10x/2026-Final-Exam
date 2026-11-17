import { createContext, useCallback, useContext, useEffect, useMemo, useRef } from "react";
import { useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import type { AuthUser, ProfileForm } from "@/types/user";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { isAuthUser } from "@/utils/guards";
import { STORAGE_KEYS } from "@/utils/constants";

interface AuthContextValue {
  user: AuthUser | null;
  isLoggedIn: boolean;
  login: (username: string) => void;
  logout: () => void;
  /** True between the moment logout() is called and the navigation that follows it (see ProtectedRoute). */
  isLoggingOut: () => boolean;
  updateProfile: (profile: ProfileForm) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function isStoredUser(x: unknown): x is AuthUser | null {
  return x === null || isAuthUser(x);
}

// Login is a local simulation: no real credentials are checked, stored or sent anywhere.
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useLocalStorage<AuthUser | null>(STORAGE_KEYS.user, null, isStoredUser);

  // Set synchronously by logout(), cleared as soon as the next navigation has happened.
  // ProtectedRoute uses it to tell "the user just logged out" (the logout handler is already sending
  // them to the catalog) apart from "a guest opened a protected page" (send them to /login).
  const loggingOut = useRef(false);
  const location = useLocation();
  useEffect(() => {
    loggingOut.current = false;
  }, [location.key]);

  const login = useCallback(
    (username: string) => {
      loggingOut.current = false;
      setUser({ username, isLoggedIn: true, firstName: "", lastName: "", email: "", phone: "" });
    },
    [setUser],
  );

  const logout = useCallback(() => {
    loggingOut.current = true;
    setUser(null);
  }, [setUser]);

  const isLoggingOut = useCallback(() => loggingOut.current, []);

  const updateProfile = useCallback(
    (profile: ProfileForm) => {
      setUser((prev) => (prev === null ? prev : { ...prev, ...profile }));
    },
    [setUser],
  );

  const value = useMemo<AuthContextValue>(
    () => ({ user, isLoggedIn: user?.isLoggedIn === true, login, logout, isLoggingOut, updateProfile }),
    [user, login, logout, isLoggingOut, updateProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (ctx === null) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
