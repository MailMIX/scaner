import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#303541', // Основной  цвет  (синий)
      contrastText: '#fff', // Цвет  текста  для  первичного  цвета
    },
    secondary: {
      main: '#FFC107', // Вторичный  цвет  (желтый)
      contrastText: '#fff', // Цвет  текста  для  вторичного  цвета
    },
    background: {
      default: '#1f2229', // Цвет  фона  по  умолчанию
    },
    text: {
      primary: '#212121', // Основной  цвет  текста
      secondary: '#757575', // Вторичный  цвет  текста
    },
  },
  typography: {
    fontFamily: 'Tahoma', //  Измените  основной  шрифт
    h1: {
      fontSize: '3rem',
    },
    h2: {
      fontSize: '2.5rem',
    },
    body1: {
      fontSize: '1.1rem',
    },
  },
});

export default theme;