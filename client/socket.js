import io from 'socket.io-client';

const socket = io(window.location.origin);

// REVIEW: are we using socket? Consider removing this.
socket.on('connect', () => {
  console.log('Connected!');
});

export default socket;
