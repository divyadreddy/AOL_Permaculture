import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Chip,
  Slider,
  Drawer,
  IconButton,
  useTheme,
  useMediaQuery,
  InputAdornment,
  Pagination
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Close as CloseIcon,
  LocationOn as LocationIcon,
  AttachMoney as MoneyIcon,
  Scale as ScaleIcon
} from '@mui/icons-material';
import { listProducts as r2ListProducts, listProductReviews as r2ListReviews } from '../cloudflare-r2';

function ProductList() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [allProducts, setAllProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    priceRange: [0, 10000],
    moqRange: [1, 100],
    distance: 50
  });
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  const categories = [
    'vegetables', 'fruits', 'herbs', 'grains', 'dairy', 'eggs', 'honey', 'other'
  ];

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await r2ListProducts();
        // Compute average ratings
        const withRatings = await Promise.all((data || []).map(async (p) => {
          try {
            const revs = await r2ListReviews(p.id);
            const avg = (revs && revs.length) ? (revs.reduce((s, r) => s + (Number(r.rating) || 0), 0) / revs.length) : 0;
            return { ...p, _avgRating: avg, _reviewCount: (revs || []).length };
          } catch {
            return { ...p, _avgRating: 0, _reviewCount: 0 };
          }
        }));
        setAllProducts(withRatings);
      } catch (e) {
        console.error('Failed to load products', e);
        setAllProducts([]);
        setError('Unable to load products right now. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [allProducts, searchTerm, filters, currentPage]);

  const applyFilters = () => {
    let list = [...allProducts].filter(p => p.status === 'active');

    if (searchTerm) {
      const s = searchTerm.toLowerCase();
      list = list.filter(p => (p.name || '').toLowerCase().includes(s) || (p.description || '').toLowerCase().includes(s));
    }
    if (filters.category) {
      list = list.filter(p => p.category === filters.category);
    }
    list = list.filter(p => (p.price ?? 0) >= filters.priceRange[0] && (p.price ?? 0) <= filters.priceRange[1]);
    list = list.filter(p => (p.moq ?? 0) >= filters.moqRange[0] && (p.moq ?? 0) <= filters.moqRange[1]);

    const perPage = 12;
    setTotalProducts(list.length);
    setTotalPages(Math.ceil(list.length / perPage) || 1);
    const start = (currentPage - 1) * perPage;
    const pageItems = list.slice(start, start + perPage);
    setProducts(pageItems);
  };

  const clearFilters = () => {
    setFilters({ category: '', priceRange: [0, 10000], moqRange: [1, 100], distance: 50 });
    setSearchTerm('');
    setCurrentPage(1);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const FilterSection = () => (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>Filters</Typography>
        <Button onClick={clearFilters} size="small">Clear All</Button>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" sx={{ mb: 2 }}>Category</Typography>
        <FormControl fullWidth size="small">
          <Select value={filters.category} onChange={(e) => { setFilters({ ...filters, category: e.target.value }); setCurrentPage(1); }} displayEmpty>
            <MenuItem value="">All Categories</MenuItem>
            {categories.map((category) => (
              <MenuItem key={category} value={category}>{category.charAt(0).toUpperCase() + category.slice(1)}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" sx={{ mb: 2 }}>Price Range: Rs.{filters.priceRange[0]} - Rs.{filters.priceRange[1]}</Typography>
        <Slider value={filters.priceRange} onChange={(e, v) => { setFilters({ ...filters, priceRange: v }); setCurrentPage(1); }} valueLabelDisplay="auto" min={0} max={10000} step={1} />
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" sx={{ mb: 2 }}>MOQ Range: {filters.moqRange[0]} - {filters.moqRange[1]} kgs</Typography>
        <Slider value={filters.moqRange} onChange={(e, v) => { setFilters({ ...filters, moqRange: v }); setCurrentPage(1); }} valueLabelDisplay="auto" min={1} max={100} step={1} />
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" sx={{ mb: 2 }}>Distance: Within {filters.distance} km</Typography>
        <Slider value={filters.distance} onChange={(e, v) => { setFilters({ ...filters, distance: v }); setCurrentPage(1); }} valueLabelDisplay="auto" min={5} max={100} step={5} />
      </Box>
    </Box>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" sx={{ mb: 2, fontWeight: 700, textTransform: 'uppercase' }}>Browse Products</Typography>
        <Typography variant="h6" color="text.secondary">Discover fresh, organic produce from local permaculture farmers</Typography>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField fullWidth placeholder="Search products..." value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon /></InputAdornment>) }} />
          </Grid>
          {!isMobile && (
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button variant="outlined" startIcon={<FilterIcon />} onClick={() => setMobileFilterOpen(true)}>Filters</Button>
                <Button onClick={clearFilters} variant="text">Clear All</Button>
              </Box>
            </Grid>
          )}
          {isMobile && (
            <Grid item xs={12}>
              <Button fullWidth variant="outlined" startIcon={<FilterIcon />} onClick={() => setMobileFilterOpen(true)}>Filters</Button>
            </Grid>
          )}
        </Grid>
      </Box>

      {!isMobile && (
        <Grid container spacing={4}>
          <Grid item xs={12} md={3}><Card><FilterSection /></Card></Grid>
          <Grid item xs={12} md={9}>
            {loading ? (
              <Typography variant="h6" align="center">Loading products...</Typography>
            ) : error ? (
              <Typography variant="h6" color="error" align="center">{error}</Typography>
            ) : (
              <>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body1" color="text.secondary">Showing {products.length} of {totalProducts} products</Typography>
                </Box>
                <Grid container spacing={3}>
                  {products.length === 0 && (
                    <Grid item xs={12}>
                      <Typography variant="body1" color="text.secondary" align="center">No products available yet. Please check back soon.</Typography>
                    </Grid>
                  )}
                  {products.map((product) => (
                    <Grid item xs={12} sm={6} lg={4} key={product.id}>
                      <Card sx={{ height: '100%', cursor: 'pointer', '&:hover': { transform: 'translateY(-4px)', transition: 'transform 0.2s ease-in-out', boxShadow: theme.shadows[8] } }} onClick={() => navigate(`/product/${product.id}`)}>
                        {product.images && product.images.length > 0 ? (
                          <CardMedia component="img" height="200" image={product.images[0]} alt={product.name} />
                        ) : (
                          <Box sx={{ height: 200, backgroundColor: theme.palette.neutral.light, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Typography variant="body2" color="text.secondary">No Image</Typography>
                          </Box>
                        )}
                        <CardContent>
                          <Typography variant="h6" component="h3" sx={{ mb: 1, fontWeight: 600 }}>{product.name}</Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{(product.description || '').length > 80 ? `${product.description.substring(0, 80)}...` : product.description}</Typography>
                          {(product._reviewCount > 0) && (
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              Rating: {product._avgRating.toFixed(1)} / 5 ({product._reviewCount})
                            </Typography>
                          )}
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                            <Chip label={product.category} color="primary" size="small" />
                            <Chip label={`₹${product.price}`} color="secondary" icon={<MoneyIcon />} size="small" />
                            <Chip label={`MOQ: ${product.moq} kg`} variant="outlined" icon={<ScaleIcon />} size="small" />
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body2" color="text.secondary">Available: {product.quantity} kg</Typography>
                            <Typography variant="body2" color="text.secondary"><LocationIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />{product.seller_farm}</Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
                {totalPages > 1 && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <Pagination count={totalPages} page={currentPage} onChange={handlePageChange} color="primary" size="large" />
                  </Box>
                )}
              </>
            )}
          </Grid>
        </Grid>
      )}

      {isMobile && (
        <>
          {loading ? (
            <Typography variant="h6" align="center">Loading products...</Typography>
          ) : error ? (
            <Typography variant="h6" color="error" align="center">{error}</Typography>
          ) : (
            <>
              <Box sx={{ mb: 3 }}>
                <Typography variant="body1" color="text.secondary">Showing {products.length} of {totalProducts} products</Typography>
              </Box>
              <Grid container spacing={2}>
                {products.map((product) => (
                  <Grid item xs={12} key={product.id}>
                    <Card sx={{ cursor: 'pointer', '&:hover': { transform: 'translateY(-2px)', transition: 'transform 0.2s ease-in-out', boxShadow: theme.shadows[4] } }} onClick={() => navigate(`/product/${product.id}`)}>
                      <Box sx={{ display: 'flex' }}>
                        {product.images && product.images.length > 0 ? (
                          <Box sx={{ width: 120, height: 120, flexShrink: 0 }}>
                            <img src={product.images[0]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </Box>
                        ) : (
                          <Box sx={{ width: 120, height: 120, backgroundColor: theme.palette.neutral.light, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <Typography variant="body2" color="text.secondary" align="center">No Image</Typography>
                          </Box>
                        )}
                        <CardContent sx={{ flexGrow: 1, py: 1.5 }}>
                          <Typography variant="h6" component="h3" sx={{ mb: 1, fontWeight: 600 }}>{product.name}</Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>{(product.description || '').length > 60 ? `${product.description.substring(0, 60)}...` : product.description}</Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
                            <Chip label={product.category} color="primary" size="small" />
                            <Chip label={`₹${product.price}`} color="secondary" size="small" />
                          </Box>
                          <Typography variant="body2" color="text.secondary">MOQ: {product.moq} kg • Available: {product.quantity} kg</Typography>
                        </CardContent>
                      </Box>
                    </Card>
                  </Grid>
                ))}
              </Grid>
              {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <Pagination count={totalPages} page={currentPage} onChange={handlePageChange} color="primary" size="medium" />
                </Box>
              )}
            </>
          )}
        </>
      )}

      <Drawer anchor="right" open={mobileFilterOpen} onClose={() => setMobileFilterOpen(false)} PaperProps={{ sx: { width: '100%', maxWidth: 350 } }}>
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Filters</Typography>
            <IconButton onClick={() => setMobileFilterOpen(false)}><CloseIcon /></IconButton>
          </Box>
        </Box>
        <FilterSection />
      </Drawer>
    </Container>
  );
}

export default ProductList;
