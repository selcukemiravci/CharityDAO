import React, { useState } from "react";
import axios from "axios";

import { SismoConnectConfig, SismoConnectButton, SismoConnectResponse, AuthRequest, AuthType } from "@sismo-core/sismo-connect-react";

const config: SismoConnectConfig = {
  // you will need to get an appId from the Factory
  appId: "0x641812921a2d8a979edd0f47c70fd6c9", 
}

function Sismofront() {
  const [verifying, setVerifying] = useState(false);
  const [SismoConnectResponse, setSismoConnectResponse] = useState<SismoConnectResponse | null>(null);

  return (
    <div>
      <SismoConnectButton
        config={config}
        auth={{authType: AuthType.VAULT}}
        onResponse={async (response: SismoConnectResponse) => {
          setSismoConnectResponse(response);
          setVerifying(true);
        }}
      />
      {verifying && <p>Verifying...</p>}
    </div>
  );
}

export default Sismofront;
