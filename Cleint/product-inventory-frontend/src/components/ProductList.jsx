import React, { useEffect, useState } from 'react';
import { getAllProductsApi } from '../APIservices/allAPI';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Box,
  CardHeader,
  Avatar,
} from '@mui/material';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await getAllProductsApi();
        setProducts(res.data.results);
      } catch (err) {
        console.error('Failed to fetch products:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <Box textAlign="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom>
        Product List
      </Typography>
      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <Card elevation={3}>
              <CardHeader
                avatar={
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    <Inventory2OutlinedIcon />
                  </Avatar>
                }
                title={product.ProductName}
                subheader={`Code: ${product.ProductCode}`}
              />
              <CardContent>
                <Typography variant="body2" color="textSecondary">
                  Total Stock: {parseFloat(product.TotalStock).toFixed(2)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

