import React, { useContext, useEffect, useState } from 'react';
import { Typography, Box, Button, Grid, TextField } from '@mui/material';
import AuthContext from '../authContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; //  Импортируйте  navigate

const ProfilePage = () => {
  const { user, logout } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate(); //  Инициализируйте  navigate

  useEffect(() => {
    if (user) {
      // Загрузка  данных  пользователя  с  backend
      axios.get('https://api.fansvor.ru/api/users/me', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
        .then(res => {
          setUserData(res.data);
        })
        .catch(err => {
          console.error('Ошибка  загрузки  данных  пользователя:', err);
        });
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login'); //  Перенаправление  на  страницу  входа
  };

  const handleProfileUpdate = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.put('https://api.fansvor.ru/api/users/update', userData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      console.log('Профиль  обновлен:', response.data);
    } catch (error) {
      console.error('Ошибка  обновления  профиля:', error);
    }
  };

  const handleChange = (field, value) => {
    setUserData({ ...userData, [field]: value });
  };

  if (!userData) {
    return <Typography variant="h5">Загрузка  профиля...</Typography>; 
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="h4" gutterBottom>
            Профиль
          </Typography>
          <form onSubmit={handleProfileUpdate}>
            <TextField
              fullWidth
              label="Имя"
              value={userData.username}
              onChange={(e) => handleChange('username', e.target.value)}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={userData.email}
              disabled
              margin="normal"
            />
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Обновить  профиль
            </Button>
          </form>
          <Button variant="contained" color="secondary" fullWidth onClick={handleLogout}>
            Выйти
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProfilePage;