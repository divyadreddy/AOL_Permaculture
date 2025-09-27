import React, { useState, useRef } from 'react';
import { Container, Typography, TextField, Button, Checkbox, FormControlLabel, Grid, Box, Card, CardMedia, IconButton, CircularProgress, Alert } from '@mui/material';
import { Delete as DeleteIcon, CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { uploadImage, uploadMultipleImages } from '../utils/fileUpload';

function AddProduct() {
  const { currentUser } = useAuth();
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    name: '',
    variety: '',
    harvestDate: '',
    organicCertified: false,
    minOrderQuantity: '',
    price: '',
    rating: ''
  });
  const [uploadedImages, setUploadedImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileSelect = async (event) => {
    const files = Array.from(event.target.files);
    await handleImageUpload(files);
  };

  const handleDrop = async (event) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    await handleImageUpload(files);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleImageUpload = async (files) => {
    if (!files || files.length === 0) return;

    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length === 0) {
      setUploadError('Please select valid image files');
      return;
    }

    // Check file sizes (max 5MB per image)
    const oversizedFiles = imageFiles.filter(file => file.size > 5 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      setUploadError('Some files exceed 5MB limit. Please select smaller images.');
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const uploadPromises = imageFiles.map(async (file) => {
        const result = await uploadImage(file);
        return {
          id: Date.now() + Math.random(),
          url: result.url,
          fileName: file.name,
          originalSize: (file.size / (1024 * 1024)).toFixed(2),
          compressedSize: (result.compressedSize / (1024 * 1024)).toFixed(2)
        };
      });

      const uploaded = await Promise.all(uploadPromises);
      setUploadedImages(prev => [...prev, ...uploaded]);
    } catch (error) {
      setUploadError('Failed to upload images. Please try again.');
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (imageId) => {
    setUploadedImages(prev => prev.filter(img => img.id !== imageId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (uploadedImages.length === 0) {
      setUploadError('Please upload at least one product image');
      return;
    }

    const productData = {
      ...formData,
      images: uploadedImages.map(img => img.url),
      sellerId: currentUser?.uid,
      createdAt: new Date().toISOString()
    };

    console.log('Product submitted:', productData);
    // Here you would typically send the data to your backend
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>Add Product</Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Typography variant="h6" gutterBottom>Product Details</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Product Name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Variety"
                  value={formData.variety}
                  onChange={(e) => handleInputChange('variety', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Harvest/Processed Date"
                  type="date"
                  value={formData.harvestDate}
                  onChange={(e) => handleInputChange('harvestDate', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Minimum Order Quantity"
                  type="number"
                  value={formData.minOrderQuantity}
                  onChange={(e) => handleInputChange('minOrderQuantity', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Price per Unit"
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Rating (1-5)"
                  type="number"
                  inputProps={{ min: 1, max: 5 }}
                  value={formData.rating}
                  onChange={(e) => handleInputChange('rating', e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.organicCertified}
                      onChange={(e) => handleInputChange('organicCertified', e.target.checked)}
                    />
                  }
                  label="Organic Certified"
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>Product Images</Typography>
            
            {uploadError && (
              <Alert severity="error" sx={{ mb: 2 }} onClose={() => setUploadError(null)}>
                {uploadError}
              </Alert>
            )}

            {/* Upload Area */}
            <Box
              sx={{
                border: '2px dashed #ccc',
                borderRadius: 2,
                p: 3,
                textAlign: 'center',
                cursor: 'pointer',
                '&:hover': {
                  borderColor: 'primary.main',
                  bgcolor: 'action.hover',
                },
                transition: 'all 0.3s ease',
              }}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => fileInputRef.current?.click()}
            >
              <CloudUploadIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
              <Typography variant="h6" gutterBottom>
                Upload Images
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Drag & drop or click to select
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block" mt={1}>
                Max 5MB per image
              </Typography>
            </Box>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />

            {/* Image Previews */}
            {uploadedImages.length > 0 && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Uploaded ({uploadedImages.length})
                </Typography>
                {uploadedImages.map((image) => (
                  <Card key={image.id} sx={{ mb: 2 }}>
                    <CardMedia
                      component="img"
                      height="120"
                      image={image.url}
                      alt={image.fileName}
                      sx={{ objectFit: 'cover' }}
                    />
                    <Box sx={{ p: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="caption" noWrap>
                        {image.fileName}
                      </Typography>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => removeImage(image.id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                    <Typography variant="caption" color="text.secondary" sx={{ px: 1, pb: 1, display: 'block' }}>
                      {image.compressedSize} MB
                    </Typography>
                  </Card>
                ))}
              </Box>
            )}

            {isUploading && (
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <CircularProgress size={24} sx={{ mr: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  Uploading...
                </Typography>
              </Box>
            )}
          </Grid>

          <Grid item xs={12}>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary" 
              size="large"
              disabled={isUploading || uploadedImages.length === 0}
              sx={{ mt: 2 }}
            >
              {isUploading ? 'Uploading...' : 'Add Product'}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
}

export default AddProduct;
