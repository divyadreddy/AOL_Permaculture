import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  TextField,
  Chip,
  Divider,
  Tabs,
  Tab,
  ImageList,
  ImageListItem,
  useTheme,
  useMediaQuery,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  IconButton
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  AttachMoney as MoneyIcon,
  Scale as ScaleIcon,
  Inventory as InventoryIcon,
  CalendarToday as CalendarIcon,
  LocalFlorist as EcoIcon,
  Agriculture as FarmIcon,
  ArrowBack as ArrowBackIcon,
  ShoppingBag as ShoppingBagIcon
} from '@mui/icons-material';
import { listProducts as r2ListProducts, fetchProduct as r2FetchProduct, saveProductReview as r2SaveReview, listProductReviews as r2ListReviews, fetchUserProfile as r2FetchUserProfile } from '../cloudflare-r2';
import { useAuth } from '../contexts/AuthContext';
import { useBag } from '../contexts/BagContext';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { addToBag, isInBag } = useBag();
  const { currentUser } = useAuth();
  
  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedImage, setSelectedImage] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({ rating: 0, comment: '' });
  const [reviewError, setReviewError] = useState('');
  const [sellerProfile, setSellerProfile] = useState(null);

  useEffect(() => {
    fetchProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchProduct = async () => {
    try {
      const data = await r2FetchProduct(id);
      if (data) {
        setProduct(data);
        fetchSimilarProducts(data);
        loadReviews();
        if (data.seller_id) {
          loadSellerProfile(data.seller_id);
        }
      } else {
        navigate('/products');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const loadSellerProfile = async (uid) => {
    try {
      const profile = await r2FetchUserProfile(uid);
      setSellerProfile(profile || null);
    } catch (e) {
      setSellerProfile(null);
    }
  };

  const loadReviews = async () => {
    try {
      const list = await r2ListReviews(id);
      setReviews(list || []);
    } catch (e) {
      setReviews([]);
    }
  };

  const handleSubmitReview = async () => {
    setReviewError('');
    if (!currentUser) {
      setReviewError('Please log in to leave a review.');
      return;
    }
    if (!reviewForm.rating) {
      setReviewError('Please select a rating.');
      return;
    }
    try {
      await r2SaveReview(id, { rating: reviewForm.rating, comment: reviewForm.comment, user_id: currentUser.uid, user_name: currentUser.email });
      setReviewForm({ rating: 0, comment: '' });
      loadReviews();
    } catch (e) {
      setReviewError('Failed to submit review.');
    }
  };

  const fetchSimilarProducts = async (productData) => {
    try {
      const all = await r2ListProducts();
      const sims = (all || []).filter(p => p.id !== productData.id && p.status === 'active' && p.category === productData.category).slice(0, 6);
      setSimilarProducts(sims);
    } catch (error) {
      console.error('Error fetching similar products:', error);
    }
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleAddToBag = () => {
    if (product) {
      addToBag(product);
      alert('Product added to bag!');
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" align="center">Loading product...</Typography>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" align="center">Product not found</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/products')} sx={{ mb: 3 }}>Back to Products</Button>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Box sx={{ position: 'sticky', top: 100 }}>
            {product.images && product.images.length > 0 ? (
              <>
                <Box sx={{ mb: 2 }}>
                  <CardMedia component="img" height="400" image={product.images[selectedImage] || product.images[0]} alt={product.name} sx={{ borderRadius: 2, objectFit: 'cover' }} />
                </Box>
                {product.images.length > 1 && (
                  <ImageList sx={{ width: '100%', height: 100 }} cols={4} rowHeight={100}>
                    {product.images.map((image, index) => (
                      <ImageListItem key={index} sx={{ cursor: 'pointer', border: selectedImage === index ? `2px solid ${theme.palette.primary.main}` : 'none', borderRadius: 1 }} onClick={() => setSelectedImage(index)}>
                        <img src={image} alt={`${product.name} ${index + 1}`} style={{ borderRadius: 4 }} />
                      </ImageListItem>
                    ))}
                  </ImageList>
                )}
                {product.videos && product.videos.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="h6" sx={{ mb: 1 }}>Videos</Typography>
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                      {product.videos.map((src, idx) => (
                        <video key={idx} src={src} controls style={{ width: '100%', maxWidth: 320, borderRadius: 8 }} />
                      ))}
                    </Box>
                  </Box>
                )}
              </>
            ) : (
              <Box sx={{ height: 400, backgroundColor: theme.palette.neutral.light, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 2 }}>
                <InventoryIcon sx={{ fontSize: 100, color: theme.palette.neutral.dark }} />
              </Box>
            )}
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="h3" sx={{ mb: 2, fontWeight: 700, textTransform: 'uppercase', color: theme.palette.primary.main }}>{product.name}</Typography>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
            <Chip label={product.category} color="primary" variant="outlined" />
            <Chip label={`₹${product.price}`} color="secondary" icon={<MoneyIcon />} />
            <Chip label={`MOQ: ${product.moq} kg`} color="default" icon={<ScaleIcon />} />
          </Box>

          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.6 }}>{product.description}</Typography>

          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Product Details</Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <MoneyIcon sx={{ mr: 1, color: theme.palette.secondary.main }} />
                  <Typography variant="body2"><strong>Price:</strong> ₹{product.price} per kg</Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <ScaleIcon sx={{ mr: 1, color: theme.palette.secondary.main }} />
                  <Typography variant="body2"><strong>MOQ:</strong> {product.moq} kg</Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <InventoryIcon sx={{ mr: 1, color: theme.palette.secondary.main }} />
                  <Typography variant="body2"><strong>Available:</strong> {product.quantity} kg</Typography>
                </Box>
              </Grid>
              {product.variety && (
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <EcoIcon sx={{ mr: 1, color: theme.palette.secondary.main }} />
                    <Typography variant="body2"><strong>Variety:</strong> {product.variety}</Typography>
                  </Box>
                </Grid>
              )}
              {product.harvest_date && (
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <CalendarIcon sx={{ mr: 1, color: theme.palette.secondary.main }} />
                    <Typography variant="body2"><strong>Harvest:</strong> {new Date(product.harvest_date).toLocaleDateString()}</Typography>
                  </Box>
                </Grid>
              )}
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <EcoIcon sx={{ mr: 1, color: theme.palette.secondary.main }} />
                  <Typography variant="body2"><strong>Organic Certified:</strong> {product.organic_certified ? 'Yes' : 'No'}</Typography>
                </Box>
              </Grid>
              {product.created_at && (
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <CalendarIcon sx={{ mr: 1, color: theme.palette.secondary.main }} />
                    <Typography variant="body2"><strong>Added:</strong> {new Date(product.created_at).toLocaleDateString()}</Typography>
                  </Box>
                </Grid>
              )}
            </Grid>
          </Box>

          <Button variant={isInBag(product?.id) ? 'outlined' : 'contained'} size="large" startIcon={<ShoppingBagIcon />} onClick={handleAddToBag} fullWidth disabled={isInBag(product?.id)} sx={{ mb: 3, py: 1.5, backgroundColor: isInBag(product?.id) ? 'transparent' : theme.palette.primary.main, color: isInBag(product?.id) ? theme.palette.primary.main : 'white', borderColor: theme.palette.primary.main, '&:hover': { backgroundColor: isInBag(product?.id) ? 'rgba(76, 175, 80, 0.04)' : theme.palette.primary.dark } }}>{isInBag(product?.id) ? 'Already in Bag' : 'Add to Bag'}</Button>
        </Grid>
      </Grid>

      <Divider sx={{ my: 4 }} />

      <Box sx={{ mb: 4 }}>
        <Tabs value={selectedTab} onChange={handleTabChange} sx={{ mb: 3 }}>
          <Tab label="Growing Methods" />
          <Tab label="Farmer Information" />
          <Tab label="Similar Products" />
          <Tab label={`Reviews (${reviews.length})`} />
        </Tabs>

        {selectedTab === 0 && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}><EcoIcon sx={{ mr: 1, verticalAlign: 'middle' }} />Growing Methods</Typography>
            {product.growing_methods || product.growingMethods ? (
              <Typography variant="body1" sx={{ lineHeight: 1.6 }}>{product.growing_methods || product.growingMethods}</Typography>
            ) : (
              <Typography variant="body1" color="text.secondary">Growing methods information not available for this product.</Typography>
            )}
          </Paper>
        )}

        {selectedTab === 1 && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}><FarmIcon sx={{ mr: 1, verticalAlign: 'middle' }} />Farmer Information</Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ mr: 2, bgcolor: theme.palette.primary.main }}>{(product.seller_name || 'F').charAt(0).toUpperCase()}</Avatar>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>{product.seller_name}</Typography>
                      <Typography variant="body2" color="text.secondary">{product.seller_farm}</Typography>
                    </Box>
                  </Box>
                  <List dense>
                    <ListItem>
                      <ListItemIcon><LocationIcon color="primary" /></ListItemIcon>
                      <ListItemText primary="Address" secondary={product.seller_address} />
                    </ListItem>
                    {sellerProfile?.pincode && (
                      <ListItem>
                        <ListItemIcon><LocationIcon color="primary" /></ListItemIcon>
                        <ListItemText primary="Pincode" secondary={sellerProfile.pincode} />
                      </ListItem>
                    )}
                    {(sellerProfile?.city || sellerProfile?.state) && (
                      <ListItem>
                        <ListItemIcon><LocationIcon color="primary" /></ListItemIcon>
                        <ListItemText primary="Region" secondary={`${sellerProfile?.city || ''}${sellerProfile?.city && sellerProfile?.state ? ', ' : ''}${sellerProfile?.state || ''}`} />
                      </ListItem>
                    )}
                    <ListItem>
                      <ListItemIcon><PhoneIcon color="primary" /></ListItemIcon>
                      <ListItemText primary="Phone" secondary="Contact farmer for phone number" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><EmailIcon color="primary" /></ListItemIcon>
                      <ListItemText primary="Email" secondary="Contact farmer for email" />
                    </ListItem>
                  </List>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card sx={{ p: 2 }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Farm Details</Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}><strong>Farm Name:</strong> {product.seller_farm}</Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}><strong>Location:</strong> {product.seller_address}</Typography>
                  {sellerProfile?.farm_area_acres && (
                    <Typography variant="body2" sx={{ mb: 2 }}><strong>Total Farm Area:</strong> {sellerProfile.farm_area_acres} acres</Typography>
                  )}
                  {sellerProfile?.aol_courses && (
                    <Typography variant="body2" sx={{ mb: 2 }}><strong>AoL Courses:</strong> {sellerProfile.aol_courses} {sellerProfile?.aol_verified ? '(Verified)' : '(Pending verification)'}
                    </Typography>
                  )}
                  {sellerProfile?.farm_organic_certified !== undefined && (
                    <Typography variant="body2" sx={{ mb: 2 }}><strong>Organic Certified:</strong> {sellerProfile.farm_organic_certified ? 'Yes' : 'No'}</Typography>
                  )}
                  {sellerProfile?.farm_features && sellerProfile.farm_features.length > 0 && (
                    <Box sx={{ mt: 1, mb: 2 }}>
                      <Typography variant="body2" sx={{ mb: 1 }}><strong>Features Applied:</strong></Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {sellerProfile.farm_features.map((f, idx) => (
                          <Chip key={idx} label={f} size="small" />
                        ))}
                      </Box>
                    </Box>
                  )}
                  {sellerProfile?.journey_writeup && (
                    <Typography variant="body2" sx={{ mt: 1 }}><strong>Journey:</strong> {sellerProfile.journey_writeup}</Typography>
                  )}
                </Card>
              </Grid>
              {(sellerProfile?.farm_photos && sellerProfile.farm_photos.length > 0) && (
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>Farm Photos</Typography>
                  <ImageList cols={isMobile ? 2 : 4} rowHeight={140} sx={{ width: '100%' }}>
                    {sellerProfile.farm_photos.map((src, idx) => (
                      <ImageListItem key={idx}>
                        <img src={src} alt={`farm-${idx}`} style={{ borderRadius: 8 }} />
                      </ImageListItem>
                    ))}
                  </ImageList>
                </Grid>
              )}
              {(sellerProfile?.farm_videos && sellerProfile.farm_videos.length > 0) && (
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>Farm Videos</Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    {sellerProfile.farm_videos.map((src, idx) => (
                      <video key={idx} src={src} controls style={{ width: '100%', maxWidth: 320, borderRadius: 8 }} />
                    ))}
                  </Box>
                </Grid>
              )}
            </Grid>
          </Paper>
        )}

        {selectedTab === 2 && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>Similar Products</Typography>
            {(similarProducts || []).length > 0 ? (
              <Grid container spacing={2}>
                {similarProducts.map((similarProduct) => (
                  <Grid item xs={12} sm={6} md={4} key={similarProduct.id}>
                    <Card sx={{ cursor: 'pointer', '&:hover': { transform: 'translateY(-2px)', transition: 'transform 0.2s ease-in-out', boxShadow: theme.shadows[4] } }} onClick={() => navigate(`/product/${similarProduct.id}`)}>
                      {similarProduct.images && similarProduct.images.length > 0 ? (
                        <CardMedia component="img" height="140" image={similarProduct.images[0]} alt={similarProduct.name} />
                      ) : (
                        <Box sx={{ height: 140, backgroundColor: theme.palette.neutral.light, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <InventoryIcon sx={{ fontSize: 40, color: theme.palette.neutral.dark }} />
                        </Box>
                      )}
                      <CardContent>
                        <Typography variant="h6" component="h3" sx={{ mb: 1, fontWeight: 600 }}>{similarProduct.name}</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{(similarProduct.description || '').length > 80 ? `${similarProduct.description.substring(0, 80)}...` : similarProduct.description}</Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="h6" color="primary" sx={{ fontWeight: 600 }}>${similarProduct.price}</Typography>
                          <Chip label={similarProduct.category} size="small" color="primary" variant="outlined" />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography variant="body1" color="text.secondary" align="center">No similar products found.</Typography>
            )}
          </Paper>
        )}

        {selectedTab === 3 && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>Reviews</Typography>
            {reviews.length === 0 ? (
              <Typography variant="body2" color="text.secondary">No reviews yet.</Typography>
            ) : (
              <List>
                {reviews.map((rv) => (
                  <ListItem key={rv.id} alignItems="flex-start">
                    <ListItemText
                      primary={`Rating: ${rv.rating} / 5`}
                      secondary={<>
                        <Typography variant="body2" color="text.secondary">{rv.comment}</Typography>
                        <Typography variant="caption" color="text.secondary">by {rv.user_name} on {new Date(rv.created_at).toLocaleDateString()}</Typography>
                      </>}
                    />
                  </ListItem>
                ))}
              </List>
            )}

            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" sx={{ mb: 1 }}>Add a review</Typography>
            {reviewError && <Typography color="error" sx={{ mb: 1 }}>{reviewError}</Typography>}
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 1 }}>
              <TextField type="number" label="Rating (1-5)" value={reviewForm.rating} onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })} inputProps={{ min: 1, max: 5 }} size="small" />
              <TextField label="Comment" value={reviewForm.comment} onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })} fullWidth size="small" />
              <Button variant="contained" onClick={handleSubmitReview}>Submit</Button>
            </Box>
          </Paper>
        )}
      </Box>
    </Container>
  );
}

export default ProductDetail;
