import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import {
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  Snackbar,
  Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { addProductApi } from '../APIservices/allAPI';

export default function ProductForm() {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      ProductName: '',
      ProductCode: '',
      variants: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'variants',
  });

  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });
  const [backendErrors, setBackendErrors] = useState(null);

  const onSubmit = async (data) => {
    setBackendErrors(null);
    const payload = {
      name: data.ProductName,
      code: data.ProductCode,
      variants: data.variants.map((variant) => ({
        name: variant.name,
        options: variant.options.split(',').map((opt) => opt.trim()),
      })),
    };

    try {
      await addProductApi(payload);
      setSnack({ open: true, message: 'Product created successfully!', severity: 'success' });
      reset();
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Error creating product';
      setBackendErrors(errorMsg);
      setSnack({ open: true, message: 'Error creating product', severity: 'error' });
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Add New Product
      </Typography>
      {backendErrors && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {typeof backendErrors === 'string' ? backendErrors : JSON.stringify(backendErrors)}
        </Alert>
      )}
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          fullWidth
          label="Product Name"
          margin="normal"
          {...register('ProductName', { required: 'Product name is required' })}
          error={!!errors.ProductName}
          helperText={errors.ProductName?.message}
        />
        <TextField
          fullWidth
          label="Product Code"
          margin="normal"
          {...register('ProductCode', { required: 'Product code is required' })}
          error={!!errors.ProductCode}
          helperText={errors.ProductCode?.message}
        />

        <Typography variant="h6" mt={3}>
          Variants
        </Typography>
        {fields.map((item, index) => (
          <Box
            key={item.id}
            display="flex"
            alignItems="center"
            gap={2}
            mt={2}
          >
            <TextField
              label="Variant Name"
              fullWidth
              {...register(`variants.${index}.name`, { required: true })}
            />
            <TextField
              label="Options (comma-separated)"
              fullWidth
              {...register(`variants.${index}.options`, { required: true })}
            />
            <IconButton color="error" onClick={() => remove(index)}>
              <DeleteIcon />
            </IconButton>
          </Box>
        ))}

        <Box mt={2}>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => append({ name: '', options: '' })}
          >
            Add Variant
          </Button>
        </Box>

        <Box mt={4}>
          <Button type="submit" variant="contained" fullWidth>
            Create Product
          </Button>
        </Box>
      </form>

      <Snackbar
        open={snack.open}
        autoHideDuration={4000}
        onClose={() => setSnack({ ...snack, open: false })}
      >
        <Alert severity={snack.severity} onClose={() => setSnack({ ...snack, open: false })}>
          {snack.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
