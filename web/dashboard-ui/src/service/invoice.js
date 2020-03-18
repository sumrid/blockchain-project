import { API_URL } from '../constants';
import axios from 'axios';

console.log(API_URL);

async function getAllInvoices() {
    const res = await axios.get(`${API_URL}/api/invoices`);
    return res.data;
}

async function getInvoice(id) {
    const res = await axios.get(`${API_URL}/api/query/${id}`);
    return res.data;
}

export default {
    getAllInvoices,
    getInvoice
}