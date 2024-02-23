import React, { useState, useEffect } from 'react';
import { Client, Wallet, xrpToDrops } from 'xrpl';
import { SismoConnectButton, AuthType, SismoConnectResponse } from "@sismo-core/sismo-connect-react";
import './App.css';
import { AppProvider } from './AppContext'; // Adjust the path as necessary
import Header from './Header.tsx';
import GatedContent from './GatedContent'; // Adjust the import path as needed

import Footer from './Footer';
import VoteOption from './VoteOption';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ProgressBar } from 'react-bootstrap';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import './Header.css';

const countries = ['Singapore', 'Canada', 'Brazil', 'France', 'Australia','Iceland', 'Japan','USA'];

const countryWallets = {
  Singapore: 'rha5VWLoYey7d3SLRDk3ppC81qZp6iMtQy',
  Canada: 'rahCX3bwmNJHKP92rBCM8sMCePkttDh4ap',
  Brazil: 'rn5C4DHvZJToUwd1NNKQSNmMC99ZEuTL7q',
  France: 'rUVjbPwkDBxE82JbXP4wJ26KsT3nH31XRT',
  Australia: 'rJNuGFMcCASYa4QYcfPRkobzWgpPaRPQGX',
  Iceland: 'rhW61Gu6fTZMVXp1qNvSbC9jcw8ZW2RqJr',
  Japan: 'rQJkTvPYBGmTXTvZrss867PSEPPF3RkB5A',
  USA: 'rGSFogeY14njsaCw2o3R8UwB9HBPe16t2V'
};

