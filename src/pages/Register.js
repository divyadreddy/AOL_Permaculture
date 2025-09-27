import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Alert,
  useTheme,
  useMediaQuery,
  Autocomplete,
  FormControlLabel,
  Checkbox,
  Chip
} from '@mui/material';
 
import { useAuth } from '../contexts/AuthContext';
import { uploadToR2 } from '../cloudflare-r2';

function Register() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { signup } = useAuth();
  
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    // Step 0: User Type
    userType: '',
    
    // Step 1: Account Details
    email: '',
    password: '',
    confirmPassword: '',
    
    // Step 2: Personal Information (buyer vs seller)
    displayName: '',
    phone: '',
    location: '',
    occupation: '',
    gender: '',
    pincode: '',
    willingToVolunteer: false,
    address: '',
    city: '',
    state: '',
    zipCode: '',
    
    // Step 3: Farm Information (only for sellers)
    farmName: '',
    farmDescription: '',
    farmSize: '',
    farmingExperience: '',
    certifications: '',
    aol_courses: '',
    farm_area_acres: '',
    farm_features: [],
    farm_organic_certified: false,
    farm_open_for_volunteers: false,
    journey_writeup: ''
  });

  const [farmImages, setFarmImages] = useState([]);
  const [farmVideos, setFarmVideos] = useState([]);
  const [uploadingFarmMedia, setUploadingFarmMedia] = useState(false);

  

  const indiaLocations = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Delhi', 'Chandigarh', 'Puducherry', 'Jammu and Kashmir', 'Ladakh', 'Andaman and Nicobar Islands', 'Lakshadweep', 'Dadra and Nagar Haveli and Daman and Diu'
  ];

  // Dynamic steps: show Farm Information only for sellers
  const steps = [
    'User Type',
    'Account Details',
    'Personal Information',
    ...(formData.userType === 'seller' ? ['Farm Information'] : [])
  ];

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      handleSubmit();
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateStep = (step) => {
    const isSeller = formData.userType === 'seller';
    switch (steps[step]) {
      case 'User Type':
        if (!formData.userType) return 'Please select Buyer or Seller';
        break;
      case 'Account Details':
        if (!formData.email || !formData.password || !formData.confirmPassword) {
          return 'Please fill in all required fields';
        }
        if (formData.password !== formData.confirmPassword) {
          return 'Passwords do not match';
        }
        if (formData.password.length < 6) {
          return 'Password must be at least 6 characters long';
        }
        break;
      case 'Personal Information':
        if (formData.userType === 'buyer') {
          if (!formData.displayName || !formData.phone || !formData.location) {
            return 'Please fill in name, mobile number, and location';
          }
        } else {
          if (!formData.displayName || !formData.phone || !formData.gender || !formData.pincode) {
            return 'Please fill in name, mobile number, gender, and pincode';
          }
          if (!formData.city || !formData.state) {
            return 'Please enter a valid pincode to auto-fill city and state';
          }
        }
        break;
      case 'Farm Information':
        if (isSeller) {
          if (!formData.farm_area_acres) {
            return 'Please enter total farm area (free of chemical inputs)';
          }
        }
        break;
      default:
        break;
    }
    return null;
  };

  

  const handlePincodeLookup = async () => {
    const pin = (formData.pincode || '').trim();
    if (!/^\d{6}$/.test(pin)) return;
    try {
      const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
      const data = await res.json();
      const first = data && data[0];
      if (first && first.Status === 'Success' && first.PostOffice && first.PostOffice.length > 0) {
        const po = first.PostOffice[0];
        handleInputChange('city', po.Block || po.District || po.Name || '');
        handleInputChange('state', po.State || '');
      } else {
        setError('Invalid pincode. Could not fetch city/state.');
      }
    } catch (e) {
      setError('Failed to fetch city/state for the provided pincode.');
    }
  };

  const farmFeaturesOptions = ['Agroforestry', 'Rain water Harvesting', 'Drip/Sprinkler Irrigation', 'No-Tilling', 'Native Cows', 'Biogas', 'Solar Power'];

  const onFarmImagesChange = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setUploadingFarmMedia(true);
    setError('');
    try {
      const uploaded = [];
      for (const f of files) {
        const fileName = `farm/${Date.now()}-${f.name}`;
        const url = await uploadToR2(f, fileName);
        uploaded.push(url);
      }
      setFarmImages(prev => [...prev, ...uploaded]);
    } catch (e) {
      setError('Failed to upload farm photos.');
    } finally {
      setUploadingFarmMedia(false);
    }
  };

  const onFarmVideosChange = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setUploadingFarmMedia(true);
    setError('');
    try {
      const uploaded = [];
      for (const f of files) {
        const fileName = `farm/videos/${Date.now()}-${f.name}`;
        const url = await uploadToR2(f, fileName);
        uploaded.push(url);
      }
      setFarmVideos(prev => [...prev, ...uploaded]);
    } catch (e) {
      setError('Failed to upload farm videos.');
    } finally {
      setUploadingFarmMedia(false);
    }
  };

  

  const handleSubmit = async () => {
    const validationError = validateStep(activeStep);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const profileData = {
        display_name: formData.displayName,
        phone: formData.phone,
        location: formData.userType === 'buyer' ? formData.location : '',
        occupation: formData.occupation || '',
        willing_to_volunteer: formData.userType === 'buyer' ? !!formData.willingToVolunteer : !!formData.farm_open_for_volunteers,
        gender: formData.userType === 'seller' ? formData.gender : '',
        pincode: formData.userType === 'seller' ? formData.pincode : '',
        city: formData.userType === 'seller' ? formData.city : '',
        state: formData.userType === 'seller' ? formData.state : '',
        farm_name: formData.userType === 'seller' ? formData.farmName : '',
        aol_courses: formData.userType === 'seller' ? formData.aol_courses : '',
        aol_verified: false,
        farm_area_acres: formData.userType === 'seller' ? formData.farm_area_acres : '',
        farm_features: formData.userType === 'seller' ? (formData.farm_features || []) : [],
        farm_organic_certified: formData.userType === 'seller' ? !!formData.farm_organic_certified : false,
        farm_open_for_volunteers: formData.userType === 'seller' ? !!formData.farm_open_for_volunteers : false,
        journey_writeup: formData.userType === 'seller' ? formData.journey_writeup : '',
        userType: formData.userType,
        farm_photos: formData.userType === 'seller' ? farmImages : [],
        farm_videos: formData.userType === 'seller' ? farmVideos : [],
        farm_description: formData.userType === 'seller' ? formData.farmDescription : '',
        farm_size: formData.userType === 'seller' ? formData.farmSize : '',
        farming_experience: formData.userType === 'seller' ? formData.farmingExperience : '',
        certifications: formData.userType === 'seller' ? formData.certifications : ''
      };

      const result = await signup(formData.email, formData.password, formData.userType, profileData);
      
      if (result.success) {
        setSuccess('Account created successfully! Redirecting to dashboard...');
        setTimeout(() => {
          if (formData.userType === 'seller') {
            navigate('/seller-dashboard');
          } else {
            navigate('/products');
          }
        }, 1000);
      } else {
        setError(result.error || 'Failed to create account');
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = (step) => {
    const label = steps[step];
    switch (label) {
      case 'User Type':
        return (
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Button
              variant={formData.userType === 'buyer' ? 'contained' : 'outlined'}
              size="large"
              onClick={() => { handleInputChange('userType', 'buyer'); setActiveStep(1); }}
            >
              Buyer
            </Button>
            <Button
              variant={formData.userType === 'seller' ? 'contained' : 'outlined'}
              size="large"
              onClick={() => { handleInputChange('userType', 'seller'); setActiveStep(1); }}
            >
              Seller
            </Button>
          </Box>
        );

      case 'Account Details':
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                required
                helperText="Minimum 6 characters"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Confirm Password"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                required
              />
            </Grid>
          </Grid>
        );

      case 'Personal Information':
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Full Name"
                value={formData.displayName}
                onChange={(e) => handleInputChange('displayName', e.target.value)}
                required
              />
            </Grid>
            {formData.userType === 'buyer' ? (
              <>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Mobile Number" value={formData.phone} onChange={(e) => handleInputChange('phone', e.target.value)} />
                </Grid>
                <Grid item xs={12}>
                  <Autocomplete
                    disablePortal
                    options={indiaLocations}
                    value={formData.location}
                    onChange={(e, v) => handleInputChange('location', v || '')}
                    renderInput={(params) => <TextField {...params} label="Location (India)" required />}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Occupation" value={formData.occupation} onChange={(e) => handleInputChange('occupation', e.target.value)} />
                </Grid>
                <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
                  <FormControlLabel control={<Checkbox checked={formData.willingToVolunteer} onChange={(e) => handleInputChange('willingToVolunteer', e.target.checked)} />} label="Willing to Volunteer" />
                </Grid>
              </>
            ) : (
              <>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Mobile Number" value={formData.phone} onChange={(e) => handleInputChange('phone', e.target.value)} />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField fullWidth label="Gender" value={formData.gender} onChange={(e) => handleInputChange('gender', e.target.value)} />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField fullWidth label="Pincode" value={formData.pincode} onChange={(e) => handleInputChange('pincode', e.target.value)} onBlur={handlePincodeLookup} />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField fullWidth label="Occupation" value={formData.occupation} onChange={(e) => handleInputChange('occupation', e.target.value)} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="City" value={formData.city} onChange={(e) => handleInputChange('city', e.target.value)} InputProps={{ readOnly: true }} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="State" value={formData.state} onChange={(e) => handleInputChange('state', e.target.value)} InputProps={{ readOnly: true }} />
                </Grid>
              </>
            )}
            
          </Grid>
        );

      case 'Farm Information':
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2, color: theme.palette.primary.main }}>
                Farm Information
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Help buyers understand your farming practices and what makes your produce special.
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Farm Name"
                value={formData.farmName}
                onChange={(e) => handleInputChange('farmName', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Short writeup about your inspiration and permaculture journey" multiline rows={3} value={formData.journey_writeup} onChange={(e) => handleInputChange('journey_writeup', e.target.value)} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Total Farm area (free of chemical inputs) in acres" value={formData.farm_area_acres} onChange={(e) => handleInputChange('farm_area_acres', e.target.value)} type="number" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="AoL Permaculture Courses done" value={formData.aol_courses} onChange={(e) => handleInputChange('aol_courses', e.target.value)} helperText="Will be verified by AoLP team" />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="features-label">Features applied in your farm</InputLabel>
                <Select
                  labelId="features-label"
                  multiple
                  value={formData.farm_features}
                  label="Features applied in your farm"
                  onChange={(e) => handleInputChange('farm_features', e.target.value)}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                >
                  {['Agroforestry', 'Rain water Harvesting', 'Drip/Sprinkler Irrigation', 'No-Tilling', 'Native Cows', 'Biogas', 'Solar Power'].map((opt) => (
                    <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
              <FormControlLabel control={<Checkbox checked={formData.farm_organic_certified} onChange={(e) => handleInputChange('farm_organic_certified', e.target.checked)} />} label="Organic Certified" />
            </Grid>
            <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
              <FormControlLabel control={<Checkbox checked={formData.farm_open_for_volunteers} onChange={(e) => handleInputChange('farm_open_for_volunteers', e.target.checked)} />} label="Open for Volunteers / Work exchange" />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Farm Description" multiline rows={3} value={formData.farmDescription} onChange={(e) => handleInputChange('farmDescription', e.target.value)} helperText="Describe your farm, growing methods, and what makes your produce special" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Years of Farming Experience" value={formData.farmingExperience} onChange={(e) => handleInputChange('farmingExperience', e.target.value)} type="number" />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Certifications (Organic, Permaculture, etc.)"
                value={formData.certifications}
                onChange={(e) => handleInputChange('certifications', e.target.value)}
                helperText="List any relevant certifications or farming practices"
              />
            </Grid>
          </Grid>
        );
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h3" sx={{ mb: 2, fontWeight: 700, textTransform: 'uppercase' }}>
          Join Our Community
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Connect with local permaculture farmers or discover fresh, organic produce
        </Typography>
      </Box>

      <Card sx={{ maxWidth: 800, mx: 'auto' }}>
        <CardContent sx={{ p: { xs: 2, md: 4 } }}>
          <Stepper 
            activeStep={activeStep} 
            sx={{ mb: 4 }}
            orientation={isMobile ? 'vertical' : 'horizontal'}
          >
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              {success}
            </Alert>
          )}

          <Box sx={{ mb: 4 }}>
            {renderStepContent(activeStep)}
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>Back</Button>
            <Box>
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={loading || (activeStep === 0 && !formData.userType)}
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  '&:hover': { backgroundColor: theme.palette.primary.dark }
                }}
              >
                {loading ? 'Creating Account...' : (activeStep === steps.length - 1 ? 'Create Account' : 'Next')}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="body1" color="text.secondary">
          Already have an account?{' '}
          <Button onClick={() => navigate('/login')} sx={{ textTransform: 'none', fontWeight: 600 }}>
            Sign in here
          </Button>
        </Typography>
      </Box>
    </Container>
  );
}

export default Register;
