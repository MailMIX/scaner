import * as React from 'react';
import { useContext } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import { Link, useNavigate } from 'react-router-dom';
import Logo from './logo'; //  Импортируйте  логотип
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AuthContext from '../authContext'; // Импортируйте  контекст

// const pages = ['Главная', 'О компании', 'Инструменты'];  // Удаляем  pages 
const settings = ['Профиль', 'Выход'];

function ResponsiveAppBar() {
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [anchorElTools, setAnchorElTools] = React.useState(null);
  const navigate = useNavigate();

  const { isAuthenticated, user, logout } = useContext(AuthContext); 

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleToolsClick = (event) => {
    setAnchorElTools(event.currentTarget);
  };

  const handleToolsClose = () => {
    setAnchorElTools(null);
  };

  const handleCloseNavMenu = () => {
    // ...
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Logo />
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, 
                    ml: '25%', //  Отступ  слева  50%
                    mr: '25%' //  Отступ  справа  50%
                   }}>
            <Button
              key="Главная"
              onClick={handleCloseNavMenu}
              sx={{ my: 2, color: 'white', display: 'block' }}
              component={Link}
              to="/"
            >
              Главная
            </Button>
            <Button
              key="О компании"
              onClick={handleCloseNavMenu}
              sx={{ my: 2, color: 'white', display: 'block' }}
              component={Link}
              to="/about"
            >
              О компании
            </Button>

          {/* Меню "Инструменты" */}
            <Button 
            aria-controls="simple-menu" 
            aria-haspopup="true" 
            onClick={handleToolsClick} 
            sx={{ my: 2, color: 'white', display: 'block' }}> 
              Инструменты
            </Button>
            <Menu
              id="simple-menu"
              anchorEl={anchorElTools}
              keepMounted
              open={Boolean(anchorElTools)}
              onClose={handleToolsClose}
            >
              <MenuItem component={Link} to="/scanner" onClick={handleToolsClose}>
                Межбиржевой Сканер
              </MenuItem>
            </Menu>
          
          </Box>

          {/*  Размещаем  профиль  или  иконку  в  конце  строки  */}
          {isAuthenticated ? ( //  Проверяем  аутентификацию
            <Box sx={{ flexGrow: 0, display: { xs: 'none', md: 'flex' } }}> {/*  Добавляем  display  */}
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt={user.username} src={user.avatar} />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem component={Link} to="/profile" onClick={handleCloseUserMenu}>
                  <Typography textAlign="center">Профиль</Typography>
                </MenuItem>
                <MenuItem onClick={logout}>Выход</MenuItem> {/*  Добавляем  элемент  Выход  */}
              </Menu>
            </Box>
          ) : (
            <Box sx={{ flexGrow: 0, display: { xs: 'none', md: 'flex' } }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <AccountCircleIcon /> {/*  Используем  иконку  AccountCircleIcon  */}
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem onClick={() => navigate('/register')}>
                  <Typography textAlign="center">Зарегистрироваться</Typography>
                </MenuItem>
                <MenuItem onClick={() => navigate('/login')}>
                  <Typography textAlign="center">Войти</Typography>
                </MenuItem>
              </Menu>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;