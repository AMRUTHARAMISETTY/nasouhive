import React, { createContext, useState } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [userRole, setUserRole] = useState(null);
  const [userName, setUserName] = useState('');

  return (
    <AppContext.Provider value={{ userRole, setUserRole, userName, setUserName }}>
      {children}
    </AppContext.Provider>
  );
};