const App = () => {
  const [capital, setCapital] = useState(10000); // Initial balance set to 10000 XRP
  const [yesVotes, setYesVotes] = useState(0);
  const [progress, setProgress] = useState(0);
  const [donationsStatus, setDonationsStatus] = useState({});
  const [noVotes, setNoVotes] = useState(0);
  const [selectedCountry, setSelectedCountry] = useState(countries[0]); // Default to the first country in the list

  const [client, setClient] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [donationStatus, setDonationStatus] = useState("");
  const [donationReceipts, setDonationReceipts] = useState([]);
  const [donationAmount, setDonationAmount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState('');
  const [connectionStatus, setConnectionStatus] = useState('');
  const [userWallet, setUserWallet] = useState(null);

  const [userSeed, setUserSeed] = useState('');

const handleSeedChange = (e) => {
  setUserSeed(e.target.value);
};

  const walletSeed = process.env.REACT_APP_XRP_WALLET_SEED;
  const [votesPerCountry, setVotesPerCountry] = useState({
    Singapore: 0,
    Canada: 0,
    Brazil: 0,
    France: 0,
    Australia: 0,
    Iceland: 0,
    Japan: 0,
    USA: 0,
  });
  
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
    useEffect(() => {
    const client = new Client("wss://s.altnet.rippletest.net:51233");
    const wallet = Wallet.fromSeed(walletSeed); // Replace with your actual seed
  
    // Connect to the client
    const connectClient = async () => {
      await client.connect();
      setClient(client);
      setWallet(wallet);
    }
  
    // Disconnect from the client when component is unmounted
    const disconnectClient = async () => {
      if (client.isConnected()) {
        await client.disconnect();
      }
    }
  
    connectClient();
  
    return () => {
      disconnectClient();
    }
  }, []);
  
  const handleCountryChange = (event) => {
    setSelectedCountry(event.target.value);
  };

  const handleConnect = async () => {
    if (!userSeed.trim()) { // Check if the input is empty or only contains whitespace
      setError("Please enter your wallet's seed phrase before connecting.");
      return;
    }
    setError(''); // Reset any previous error messages
    setUserWallet(Wallet.fromSeed(userSeed));

    // Check for seed phrase validation
    if (!userSeed || userSeed.length < 20) { // Adjust validation logic as needed
      setError('Invalid seed phrase. Please check and try again.');
      return;
    }
  
    // Attempt to connect to the client if not already connected
    if (!client.isConnected()) {
      try {
        await client.connect();
      } catch (error) {
        console.error("Error connecting to client:", error);
        setError('Failed to connect to the client server. Please try again.');
        return;
      }
    }
  
    // Use the user's seed to create a wallet instance
    const userWallet = Wallet.fromSeed(userSeed);
    
    // Get the user's current balance
    try {
      const userBalance = await client.getXrpBalance(userWallet.classicAddress);
      setCapital(parseInt(userBalance)); // Update capital with user's balance
      setConnectionStatus("Status of the Connection: Wallet has been successfully connected 🤝");
      console.log("User Balance: ", userBalance);
      setIsConnected("Wallet Connection: " + true); // Set the connected status to true
    } catch (error) {
      console.error("Error getting balance:", error);
      setError('Failed to get account balance.');
      return;
    }
  };
  
  const handleConfirm = async () => {
    setError(''); // Reset any previous error messages
    setDonationStatus('');

    // Ensure that the client is connected and the wallet instance is valid before proceeding
    if (!client.isConnected() || !isConnected) {
      setError('Please connect your wallet first.');
      return;
    }
    const totalVotes = Object.values(votesPerCountry).reduce((acc, votes) => acc + votes, 0);
    if (totalVotes === 0) {
        setError("Please vote on the countries before confirming donations.");
        return;
    }

    setDonationStatus("Processing donations... ⏳"); // Preliminary status
    console.log('Donation status should be set to processing.');

    let receipts = []; // To store donation receipts for each country
  
    for (const [country, votes] of Object.entries(votesPerCountry)) {
      if (votes > 0) {
        const donationAmount = votes * 5;
        // Check if the user has enough balance to make the donation
        if (donationAmount > capital) {
          setError(`Insufficient balance to donate ${donationAmount} XRP to ${country}.`);
          continue; // Skip this donation and continue with the next one
        }
        try {
          const sendResult = await sendXrp(donationAmount, country, userWallet); // Adjust sendXrp to accept userWallet
          // Successfully donated
          receipts.push(`${donationAmount} XRP to ${country} (TXID: ${sendResult})`);
          // Deduct the donation amount from the user's balance
          setCapital(prevCapital => prevCapital - donationAmount); 
        } catch (error) {
          console.error("Error during transaction for", country, ":", error);
          }
      }
    }
  
    // Combine all receipts into a single string
    const receiptString = receipts.join(", ");
    console.log('Transaction submitted, donation status: ' + receipts);

    // Update the donationStatus with a message that includes all receipts
    setDonationStatus(`Donations processed successfully ✅ ${receiptString}`);

    
  };
 
    
  const sendXrp = async (amount, country, userWallet) => {
    if (client === null || userWallet === null) {
        console.log("Client or wallet is not initialized");
        return;
    }
    const destination = countryWallets[country]; // Dynamically set the destination based on the country
    
    try {
        const prepared = await client.autofill({
            "TransactionType": "Payment",
            "Account": userWallet.address,
            "Amount": xrpToDrops(String(amount)),
            "Destination": destination
        });
        const signed = userWallet.sign(prepared);
        const prelimResult = await client.submit(signed.tx_blob);
        console.log('Transaction submitted, preliminary result: ' + prelimResult.resultCode);

        return prelimResult.resultCode; // or return a more specific transaction ID if available
    } catch (error) {
      console.error("Error during transaction for", country, ":", error);
      setDonationStatus(`Error during transaction for ${country}`);
      throw error;
    }
};

const handleVote = (country, vote, oldVote) => {
  setVotesPerCountry(prevVotes => {
    // Copy the current state to avoid direct mutation
    const updatedVotes = { ...prevVotes };

    // Increment or decrement based on the vote
    if (vote === 'yes') {
      updatedVotes[country] = (updatedVotes[country] || 0) + 1;
    } else if (vote === 'no' && updatedVotes[country] > 0) {
      // Ensure we don't go below 0 votes
      updatedVotes[country] -= 1;
    }

    return updatedVotes;
  });

  // Update the vote counts but not the capital or progress
  if (vote === 'yes') {
    setYesVotes(prevYesVotes => oldVote === 'yes' ? prevYesVotes - 1 : prevYesVotes + 1);
  } else if (vote === 'no') {
    setNoVotes(prevNoVotes => oldVote === 'no' ? prevNoVotes - 1 : prevNoVotes + 1);
  }
};

    
const maxBalance = 10000; // The maximum possible balance
const progressPercentage = (capital / maxBalance) * 100;

  return (
    <AppProvider>
    <div className="App">
      <div className="App-content">
      <Header />
      <div className="info-section">
        <div className="about">
          <h2>About CharityDAO 🤝</h2>
          <p>
          CharityDAO is a decentralized platform fostering global change. For each one of your vote, we will donate 5 XRP from our funding pool to countries/charities, directing funds where they matter most. Join us, and let your vote shape the world 🪂 🎁 💌 </p>
        </div>
        <div className="prize-pool">
          <h2>Charity Capital 💰</h2>
          <div className="fund-amount">{capital} XRP</div>
          <ProgressBar className="fund-progressbar" style={{ marginBottom: '20px' }}>
            <ProgressBar striped variant="success" now={progressPercentage} key={1}  />
            <ProgressBar striped variant="danger" now={100 - progressPercentage} key={2} />
          </ProgressBar>
          <GatedContent>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center', maxWidth: '500px', margin: 'auto' }}>
          <TextField 
            id="filled-basic" 
            label="Enter your XRPL testnet wallet seed phrase" 
            variant="filled"
            type="password" 
            value={userSeed} 
            onChange={handleSeedChange} 
            fullWidth // Ensures the TextField takes the full width of its parent
          />
          <Button onClick={handleConnect} style={{ backgroundColor: '#333', color: 'white', marginLeft: '10px' }}>
            Connect & Show Balance
          </Button>
          <Button onClick={handleConfirm} style={{ backgroundColor: '#333', color: 'white', width: '100%', marginTop: '10px'}}>
            Confirm Votes & Donate Funds 
          </Button>
        </div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {isConnected && <p style={{ color: 'green' }}>Connected to the client server.</p>}
            {donationStatus && <p>Status of the Transaction: {donationStatus}</p>}
            {donationAmount > 0 && <p>Total Donation: {donationAmount} XRP</p>}

          </GatedContent>
        </div>
      </div>
      <div className="countries">
        {countries.map((country) => (
          <VoteOption key={country} country={country} handleVote={handleVote} />
        ))}
      </div>
      <Footer />  

      </div>
    </div>
    </AppProvider>
  );
  

};

export default App;
