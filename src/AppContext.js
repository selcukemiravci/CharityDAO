import React, { createContext, useState } from 'react';

export const AppContext = createContext(null); // Default value can be null

export const AppProvider = ({ children }) => {
  const [isUserVerified, setIsUserVerified] = useState(false);

  return (
    <AppContext.Provider value={{ isUserVerified, setIsUserVerified }}>
      {children}
    </AppContext.Provider>
  );
};
