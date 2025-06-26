import axios from 'axios';
import base_url from './base_url';

const jsonHeader = {
  headers: { 'Content-Type': 'application/json' }
};

// Product APIs
export const addProductApi = (data) => axios.post(`${base_url}/products/create/`, data, jsonHeader);
export const getAllProductsApi = () => axios.get(`${base_url}/products/`);

// Stock APIs
export const addStockApi = (data) => axios.post(`${base_url}/stock/add/`, data, jsonHeader);
export const removeStockApi = (data) => axios.post(`${base_url}/stock/remove/`, data, jsonHeader);
export const getStockReportApi = (params) => axios.get(`${base_url}/stock/report/`, { params });
