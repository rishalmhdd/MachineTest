import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  MenuItem,
  Box,
  Typography,
  Snackbar,
  Alert,
} from '@mui/material';
import { addStockApi, removeStockApi, getAllProductsApi } from '../APIservices/allAPI';

export default function StockManager() {
  const [productId, setProductId] = useState('');
  const [products, setProducts] = useState([]);
  const [size, setSize] = useState('');
  const [color, setColor] = useState('');
  const [quantity, setQuantity] = useState('');
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    getAllProductsApi().then(res => {
      setProducts(res.data?.results || []);
    });
  }, []);

  const handleSubmit = async (type) => {
    const payload = {
      product_id: productId,
      combination: { size, color },
      quantity: Number(quantity),
    };

    try {
      if (type === 'add') await addStockApi(payload);
      else await removeStockApi(payload);
      setSnack({ open: true, message: `Stock ${type}ed successfully!`, severity: 'success' });
      setQuantity('');
    } catch {
      setSnack({ open: true, message: `Failed to ${type} stock`, severity: 'error' });
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom>Stock Manager</Typography>

      <TextField
        select
        fullWidth
        label="Select Product"
        value={productId}
        onChange={e => setProductId(e.target.value)}
        margin="normal"
      >
        {products.map((p) => (
          <MenuItem key={p.id} value={p.id}>
            {p.ProductName} ({p.ProductCode})
          </MenuItem>
        ))}
      </TextField>

      <TextField
        fullWidth
        label="Size"
        value={size}
        onChange={(e) => setSize(e.target.value)}
        margin="normal"
      />
      <TextField
        fullWidth
        label="Color"
        value={color}
        onChange={(e) => setColor(e.target.value)}
        margin="normal"
      />
      <TextField
        fullWidth
        type="number"
        label="Quantity"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        margin="normal"
      />

      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
        <Button
          variant="contained"
          onClick={() => handleSubmit('add')}
        >
          Add Stock
        </Button>
        <Button
          variant="outlined"
          color="error"
          onClick={() => handleSubmit('remove')}
        >
          Remove Stock
        </Button>
      </Box>

      <Snackbar
        open={snack.open}
        autoHideDuration={4000}
        onClose={() => setSnack({ ...snack, open: false })}
      >
        <Alert severity={snack.severity}>{snack.message}</Alert>
      </Snackbar>
    </Box>
  );
}
