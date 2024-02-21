import React, { useContext } from 'react';
import { AppContext } from './AppContext'; // Adjust the import path as needed

const GatedContent = ({ children }) => {
  const { isUserVerified } = useContext(AppContext);

  if (!isUserVerified) {
    return (
      <div>
        <p>Please verify your wallet to proceed.</p>
        {/* This button will still be visible but disabled */}
        <div style={{ pointerEvents: "none", opacity: 0.5 }}>{children}</div>
      </div>
    );
  }

  return <>{children}</>;
};

export default GatedContent;
