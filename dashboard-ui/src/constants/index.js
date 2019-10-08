const API_IP = process.env.API_IP;
const protocol = window.location.protocol;

const API_URL = `${protocol}//${API_IP}`;

export const API_URL = API_URL;