import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import ResponsiveAppBar from './components/responsiveAppBar';
import HomePage from './pages/homePage';
import AboutPage from './pages/aboutPage';
import LoginPage from './pages/loginPage';
import RegisterPage from './pages/registerPage';
import ProfilePage from './pages/profilePage';
import ScannerPage from './pages/scannerPage'; 
import SubscriptionPage from './pages/subscriptionPage'; 
import { Container } from '@mui/material'
import AuthContext, { AuthProvider } from './authContext'; //  Импортируйте  AuthProvider

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider> {/*  Оборачиваем  все  в  AuthProvider  */}
        <BrowserRouter>
          <ResponsiveAppBar />
          <Container maxWidth="md">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/scanner" element={<ScannerPage />} />
              <Route path="/subscriptions" element={<SubscriptionPage />} />
            </Routes>
          </Container>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;