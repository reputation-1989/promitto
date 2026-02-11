import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // Get backend URL from environment or use default
    const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
    
    const newSocket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      withCredentials: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    });

    newSocket.on('connect', () => {
      console.log('✅ Socket connected:', newSocket.id);
      setConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('❌ Socket disconnected');
      setConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setConnected(false);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  const joinRoom = (userId) => {
    if (socket && connected) {
      socket.emit('join', userId);
    }
  };

  const sendMessage = (data) => {
    if (socket && connected) {
      socket.emit('sendMessage', data);
    }
  };

  const sendTyping = (data) => {
    if (socket && connected) {
      socket.emit('typing', data);
    }
  };

  const stopTyping = (data) => {
    if (socket && connected) {
      socket.emit('stopTyping', data);
    }
  };

  const setUserOnline = (userId) => {
    if (socket && connected) {
      socket.emit('userOnline', userId);
    }
  };

  return (
    <SocketContext.Provider value={{
      socket,
      connected,
      joinRoom,
      sendMessage,
      sendTyping,
      stopTyping,
      setUserOnline
    }}>
      {children}
    </SocketContext.Provider>
  );
};