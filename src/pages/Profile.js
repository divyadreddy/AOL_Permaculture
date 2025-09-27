import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, Card, CardContent, Grid, TextField, Button, Alert, FormControlLabel, Checkbox, Chip, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

function Profile() {
  const { currentUser, userProfile, updateUserProfile } = useAuth();
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (userProfile) {
      setForm({
        display_name: userProfile.display_name || userProfile.displayName || '',
        phone: userProfile.phone || '',
        // buyer fields
        location: userProfile.location || '',
        occupation: userProfile.occupation || '',
        willing_to_volunteer: !!userProfile.willing_to_volunteer,
        // seller fields
        gender: userProfile.gender || '',
        pincode: userProfile.pincode || '',
        city: userProfile.city || '',
        state: userProfile.state || '',
        farm_name: userProfile.farm_name || '',
        aol_courses: userProfile.aol_courses || '',
        farm_area_acres: userProfile.farm_area_acres || userProfile.farm_size || '',
        farm_features: userProfile.farm_features || [],
        farm_organic_certified: !!userProfile.farm_organic_certified,
        farm_open_for_volunteers: !!userProfile.farm_open_for_volunteers,
        journey_writeup: userProfile.journey_writeup || '',
        farm_description: userProfile.farm_description || '',
        farming_experience: userProfile.farming_experience || '',
        certifications: userProfile.certifications || '',
        farm_photos: userProfile.farm_photos || [],
        farm_videos: userProfile.farm_videos || [],
      });
    }
  }, [userProfile]);

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setMessage('');
    try {
      const result = await updateUserProfile(currentUser.uid, form);
      if (result.success) {
        setMessage('Profile updated successfully');
      } else {
        setError(result.error || 'Failed to update profile');
      }
    } catch (e) {
      setError('Unexpected error while updating profile');
    } finally {
      setSaving(false);
    }
  };

  const isSeller = (userProfile?.user_type || userProfile?.userType) === 'seller';

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" sx={{ fontWeight: 700, textTransform: 'uppercase', mb: 1 }}>Your Profile</Typography>
        <Typography variant="body1" color="text.secondary">Update your account and {isSeller ? 'farm' : 'address'} information</Typography>
      </Box>

      <Card>
        <CardContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField fullWidth label="Full Name" value={form.display_name || ''} onChange={(e) => handleChange('display_name', e.target.value)} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Phone" value={form.phone || ''} onChange={(e) => handleChange('phone', e.target.value)} />
            </Grid>

            {!isSeller && (
              <>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Location (India)" value={form.location || ''} onChange={(e) => handleChange('location', e.target.value)} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Occupation" value={form.occupation || ''} onChange={(e) => handleChange('occupation', e.target.value)} />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel control={<Checkbox checked={!!form.willing_to_volunteer} onChange={(e) => handleChange('willing_to_volunteer', e.target.checked)} />} label="Willing to Volunteer" />
                </Grid>
              </>
            )}

            {isSeller && (
              <>
                <Grid item xs={12} sm={4}>
                  <TextField fullWidth label="Gender" value={form.gender || ''} onChange={(e) => handleChange('gender', e.target.value)} />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField fullWidth label="Pincode" value={form.pincode || ''} onChange={(e) => handleChange('pincode', e.target.value)} />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField fullWidth label="Occupation" value={form.occupation || ''} onChange={(e) => handleChange('occupation', e.target.value)} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="City" value={form.city || ''} onChange={(e) => handleChange('city', e.target.value)} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="State" value={form.state || ''} onChange={(e) => handleChange('state', e.target.value)} />
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>Farm Information</Typography>
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label="Farm Name" value={form.farm_name || ''} onChange={(e) => handleChange('farm_name', e.target.value)} />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth multiline rows={3} label="Inspiration and permaculture journey" value={form.journey_writeup || ''} onChange={(e) => handleChange('journey_writeup', e.target.value)} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth type="number" label="Total farm area (acres)" value={form.farm_area_acres || ''} onChange={(e) => handleChange('farm_area_acres', e.target.value)} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="AoL Permaculture Courses done" value={form.aol_courses || ''} onChange={(e) => handleChange('aol_courses', e.target.value)} />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id="features-label">Features applied in your farm</InputLabel>
                    <Select
                      labelId="features-label"
                      multiple
                      value={form.farm_features || []}
                      label="Features applied in your farm"
                      onChange={(e) => handleChange('farm_features', e.target.value)}
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {(selected || []).map((value) => (
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
                <Grid item xs={12} sm={6}>
                  <FormControlLabel control={<Checkbox checked={!!form.farm_organic_certified} onChange={(e) => handleChange('farm_organic_certified', e.target.checked)} />} label="Organic Certified" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControlLabel control={<Checkbox checked={!!form.farm_open_for_volunteers} onChange={(e) => handleChange('farm_open_for_volunteers', e.target.checked)} />} label="Open for Volunteers / Work exchange" />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth multiline rows={3} label="Farm Description" value={form.farm_description || ''} onChange={(e) => handleChange('farm_description', e.target.value)} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth type="number" label="Years of Experience" value={form.farming_experience || ''} onChange={(e) => handleChange('farming_experience', e.target.value)} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Certifications" value={form.certifications || ''} onChange={(e) => handleChange('certifications', e.target.value)} />
                </Grid>
                {(form.farm_photos && form.farm_photos.length > 0) && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" sx={{ mb: 1 }}>Farm Photos</Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {form.farm_photos.map((src, idx) => (
                        <img key={idx} src={src} alt={`farm-${idx}`} style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 6 }} />
                      ))}
                    </Box>
                  </Grid>
                )}
                {(form.farm_videos && form.farm_videos.length > 0) && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" sx={{ mb: 1 }}>Farm Videos</Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {form.farm_videos.map((src, idx) => (
                        <video key={idx} src={src} style={{ width: 120, height: 80, objectFit: 'cover', borderRadius: 6 }} controls />
                      ))}
                    </Box>
                  </Grid>
                )}
              </>
            )}
          </Grid>

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="contained" onClick={handleSave} disabled={saving}>Save Changes</Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}

export default Profile;


