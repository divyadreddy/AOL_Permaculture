import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Badge,
  Box,
  Avatar,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Menu as MenuIcon,
  ShoppingBag as ShoppingBagIcon,
  LocalFlorist as EcoIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useBag } from '../contexts/BagContext';

function Header() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { currentUser, userProfile, logout } = useAuth();
  const { bagCount } = useBag();
  const navigate = useNavigate();
  
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMobileMenuAnchor(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      handleMenuClose();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const handleProfileClick = () => {
    handleMenuClose();
    navigate('/profile');
  };

  const menuId = 'primary-account-menu';
  const mobileMenuId = 'primary-account-menu-mobile';

  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      id={menuId}
      keepMounted
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      open={Boolean(anchorEl)}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleProfileClick}>Profile</MenuItem>
      <MenuItem onClick={handleLogout}>Logout</MenuItem>
    </Menu>
  );

  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMenuAnchor}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      open={Boolean(mobileMenuAnchor)}
      onClose={handleMenuClose}
    >
      <MenuItem component={RouterLink} to="/" onClick={handleMenuClose}>
        Home
      </MenuItem>
      {(currentUser && (userProfile?.user_type === 'seller' || userProfile?.userType === 'seller')) && (
        <>
          <MenuItem component={RouterLink} to="/add-product" onClick={handleMenuClose}>
            Add Product
          </MenuItem>
          <MenuItem component={RouterLink} to="/listings" onClick={handleMenuClose}>
            Listings
          </MenuItem>
        </>
      )}
      <MenuItem component={RouterLink} to="/products" onClick={handleMenuClose}>
        Products
      </MenuItem>
      <MenuItem component={RouterLink} to="/blog" onClick={handleMenuClose}>
        Blog
      </MenuItem>
      <MenuItem component={RouterLink} to="/about" onClick={handleMenuClose}>
        About Us
      </MenuItem>
      <MenuItem component={RouterLink} to="/contact" onClick={handleMenuClose}>
        Contact
      </MenuItem>
      {currentUser ? (
        <>
          <MenuItem onClick={handleProfileClick}>Profile</MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </>
      ) : (
        <>
          <MenuItem component={RouterLink} to="/login" onClick={handleMenuClose}>
            Login
          </MenuItem>
          <MenuItem component={RouterLink} to="/register" onClick={handleMenuClose}>
            Register
          </MenuItem>
        </>
      )}
    </Menu>
  );

  return (
    <AppBar position="sticky" sx={{ backgroundColor: '#5d4037', color: '#4caf50' }}>
      <Toolbar>
        {isMobile && (
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleMobileMenuOpen}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
        )}

        <EcoIcon sx={{ mr: 2, fontSize: 32 }} />
        
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{
            flexGrow: 1,
            textDecoration: 'none',
            color: 'inherit',
            fontWeight: 700,
            textTransform: 'uppercase'
          }}
        >
          Permaculture Market
        </Typography>

        {!isMobile && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {(currentUser && (userProfile?.user_type === 'seller' || userProfile?.userType === 'seller')) ? (
              <>
                <Button
                  color="inherit"
                  component={RouterLink}
                  to="/add-product"
                  sx={{ fontWeight: 600 }}
                >
                  Add Product
                </Button>
                <Button
                  color="inherit"
                  component={RouterLink}
                  to="/listings"
                  sx={{ fontWeight: 600 }}
                >
                  Listings
                </Button>
                <Button
                  color="inherit"
                  component={RouterLink}
                  to="/products"
                  sx={{ fontWeight: 600 }}
                >
                  Products
                </Button>
              </>
            ) : (
              <Button
                color="inherit"
                component={RouterLink}
                to="/products"
                sx={{ fontWeight: 600 }}
              >
                Products
              </Button>
            )}
            <Button
              color="inherit"
              component={RouterLink}
              to="/blog"
              sx={{ fontWeight: 600 }}
            >
              Blog
            </Button>
            <Button
              color="inherit"
              component={RouterLink}
              to="/about"
              sx={{ fontWeight: 600 }}
            >
              About Us
            </Button>
            <Button
              color="inherit"
              component={RouterLink}
              to="/contact"
              sx={{ fontWeight: 600 }}
            >
              Contact
            </Button>
            
            {currentUser && (
              <IconButton
                color="inherit"
                component={RouterLink}
                to="/bag"
                sx={{ position: 'relative' }}
              >
                <Badge badgeContent={bagCount} color="secondary">
                  <ShoppingBagIcon />
                </Badge>
              </IconButton>
            )}

            {currentUser ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {userProfile?.displayName || currentUser.email}
                </Typography>
                <IconButton
                  edge="end"
                  aria-label="account of current user"
                  aria-controls={menuId}
                  aria-haspopup="true"
                  onClick={handleProfileMenuOpen}
                  color="inherit"
                >
                  <Avatar sx={{ width: 32, height: 32, bgcolor: theme.palette.secondary.main }}>
                    {(userProfile?.displayName || currentUser.email || 'U').charAt(0).toUpperCase()}
                  </Avatar>
                </IconButton>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  color="inherit"
                  component={RouterLink}
                  to="/login"
                  sx={{ fontWeight: 600 }}
                >
                  Login
                </Button>
                <Button
                  variant="outlined"
                  component={RouterLink}
                  to="/register"
                  sx={{
                    color: 'inherit',
                    borderColor: 'inherit',
                    fontWeight: 600,
                    '&:hover': {
                      borderColor: 'inherit',
                      backgroundColor: 'rgba(76, 175, 80, 0.08)'
                    }
                  }}
                >
                  Register
                </Button>
              </Box>
            )}
          </Box>
        )}

        {renderMenu}
        {renderMobileMenu}
      </Toolbar>
    </AppBar>
  );
}

export default Header;
