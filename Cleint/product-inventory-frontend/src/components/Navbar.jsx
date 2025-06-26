
import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Inventory System
        </Typography>
        <Button color="inherit" component={Link} to="/">Home</Button>
        <Button color="inherit" component={Link} to="/add-product">Add Product</Button>
        <Button color="inherit" component={Link} to="/manage-stock">Manage Stock</Button>
        <Button color="inherit" component={Link} to="/report">Stock Report</Button>
      </Toolbar>
    </AppBar>
  );
}