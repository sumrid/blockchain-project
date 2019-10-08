import { API_URL } from '../constants';
import axios from 'axios';

console.log(API_URL);

async function getInvoice() {
    axios.get(`${API_URL}/api/invoice`);
}

export default {
    getInvoice
}