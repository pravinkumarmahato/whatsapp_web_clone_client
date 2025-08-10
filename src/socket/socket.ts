import io, { Socket } from 'socket.io-client';

const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';

export function createSocket(token: string): Socket {
  const socket = io(SERVER_URL, {
    auth: { token }
  });

  socket.on('connect', () => {
    const newToken = localStorage.getItem('token');
    if (newToken) {
      socket.auth = { token: newToken };
    }
  });

  return socket;
}