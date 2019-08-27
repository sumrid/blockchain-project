import io from 'socket.io-client';
import { API_IP } from '../util';

const socket = io(`http://${API_IP}:9000`);

export default socket;