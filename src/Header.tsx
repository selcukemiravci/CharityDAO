import React, { useState, useContext } from "react";
import { FaGithub } from 'react-icons/fa';
import './Header.css';
import logo from './images/world.png';
import { SismoConnectConfig, SismoConnectButton, AuthType } from "@sismo-core/sismo-connect-react";
import { AppContext } from './AppContext'; // Importing the context

const Header = () => {
  const { isUserVerified, setIsUserVerified } = useContext(AppContext); // Destructuring to get isUserVerified
  console.log(isUserVerified); // Check the current verification status

  const [verifying, setVerifying] = useState(false);

  const config: SismoConnectConfig = {
    appId: "0x641812921a2d8a979edd0f47c70fd6c9",
  };

  const handleSismoResponse = (response) => {
    if (response) {
      console.log("Sismo Connect Response:", response);
      setIsUserVerified(true); // Update the verification status
  }
  };
  return (
    <header className="header">
      <div className="header-title">
        <img src={logo} alt="logo" className="logo" style={{ marginLeft: 30 }} />
        <h1>CharityDAO</h1>
      </div>
      <div className="sismo-github-container">
        <div>
          {/* Show the SismoConnectButton only if not yet verified */}
          {!isUserVerified && !verifying && (
            <SismoConnectButton
              config={config}
              auths={[
                {authType: AuthType.VAULT},
                {authType: AuthType.GITHUB},
            ]}
              signature={{message: "Authenticating that you are an unique human being to access the CharityDAO with zero-knowledge proofs to interact with the app."}}
              onResponse={handleSismoResponse}
              onLoading={(isLoading) => setVerifying(isLoading)}
              text="Connect Wallet"
            />
          )}
          {/* Display verifying status */}
          {verifying && <p className="verification-status">Verifying...</p>}
          {/* Display success message if verified */}
          {isUserVerified && <p className="verification-status">Wallet Verified ✅</p>}
        </div>
        <a href="https://github.com/selcukemiravci/CharityDAO" target="_blank" rel="noopener noreferrer" className="github-link">
          <FaGithub size={30} color="white" />
        </a>
      </div>
    </header>
  );
};

export default Header;
