const API_IP = process.env.API_IP || 'localhost:8002';
const protocol = window.location.protocol;

export const API_URL = `${protocol}//${API_IP}`;