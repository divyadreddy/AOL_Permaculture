import React, { useEffect, useState } from 'react';
import { Container, Typography, Button, Grid, Card, CardContent } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

function SellerListings() {
  const { currentUser } = useAuth();
  const [listings, setListings] = useState([]);

  useEffect(() => {
    // Fetch listings from the server or database
    const fetchListings = async () => {
      // Replace with actual fetch logic
      const fetchedListings = [
        { id: 1, name: 'Product 1', variety: 'Variety A', price: 10, rating: 4.5 },
        { id: 2, name: 'Product 2', variety: 'Variety B', price: 15, rating: 4.0 }
      ];
      setListings(fetchedListings);
    };

    fetchListings();
  }, []);

  const handleUpdate = (id) => {
    // Logic to update the listing
    console.log('Update listing with id:', id);
  };

  const handleDelete = (id) => {
    // Logic to delete the listing
    console.log('Delete listing with id:', id);
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>Your Listings</Typography>
      <Grid container spacing={2}>
        {listings.map((listing) => (
          <Grid item xs={12} sm={6} md={4} key={listing.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{listing.name}</Typography>
                <Typography variant="body2">Variety: {listing.variety}</Typography>
                <Typography variant="body2">Price: ${listing.price}</Typography>
                <Typography variant="body2">Rating: {listing.rating}</Typography>
                <Button variant="contained" color="primary" onClick={() => handleUpdate(listing.id)}>Update</Button>
                <Button variant="outlined" color="secondary" onClick={() => handleDelete(listing.id)}>Delete</Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default SellerListings;
