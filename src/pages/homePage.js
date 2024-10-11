import React, { useContext } from 'react';
import { Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import AuthContext from '../authContext'; // Импортируйте контекст AuthContext

function HomePage() {
  const { isAuthenticated, user } = useContext(AuthContext); 

  return (
    <div>
      {isAuthenticated ? (
        <Typography variant="h4" gutterBottom>
          С возвращением, {user.username}!
        </Typography>
      ) : (
        <>
          <Typography variant="h4" gutterBottom>
            Добро пожаловать на Fansvor.ru!
          </Typography>
          <Typography variant="body1" gutterBottom>
            Fansvor.ru - это платформа, которая предоставляет инструменты для заработка на криптовалюте.
          </Typography>
          <Button variant="contained" component={Link} to="/register">
            Зарегистрироваться сейчас
          </Button>
        </>
      )}
    </div>
  );
}

export default HomePage;