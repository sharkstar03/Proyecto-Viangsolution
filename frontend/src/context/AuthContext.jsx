import React, { createContext, useContext, useState } from 'react';
import axios from '../axiosConfig';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (formData, config = {}) => {
    const response = await axios.post('/api/auth/login', formData, config);
    setUser(response.data.user);
    return response.data;
  };

  const register = async (formData, config = {}) => {
    const response = await axios.post('/api/auth/register', formData, config);
    setUser(response.data.user);
    return response.data;
  };

  const value = {
    user,
    login,
    register
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
