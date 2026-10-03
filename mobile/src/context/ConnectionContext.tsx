import React, { createContext, useContext, useState, ReactNode } from 'react';

type ConnectionContextType = {
  isOnline: boolean;
  setIsOnline: (value: boolean) => void;
  toggleConnection: () => void;
};

const ConnectionContext = createContext<ConnectionContextType | undefined>(undefined);

export const ConnectionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOnline, setIsOnline] = useState(true);

  const toggleConnection = () => {
    setIsOnline((prev) => !prev);
  };

  return (
    <ConnectionContext.Provider value={{ isOnline, setIsOnline, toggleConnection }}>
      {children}
    </ConnectionContext.Provider>
  );
};

export const useConnection = () => {
  const context = useContext(ConnectionContext);
  if (!context) {
    throw new Error('useConnection must be used within a ConnectionProvider');
  }
  return context;
};
