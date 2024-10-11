import React, { useState, useContext } from 'react';
import { TextField, Button, Typography, Box, Grid } from '@mui/material';
// import AuthContext from '../authContext';  //  Удаляем  импорт  AuthContext
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // const { login } = useContext(AuthContext);  //  Удаляем  login
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', { username, email, password }); 
      localStorage.setItem('token', response.data.token); //  Сохраняем  токен  в  localStorage
      navigate('/login'); //  Переходим  на  страницу  входа
    } catch (error) {
      console.error('Ошибка  регистрации:', error);
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Typography variant="h4" gutterBottom>
            Регистрация
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Имя пользователя"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              Зарегистрироваться
            </Button>
          </form>
        </Grid>
      </Grid>
    </Box>
  );
};

export default RegisterPage;