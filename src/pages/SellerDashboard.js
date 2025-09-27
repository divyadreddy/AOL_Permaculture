import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  useMediaQuery,
  Alert,
  Snackbar,
  ImageList,
  ImageListItem,
  ImageListItemBar
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CloudUpload as UploadIcon,
  Inventory as InventoryIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { uploadToR2, listProducts as r2ListProducts, saveProduct as r2SaveProduct, deleteProduct as r2DeleteProduct } from '../cloudflare-r2';

function SellerDashboard() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { currentUser, userProfile } = useAuth();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    moq: '',
    quantity: '',
    growingMethods: '',
    harvestDate: '',
    images: []
  });

  useEffect(() => {
    if (!currentUser || userProfile?.user_type !== 'seller') {
      navigate('/');
      return;
    }
    fetchProducts();
  }, [currentUser, userProfile, navigate]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const all = await r2ListProducts();
      const mine = all.filter(p => p.seller_id === currentUser.uid || p.seller_id === currentUser.id);
      setProducts(mine || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      setSnackbar({ open: true, message: 'Error fetching products', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (files) => {
    try {
      const uploadedUrls = [];
      for (const file of files) {
        const fileName = `products/${currentUser.uid || currentUser.id}/${Date.now()}-${file.name}`;
        const imageUrl = await uploadToR2(file, fileName);
        uploadedUrls.push(imageUrl);
      }
      setFormData(prev => ({ ...prev, images: [...prev.images, ...uploadedUrls] }));
    } catch (error) {
      console.error('Error uploading images:', error);
      setSnackbar({ open: true, message: 'Error uploading images', severity: 'error' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const productData = {
        ...formData,
        seller_id: currentUser.uid || currentUser.id,
        seller_name: userProfile?.display_name || currentUser.displayName || currentUser.email,
        seller_farm: userProfile?.farm_name || 'Unknown Farm',
        seller_address: userProfile?.address || 'Address not provided',
        status: 'active',
        created_at: new Date().toISOString()
      };

      if (editingProduct) {
        await r2SaveProduct({ ...productData, id: editingProduct.id });
        setSnackbar({ open: true, message: 'Product updated successfully!', severity: 'success' });
      } else {
        await r2SaveProduct(productData);
        setSnackbar({ open: true, message: 'Product added successfully!', severity: 'success' });
      }

      setOpenDialog(false);
      resetForm();
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      setSnackbar({ open: true, message: 'Error saving product', severity: 'error' });
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      category: product.category,
      price: product.price,
      moq: product.moq,
      quantity: product.quantity,
      growingMethods: product.growing_methods || product.growingMethods || '',
      harvestDate: product.harvest_date || product.harvestDate || '',
      images: product.images || []
    });
    setOpenDialog(true);
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await r2DeleteProduct(productId);
        setSnackbar({ open: true, message: 'Product deleted successfully!', severity: 'success' });
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
        setSnackbar({ open: true, message: 'Error deleting product', severity: 'error' });
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: '',
      price: '',
      moq: '',
      quantity: '',
      growingMethods: '',
      harvestDate: '',
      images: []
    });
    setEditingProduct(null);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    resetForm();
  };

  if (!currentUser || userProfile?.user_type !== 'seller') {
    return null;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" sx={{ mb: 2, fontWeight: 700, textTransform: 'uppercase' }}>
          Seller Dashboard
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Manage your products and connect with buyers
        </Typography>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
          size="large"
          sx={{ py: 1.5, px: 3 }}
        >
          Add New Product
        </Button>
      </Box>

      {loading ? (
        <Typography variant="h6" align="center">Loading products...</Typography>
      ) : (
        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                {product.images && product.images.length > 0 ? (
                  <Box sx={{ position: 'relative' }}>
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      style={{ width: '100%', height: 200, objectFit: 'cover' }}
                    />
                    <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                      <IconButton size="small" onClick={() => handleEdit(product)} sx={{ bgcolor: 'rgba(255,255,255,0.9)', mr: 1 }}>
                        <EditIcon />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDelete(product.id)} sx={{ bgcolor: 'rgba(255,255,255,0.9)' }}>
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>
                ) : (
                  <Box sx={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: theme.palette.neutral.light }}>
                    <InventoryIcon sx={{ fontSize: 60, color: theme.palette.neutral.dark }} />
                  </Box>
                )}
                
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" component="h3" sx={{ mb: 1, fontWeight: 600 }}>
                    {product.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {product.description?.length > 100 ? `${product.description.substring(0, 100)}...` : product.description}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    <Chip label={product.category} color="primary" size="small" />
                    <Chip label={`$${product.price}`} color="secondary" size="small" />
                    <Chip label={`MOQ: ${product.moq}`} variant="outlined" size="small" />
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary">
                    Available: {product.quantity} units
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Dialog omitted for brevity: unchanged UI; save uses handleSubmit */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth fullScreen={isMobile}>
        <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Product Name" value={formData.name} onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} required />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Category</InputLabel>
                  <Select value={formData.category} label="Category" onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}>
                    <MenuItem value="vegetables">Vegetables</MenuItem>
                    <MenuItem value="fruits">Fruits</MenuItem>
                    <MenuItem value="herbs">Herbs</MenuItem>
                    <MenuItem value="grains">Grains</MenuItem>
                    <MenuItem value="dairy">Dairy</MenuItem>
                    <MenuItem value="eggs">Eggs</MenuItem>
                    <MenuItem value="honey">Honey</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Price per Unit ($)" type="number" value={formData.price} onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))} required inputProps={{ min: 0, step: 0.01 }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Minimum Order Quantity" type="number" value={formData.moq} onChange={(e) => setFormData(prev => ({ ...prev, moq: e.target.value }))} required inputProps={{ min: 1 }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Available Quantity" type="number" value={formData.quantity} onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))} required inputProps={{ min: 0 }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Harvest Date" type="date" value={formData.harvestDate} onChange={(e) => setFormData(prev => ({ ...prev, harvestDate: e.target.value }))} InputLabelProps={{ shrink: true }} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Description" multiline rows={3} value={formData.description} onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))} required />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Growing Methods" multiline rows={3} value={formData.growingMethods} onChange={(e) => setFormData(prev => ({ ...prev, growingMethods: e.target.value }))} placeholder="Describe your sustainable growing practices..." />
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ border: '2px dashed', borderColor: 'grey.300', p: 3, textAlign: 'center' }}>
                  <input type="file" multiple accept="image/*" onChange={(e) => handleImageUpload(Array.from(e.target.files))} style={{ display: 'none' }} id="image-upload" />
                  <label htmlFor="image-upload">
                    <Button component="span" startIcon={<UploadIcon />} variant="outlined" sx={{ cursor: 'pointer' }}>Upload Product Images</Button>
                  </label>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Upload multiple images to showcase your product</Typography>
                </Box>
              </Grid>
              {formData.images.length > 0 && (
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ mb: 2 }}>Uploaded Images:</Typography>
                  <ImageList sx={{ width: '100%', height: 200 }} cols={4} rowHeight={200}>
                    {formData.images.map((image, index) => (
                      <ImageListItem key={index}>
                        <img src={image} alt={`Product ${index + 1}`} loading="lazy" />
                        <ImageListItemBar actionIcon={
                          <IconButton sx={{ color: 'white' }} onClick={() => setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }))}>
                            <DeleteIcon />
                          </IconButton>
                        } />
                      </ImageListItem>
                    ))}
                  </ImageList>
                </Grid>
              )}
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={!formData.name || !formData.category || !formData.price || !formData.moq || !formData.quantity || !formData.description}>
            {editingProduct ? 'Update Product' : 'Add Product'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>{snackbar.message}</Alert>
      </Snackbar>
    </Container>
  );
}

export default SellerDashboard;
