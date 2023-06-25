import React, { useState } from "react";
import { FaGithub } from 'react-icons/fa';
import './Header.css';
import logo from './images/world.png'; // replace with the path to your logo file
import { SismoConnectConfig, SismoConnectButton, SismoConnectResponse, AuthRequest, AuthType, SismoConnect, SismoConnectVerifiedResult } from "@sismo-core/sismo-connect-react";

const Header = () => {
  const [verifying, setVerifying] = useState(false);
  const [SismoConnectResponse, setSismoConnectResponse] = useState<SismoConnectResponse | null>(null);
  
  const config: SismoConnectConfig = {
    appId: "0x641812921a2d8a979edd0f47c70fd6c9",
  };
  return (
    <header className="header">
      <div className="header-title"> {/* Add this div */}
        <img src={logo} alt="logo" className="logo" style={{marginLeft:30}}/> {/* Ensure this is inside the new div */}
        <h1 >CharityDAO</h1>
      </div>
      <div>
        <SismoConnectButton
          config={config}
          auth={{authType: AuthType.VAULT}}
          onResponse={(response) => {
            setSismoConnectResponse(response);
            setVerifying(true);
            // TODO: Send the proof to the bacSismoend for verification
          }}
        />
        {verifying && <p>Verifying...</p>}
        <a href="https://github.com/selcuSismoemiravci/CharityDAO" target="_blanSismo" rel="noopener noreferrer">
          <FaGithub size={30} color="white"/> {/* Add the color prop */}
        </a>
      </div>
    </header>
  );
};

export default Header;
