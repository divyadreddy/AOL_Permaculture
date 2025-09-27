import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './contexts/AuthContext';
import { BagProvider } from './contexts/BagContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import SellerDashboard from './pages/SellerDashboard';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import Bag from './pages/Bag';
import PrivateRoute from './components/PrivateRoute';
import AuthRoute from './components/AuthRoute';
import Profile from './pages/Profile';
import AddProduct from './pages/AddProduct';
import SellerListings from './pages/SellerListings';
import Blog from './pages/Blog';
import About from './pages/About';
import Contact from './pages/Contact';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4CAF50',
    },
    secondary: {
      main: '#2E7D32',
    },
    accent: {
      main: '#8BC34A',
    },
    neutral: {
      light: '#F5F5F5',
      dark: '#2C2C2C',
    },
    highlight: {
      main: '#1E3A8A',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      textTransform: 'uppercase',
    },
    h2: {
      fontWeight: 700,
      textTransform: 'uppercase',
    },
    h3: {
      fontWeight: 700,
      textTransform: 'uppercase',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <BagProvider>
          <Router>
            <div className="App">
              <Header />
              <main style={{ minHeight: 'calc(100vh - 140px)' }}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/products" element={<ProductList />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/bag" element={<Bag />} />
                  <Route 
                    path="/profile" 
                    element={
                      <AuthRoute>
                        <Profile />
                      </AuthRoute>
                    } 
                  />
                  <Route 
                    path="/add-product" 
                    element={
                      <PrivateRoute>
                        <AddProduct />
                      </PrivateRoute>
                    } 
                  />
                  <Route 
                    path="/listings" 
                    element={
                      <PrivateRoute>
                        <SellerListings />
                      </PrivateRoute>
                    } 
                  />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route 
                    path="/seller-dashboard" 
                    element={
                      <PrivateRoute>
                        <SellerDashboard />
                      </PrivateRoute>
                    } 
                  />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </BagProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
