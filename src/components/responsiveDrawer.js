import * as React from 'react';
import { useState } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Link,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const ResponsiveDrawer = () => {
  const [open, setOpen] = useState(false);
  const [anchorElTools, setAnchorElTools] = useState(null);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleToolsClick = (event) => {
    setAnchorElTools(event.currentTarget);
  };

  const handleToolsClose = () => {
    setAnchorElTools(null);
  };

  return (
    <div>
      <IconButton
        size="large"
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleDrawerOpen}
        color="inherit"
      >
        <MenuIcon />
      </IconButton>
      <Drawer anchor="left" open={open} onClose={handleDrawerClose}>
        <Box
          sx={{
            width: 250,
            padding: '16px',
          }}
        >
          <Typography variant="h6" gutterBottom>
            Fansvor.ru
          </Typography>
          <List>
            <ListItem component={Link} to="/" onClick={handleDrawerClose}>
              <ListItemText primary="Главная" />
            </ListItem>
            <ListItem component={Link} to="/about" onClick={handleDrawerClose}>
              <ListItemText primary="О компании" />
            </ListItem>
          </List>

          <ListItem onClick={handleToolsClick}>
            <ListItemText primary="Инструменты" />
          </ListItem>

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
      </Drawer>
    </div>
  );
};

export default ResponsiveDrawer;