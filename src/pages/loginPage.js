import React, { useState, useContext } from 'react';
import { TextField, Button, Typography, Box, Grid } from '@mui/material';
import AuthContext from '../authContext'; 
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // импортируем axios

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem('token'); //  Извлекаем  токен
      await login(username, password, token); //  Передаем  токен  в  метод  login
      navigate('/profile'); 
    } catch (error) {
      console.error('Ошибка  авторизации:', error);
    }
  };
  
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Typography variant="h4" gutterBottom>
            Вход
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Логин"
              type="text"  //  Измените  тип  на  text
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Пароль"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
            />
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Войти
            </Button>
          </form>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LoginPage;