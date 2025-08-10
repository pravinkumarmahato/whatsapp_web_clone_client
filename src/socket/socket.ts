import io from 'socket.io-client';

const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';

export const socket = io(SERVER_URL, {
  auth: {
    token: localStorage.getItem('token')
  }
});

// Update token when it changes
socket.on('connect', () => {
  const token = localStorage.getItem('token');
  if (token) {
    socket.auth = { token };
  }
});