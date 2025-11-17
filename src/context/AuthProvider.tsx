import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

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

  // ====================================
  // 🔥 Refresh access token
  // ====================================
  const refreshAccessToken = async (): Promise<boolean> => {
    try {
      const res = await fetch(`${SERVER}/api/v1/user/refreshAccessToken`, {
        method: "POST",
        credentials: "include",
      });

      return res.ok;
    } catch {
      return false;
    }
  };

  // ====================================
  // 🔥 Check login state on page load
  // ====================================
  useEffect(() => {
    const checkAuth = async () => {
      try {
        let res = await fetch(`${SERVER}/api/v1/user/me`, {
          method: "GET",
          credentials: "include",
        });

        // ⚠️ If access token expired, refresh it
        if (res.status === 401) {
          const refreshed = await refreshAccessToken();

          if (!refreshed) {
            setUser(null);
            return;
          }

          // Retry the /me request after refreshing
          res = await fetch(`${SERVER}/api/v1/user/me`, {
            method: "GET",
            credentials: "include",
          });
        }

        if (res.ok) {
          const data = await res.json();
          setUser(data); // /me returns user directly
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // ====================================
  // 🔥 Login
  // ====================================
  const login = async (username: string, password: string) => {
    try {
      const res = await fetch(`${SERVER}/api/v1/user/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) return false;

      const data = await res.json();
      setUser(data.data); // your backend sends user in data.data
      return true;
    } catch {
      return false;
    }
  };

  // ====================================
  // 🔥 Logout
  // ====================================
  const logout = async () => {
    await fetch(`${SERVER}/api/v1/user/logout`, {
      method: "POST",
      credentials: "include",
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
