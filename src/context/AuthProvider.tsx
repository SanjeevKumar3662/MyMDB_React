import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { authFetch } from "../utils/authFetch";

interface User {
  _id: string;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAuthenticated: false,
  login: async () => false,
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const SERVER = import.meta.env.VITE_SERVER_URI;

  //  Check login state on page load

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      // 1) FIRST try refreshing token silently
      const refreshRes = await fetch(
        `${SERVER}/api/v1/user/refreshAccessToken`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      // 2) If refresh fails → user is logged out
      if (!refreshRes.ok) {
        if (isMounted) {
          setUser(null);
          setLoading(false);
        }
        return;
      }

      // 3) Now call /me with the new access token
      const { ok, data } = await authFetch<User>(`${SERVER}/api/v1/user/me`);

      if (isMounted) {
        if (ok && data) {
          setUser(data);
        } else {
          setUser(null);
        }

        setLoading(false);
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  //  Login

  const login = async (username: string, password: string) => {
    const { ok, data } = await authFetch<{ data: User }>(
      `${SERVER}/api/v1/user/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      }
    );

    if (!ok || !data) return false;

    setUser(data.data);
    return true;
  };

  // Logout

  const logout = async () => {
    await authFetch(`${SERVER}/api/v1/user/logout`, {
      method: "POST",
    });

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
