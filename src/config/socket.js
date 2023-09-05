import { io } from 'socket.io-client';

const URL = process.env.NODE_ENV === 'production' ? 'https://chatapp-najajer-api.onrender.com' : 'http://localhost:3002';

//@ts-ignore
export const socket = io(URL);