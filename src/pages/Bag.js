import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useBag } from '../contexts/BagContext';
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  IconButton,
  Divider,
  useTheme,
  Alert,
  Paper
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  ShoppingBag as ShoppingBagIcon,
  LocationOn as LocationIcon,
  AttachMoney as MoneyIcon,
  Scale as ScaleIcon,
  Category as CategoryIcon
} from '@mui/icons-material';

function Bag() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { bagItems, removeFromBag, clearBag } = useBag();



  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h2"
          sx={{
            mb: 2,
            fontWeight: 700,
            textTransform: 'uppercase',
            color: theme.palette.primary.main
          }}
        >
          Your Bag
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Save products you're interested in and contact farmers directly
        </Typography>
      </Box>

      {bagItems.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: 'center' }}>
          <ShoppingBagIcon sx={{ fontSize: 80, color: theme.palette.neutral.dark, mb: 2 }} />
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
            Your bag is empty
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Start browsing our products and add items you're interested in to your bag.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/products')}
            sx={{
              backgroundColor: theme.palette.primary.main,
              '&:hover': {
                backgroundColor: theme.palette.primary.dark,
              }
            }}
          >
            Browse Products
          </Button>
        </Paper>
      ) : (
        <>
          {/* Bag Summary */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Bag Summary
              </Typography>
              <Button
                variant="outlined"
                color="error"
                onClick={clearBag}
                size="small"
              >
                Clear All
              </Button>
            </Box>
            <Typography variant="body2" color="text.secondary">
              {bagItems.length} item{bagItems.length !== 1 ? 's' : ''} in your bag
            </Typography>
          </Paper>

          {/* Bag Items */}
          <Grid container spacing={3}>
            {bagItems.map((item) => (
              <Grid item xs={12} key={item.id}>
                <Card>
                  <Grid container>
                    <Grid item xs={12} sm={3}>
                      {item.images && item.images.length > 0 ? (
                        <CardMedia
                          component="img"
                          height="200"
                          image={item.images[0]}
                          alt={item.name}
                          sx={{ objectFit: 'cover' }}
                        />
                      ) : (
                        <Box
                          sx={{
                            height: 200,
                            backgroundColor: theme.palette.neutral.light,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <CategoryIcon sx={{ fontSize: 60, color: theme.palette.neutral.dark }} />
                        </Box>
                      )}
                    </Grid>
                    
                    <Grid item xs={12} sm={9}>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                          <Typography variant="h5" component="h3" sx={{ fontWeight: 600 }}>
                            {item.name}
                          </Typography>
                          <IconButton
                            color="error"
                            onClick={() => removeFromBag(item.id)}
                            size="small"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                        
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                          {item.description}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                          <Chip 
                            label={item.category} 
                            color="primary" 
                            variant="outlined" 
                          />
                          <Chip 
                            label={`$${item.price}`} 
                            color="secondary" 
                            icon={<MoneyIcon />} 
                          />
                          <Chip 
                            label={`MOQ: ${item.moq}`} 
                            color="default" 
                            icon={<ScaleIcon />} 
                          />
                        </Box>
                        
                        <Grid container spacing={2} sx={{ mb: 2 }}>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="body2" color="text.secondary">
                              <strong>Farm:</strong> {item.sellerFarm}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="body2" color="text.secondary">
                              <strong>Available:</strong> {item.quantity} units
                            </Typography>
                          </Grid>
                          <Grid item xs={12}>
                            <Typography variant="body2" color="text.secondary">
                              <LocationIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                              {item.sellerAddress}
                            </Typography>
                          </Grid>
                        </Grid>
                        
                        <Divider sx={{ my: 2 }} />
                        
                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                          <Button
                            variant="contained"
                            startIcon={<ViewIcon />}
                            onClick={() => navigate(`/product/${item.id}`)}
                            sx={{
                              backgroundColor: theme.palette.primary.main,
                              '&:hover': {
                                backgroundColor: theme.palette.primary.dark,
                              }
                            }}
                          >
                            View Details
                          </Button>
                          
                          <Button
                            variant="outlined"
                            onClick={() => {
                              // In a real app, this would open a contact form or messaging system
                              alert(`Contact ${item.sellerName} at ${item.sellerFarm} to inquire about ${item.name}`);
                            }}
                          >
                            Contact Farmer
                          </Button>
                        </Box>
                      </CardContent>
                    </Grid>
                  </Grid>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Bag Actions */}
          <Paper sx={{ p: 3, mt: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Ready to connect with farmers?
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/products')}
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  '&:hover': {
                    backgroundColor: theme.palette.primary.dark,
                  }
                }}
              >
                Browse More Products
              </Button>
            </Box>
            
            <Alert severity="info" sx={{ mt: 2 }}>
              <Typography variant="body2">
                <strong>Note:</strong> This platform is for connecting buyers with farmers. 
                Contact farmers directly to discuss pricing, quantities, and delivery arrangements.
              </Typography>
            </Alert>
          </Paper>
        </>
      )}
    </Container>
  );
}

export default Bag;
