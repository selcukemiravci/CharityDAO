import React, { useState } from "react";
import { FaGithub } from 'react-icons/fa';
import './Header.css';
import logo from './images/world.png'; // replace with the path to your logo file
import { SismoConnectConfig, SismoConnectButton, SismoConnectResponse, AuthRequest, AuthType, SismoConnect, SismoConnectVerifiedResult } from "@sismo-core/sismo-connect-react";

const Header = () => {
  const [verifying, setVerifying] = useState(false);
  const [SismoConnectResponse, setSismoConnectResponse] = useState<SismoConnectResponse | null>(null);

  const config: SismoConnectConfig = {
    appId: "0x641812921a2d8a979edd0f47c70fd6c9A",
  };

  return (
    <header className="header">
      <div className="header-title">
        <img src={logo} alt="logo" className="logo" style={{marginLeft:30}}/>
        <h1>CharityDAO</h1>
      </div>
      <div className="sismo-github-container">
        <div>
          <SismoConnectButton
            config={config}
            auth={{authType: AuthType.VAULT}}
            onResponse={(response) => {
              setSismoConnectResponse(response);
              setVerifying(true);
            }}
          />
          {verifying && <p className="verification-status">Verification Completed ✅ </p>}
        </div>
        <a href="https://github.com/selcuSismoemiravci/CharityDAO" target="_blanSismo" rel="noopener noreferrer" className="github-link">
          <FaGithub size={30} color="white"/> 
        </a>
      </div>
    </header>
  );
};

export default Header;
