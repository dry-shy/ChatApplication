import { verifyToken } from '../config/jwt.js';
import User from '../models/User.js';

let onlineUsers = new Map(); // userId -> socketId

export const initializeSocket = (io) => {
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error('Authentication required'));
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return next(new Error('Invalid token'));
    }

    socket.userId = decoded.userId;
    next();
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.userId}`);
    
    onlineUsers.set(socket.userId, socket.id);
    io.emit('user_online', { userId: socket.userId });

    // Broadcast updated online users list
    io.emit('online_users_updated', Array.from(onlineUsers.keys()));

    // Typing indicator
    socket.on('typing', ({ receiverId }) => {
      const receiverSocketId = onlineUsers.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('user_typing', { senderId: socket.userId });
      }
    });

    socket.on('stop_typing', ({ receiverId }) => {
      const receiverSocketId = onlineUsers.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('user_stop_typing', { senderId: socket.userId });
      }
    });

    // Real-time message
    socket.on('send_message', (message) => {
      const receiverSocketId = onlineUsers.get(message.receiver);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('receive_message', message);
      }
    });

    // Message read receipt
    socket.on('message_read', ({ messageId, senderId }) => {
      const senderSocketId = onlineUsers.get(senderId);
      if (senderSocketId) {
        io.to(senderSocketId).emit('message_read_receipt', { messageId });
      }
    });

    // Message seen receipt
    socket.on('message_seen', ({ messageId, senderId }) => {
      const senderSocketId = onlineUsers.get(senderId);
      if (senderSocketId) {
        io.to(senderSocketId).emit('message_seen_receipt', { messageId });
      }
    });

    // Call events
    socket.on('initiate_call', ({ receiverId, data }) => {
      const receiverSocketId = onlineUsers.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('incoming_call', {
          senderId: socket.userId,
          data,
        });
      }
    });

    socket.on('call_answer', ({ receiverId }) => {
      const receiverSocketId = onlineUsers.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('call_answered', { senderId: socket.userId });
      }
    });

    socket.on('call_decline', ({ receiverId }) => {
      const receiverSocketId = onlineUsers.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('call_declined', { senderId: socket.userId });
      }
    });

    socket.on('call_end', ({ receiverId }) => {
      const receiverSocketId = onlineUsers.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('call_ended', { senderId: socket.userId });
      }
    });

    // Disconnect
    socket.on('disconnect', () => {
      onlineUsers.delete(socket.userId);
      io.emit('user_offline', { userId: socket.userId });
      io.emit('online_users_updated', Array.from(onlineUsers.keys()));
      console.log(`User disconnected: ${socket.userId}`);
    });
  });
};

export const getOnlineUsers = () => Array.from(onlineUsers.keys());
export const getSocketId = (userId) => onlineUsers.get(userId);
