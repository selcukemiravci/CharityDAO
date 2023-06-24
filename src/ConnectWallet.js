import React, { useState } from 'react';
import detectEthereumProvider from '@metamask/detect-provider';

function ConnectWallet() {
  const [account, setAccount] = useState(null);

  const connectWallet = async () => {
    const provider = await detectEthereumProvider();

    if (provider) {
      const accounts = await provider.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0]);
    } else {
      console.log('Please install MetaMask!');
    }
  };

  return (
    <div>
      <button onClick={connectWallet}>Connect Wallet</button>
      {account && <p>Connected: {account}</p>}
    </div>
  );
}

export default ConnectWallet;
