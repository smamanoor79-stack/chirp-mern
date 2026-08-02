import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { api } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user') || 'null');
    } catch {
      return null;
    }
  });

  const saveSession = useCallback((data) => {
    const nextUser = { _id: data._id, name: data.name, email: data.email };
    setToken(data.token);
    setUser(nextUser);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(nextUser));
  }, []);

  const updateUser = useCallback((patch) => {
    setUser((prev) => {
      const next = { ...prev, ...patch };
      localStorage.setItem('user', JSON.stringify(next));
      return next;
    });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  }, []);

  // once logged in, fetch full profile (bio, profilePicture) so it persists across logins
  useEffect(() => {
    if (!token || !user) return;
    api
      .getMe(token)
      .then((full) => {
        updateUser({ bio: full.bio, profilePicture: full.profilePicture });
      })
      .catch(() => {
        /* non-fatal: fall back to initials */
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, user, saveSession, updateUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
