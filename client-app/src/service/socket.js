import io from 'socket.io-client';
import { API_IP, PROTOCOL } from '../util';

const URL = `${PROTOCOL}//${API_IP}:9000`;
const socket = io(URL);

console.log(URL);
export default socket;