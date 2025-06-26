import React, { useEffect, useState } from 'react';
import { getStockReportApi } from '../APIservices/allAPI';
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField
} from '@mui/material';
import dayjs from 'dayjs';

export default function StockReport() {
  const [report, setReport] = useState([]);
  const [filterDate, setFilterDate] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const res = await getStockReportApi();
        console.log('Stock report response:', res.data);

        // Set correct shape based on backend
        if (Array.isArray(res.data)) {
          setReport(res.data);
        } else if (Array.isArray(res.data.results)) {
          setReport(res.data.results);
        } else {
          setReport([]);
        }
      } catch (err) {
        console.error('Error fetching stock report:', err);
        setReport([]);
      }
    })();
  }, []);

  const filtered = filterDate
    ? (report || []).filter(txn => txn.created_at?.startsWith(filterDate))
    : report || [];

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom>
        Stock Report
      </Typography>

      <TextField
        type="date"
        label="Filter by Date"
        InputLabelProps={{ shrink: true }}
        value={filterDate}
        onChange={(e) => setFilterDate(e.target.value)}
        sx={{ mb: 2 }}
      />

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Product</TableCell>
            <TableCell>Variant</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Quantity</TableCell>
            <TableCell>Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filtered.map((txn, i) => (
            <TableRow key={i}>
              <TableCell>{txn.product || '—'}</TableCell>
              <TableCell>{txn.product_variant || '—'}</TableCell>
              <TableCell>{txn.transaction_type}</TableCell>
              <TableCell>{txn.quantity}</TableCell>
              <TableCell>
                {txn.created_at
                  ? dayjs(txn.created_at).format('YYYY-MM-DD HH:mm')
                  : ''}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}
