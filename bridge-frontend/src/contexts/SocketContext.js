// SocketContext.js
import React, { createContext, useEffect, useContext } from 'react';
import io from 'socket.io-client';

const socket = io.connect('http://localhost:3000');

const SocketContext = createContext();

export function useSocket() {
  return useContext(SocketContext);
}

export function SocketProvider({ children }) {


  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
}
