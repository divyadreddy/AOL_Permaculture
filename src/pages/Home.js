import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  LocalFlorist as EcoIcon,
  LocalShipping as ShippingIcon,
  Verified as VerifiedIcon,
  Map as MapIcon,
  TrendingUp as TrendingIcon,
  Nature as NatureIcon
} from '@mui/icons-material';

function Home() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const features = [
    {
      icon: <EcoIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      title: 'Organic & Sustainable',
      description: 'All products grown using permaculture principles'
    },
    {
      icon: <VerifiedIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      title: 'Verified Farmers',
      description: 'Connect directly with certified organic farmers'
    },
    {
      icon: <MapIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      title: 'Local & Fresh',
      description: 'Find produce from farmers in your area'
    }
  ];

  const solutions = [
    {
      number: '01',
      title: 'Discover Local Farmers',
      description: 'Browse through our network of verified permaculture farmers in your region'
    },
    {
      number: '02',
      title: 'Learn Growing Methods',
      description: 'Understand the sustainable practices used to grow your food'
    },
    {
      number: '03',
      title: 'Support Sustainable Agriculture',
      description: 'Your choices help promote eco-friendly farming practices'
    }
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
          color: 'white',
          py: { xs: 8, md: 12 },
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  mb: 3,
                  lineHeight: 1.2
                }}
              >
                Fresh from the
                <Box component="span" sx={{ color: theme.palette.accent.main }}>
                  {' '}Earth
                </Box>
              </Typography>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500, opacity: 0.9 }}>
                An initiative of The Art of Living Foundation
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  mb: 4,
                  opacity: 0.9,
                  fontWeight: 400
                }}
              >
                Connect with local permaculture farmers and discover organic produce grown with sustainable practices
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/products')}
                  sx={{
                    backgroundColor: theme.palette.accent.main,
                    color: 'white',
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    '&:hover': {
                      backgroundColor: theme.palette.accent.dark,
                    }
                  }}
                >
                  Browse Products
                </Button>
                {!currentUser && (
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => navigate('/register')}
                    sx={{
                      borderColor: 'white',
                      color: 'white',
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem',
                      '&:hover': {
                        borderColor: theme.palette.accent.main,
                        backgroundColor: 'rgba(255,255,255,0.1)',
                      }
                    }}
                  >
                    Join as Farmer
                  </Button>
                )}
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100%'
                }}
              >
                <NatureIcon sx={{ fontSize: 200, opacity: 0.3 }} />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography
          variant="h2"
          align="center"
          sx={{
            mb: 6,
            fontWeight: 700,
            textTransform: 'uppercase',
            color: theme.palette.neutral.dark
          }}
        >
          Why Choose Us
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  textAlign: 'center',
                  p: 3,
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    transition: 'transform 0.3s ease-in-out'
                  }
                }}
              >
                <Box sx={{ mb: 2 }}>
                  {feature.icon}
                </Box>
                <Typography
                  variant="h5"
                  sx={{
                    mb: 2,
                    fontWeight: 600,
                    textTransform: 'uppercase'
                  }}
                >
                  {feature.title}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {feature.description}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Solution Section */}
      <Box sx={{ backgroundColor: theme.palette.neutral.light, py: 8 }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                variant="h2"
                sx={{
                  mb: 4,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: theme.palette.neutral.dark
                }}
              >
                How It Works
              </Typography>
              {solutions.map((solution, index) => (
                <Box key={index} sx={{ mb: 4, display: 'flex', alignItems: 'flex-start' }}>
                  <Typography
                    variant="h3"
                    sx={{
                      mr: 3,
                      fontWeight: 700,
                      color: theme.palette.primary.main,
                      minWidth: 60
                    }}
                  >
                    {solution.number}
                  </Typography>
                  <Box>
                    <Typography
                      variant="h5"
                      sx={{
                        mb: 1,
                        fontWeight: 600,
                        textTransform: 'uppercase'
                      }}
                    >
                      {solution.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {solution.description}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100%'
                }}
              >
                <TrendingIcon sx={{ fontSize: 200, color: theme.palette.primary.main, opacity: 0.3 }} />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Call to Action */}
      <Box
        sx={{
          backgroundColor: theme.palette.highlight.main,
          color: 'white',
          py: 8,
          textAlign: 'center'
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h2"
            sx={{
              mb: 3,
              fontWeight: 700,
              textTransform: 'none'
            }}
          >
            Ready to start?
          </Typography>
          <Typography
            variant="h5"
            sx={{
              mb: 4,
              opacity: 0.9
            }}
          >
            Join our community of sustainable farmers and conscious consumers
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/register')}
            sx={{
              backgroundColor: theme.palette.accent.main,
              color: 'white',
              px: 6,
              py: 2,
              fontSize: '1.2rem',
              '&:hover': {
                backgroundColor: theme.palette.accent.dark,
              }
            }}
          >
            Get Started Today
          </Button>
        </Container>
      </Box>
    </Box>
  );
}

export default Home;
