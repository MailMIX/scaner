import React from 'react';
import { Grid, Typography, Box, styled } from '@mui/material';
import logo from './logo.svg'; //  Импортируйте  ваш  SVG-файл
import { Link } from 'react-router-dom'; //  Импортируйте  Link

const StyledLogo = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  // textDecoration: 'none', //  Убираем  подчеркивание  ссылки  (не  нужно  здесь)
  [theme.breakpoints.up('md')]: {
    justifyContent: 'flex-start',
  },
  [theme.breakpoints.down('md')]: {
    justifyContent: 'center',
  },
  cursor: 'pointer', //  Добавляем  курсор-указатель
}));

const StyledImage = styled('img')({
  width: 80,  //  Уменьшаем  размер  изображения
  marginRight: 20,
  marginTop: 10, //  Добавляем  верхний  отступ
  marginBottom: 10, //  Добавляем  нижний  отступ
});

const Logo = () => {
  return (
    <Link to="/" style={{ textDecoration: 'none' }}> {/*  Добавляем  стиль  к  Link  */}
      <StyledLogo>
        <StyledImage src={logo} alt="logo" />
        <Grid container alignItems="center" direction="column">
          <Grid item>
            <Typography variant="h4" fontWeight="bold" sx={{
              background: 'linear-gradient(90deg, #fdd9b5, #b6a492)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text', 
              color: 'transparent' 
            }}> 
              FANSVOR
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="body1" color="white">
              Межбиржевой арбитраж
            </Typography>
          </Grid>
        </Grid>
      </StyledLogo>
    </Link>
  );
};

export default Logo;