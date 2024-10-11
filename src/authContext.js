import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get('https://api.fansvor.ru/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => {
          setUser(res.data); 
          setIsAuthenticated(true);
        })
        .catch(err => {
          //  Убедитесь,  что  вы  правильно  сбрасываете  состояние  user  в  случае  ошибки 
          localStorage.removeItem('token');
          setUser(null); 
          setIsAuthenticated(false); 
        });
    }
  }, []);

  const login = async (username, password, token) => { //  Добавляем  параметр  token
    try {
      const response = await axios.post('https://api.fansvor.ru/api/auth/login', { username, password }, {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined //  Отправляем  токен,  если  он  есть
        }
      });
      localStorage.setItem('token', response.data.token); 
      setUser(response.data.user); //  Устанавливаем  user  в  состояние  AuthContext
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Ошибка  авторизации:', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;