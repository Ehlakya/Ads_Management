import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser && storedUser !== 'undefined') {
        setUser(JSON.parse(storedUser));
      } else {
        localStorage.removeItem('user'); // cleanup bad state
      }
    } catch (error) {
      console.error('Failed to parse user from local storage:', error);
      localStorage.removeItem('user'); // remove corrupted data
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', userData.token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const loginTheatreUser = async (credentials) => {
    const data = await authService.loginTheatre(credentials);
    login(data);
  };

  const registerTheatreUser = async (userData) => {
    const data = await authService.registerTheatre(userData);
    // don't login automatically according to UI flow, just return data
    return data;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, loginTheatreUser, registerTheatreUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
