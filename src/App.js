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
  const [temporaryReceipt, setTemporaryReceipt] = useState([]);
  const [userSeed, setUserSeed] = useState('');

const handleSeedChange = (e) => {
  setUserSeed(e.target.value);
};

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
  const clearTemporaryReceipt = () => {
    setTemporaryReceipt([]);
  };

  const handleReset = (country) => {
    // Reset the specific country's vote count
    setVotesPerCountry(prevVotes => ({ ...prevVotes, [country]: 0 }));
    // Optionally, clear the temporary receipt related to this country
    setTemporaryReceipt(prevReceipts => prevReceipts.filter(receipt => !receipt.includes(country)));
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
  
    if (!client.isConnected() || !isConnected) {
      setError('Please connect your wallet first.');
      return;
    }
  
    const totalVotes = Object.values(votesPerCountry).reduce((acc, votes) => acc + votes, 0);
    if (totalVotes === 0) {
      setError("Please vote on the countries before confirming donations.");
      return;
    }
  
    setDonationStatus("Processing donations... ⏳");
    console.log('Donation status should be set to processing.');
  
    let receipts = []; // To store donation receipts for each country
  
    for (const [country, votes] of Object.entries(votesPerCountry)) {
      if (votes > 0) {
        const donationAmount = votes * 1;
        if (donationAmount > capital) {
          setError(`Insufficient balance to donate ${donationAmount} XRP to ${country}.`);
          continue; // Skip this donation and continue with the next one
        }
        try {
          const sendResult = await sendXrp(donationAmount, country, userWallet);
          receipts.push(`${donationAmount} XRP to ${country} (TXID: ${sendResult})`);
          // Assume a deduction for the demo
          setCapital(prevCapital => prevCapital - donationAmount);
        } catch (error) {
          console.error("Error during transaction for", country, ":", error);
        }
      }
    }
  
    // Introduce a delay before refreshing the balance
    setTimeout(async () => {
      try {
        const refreshedBalance = await client.getXrpBalance(userWallet.classicAddress);
        setCapital(parseInt(refreshedBalance)); // Update capital with refreshed balance
        console.log("Refreshed User Balance: ", refreshedBalance);
      } catch (error) {
        console.error("Error refreshing balance:", error);
        setError('Failed to refresh account balance.');
      }
    }, 10000); // Delay of 10 seconds
  
    const receiptString = receipts.join(", ");
    setTemporaryReceipt([]); // Clear temporary receipts once the donations are processed
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
            "Amount": xrpToDrops(String(amount)), // Ensure xrpToDrops is correctly imported or available
            "Destination": destination
        });
        const signed = userWallet.sign(prepared);
        const prelimResult = await client.submit(signed.tx_blob);
        console.log('Transaction submitted, preliminary result: ', prelimResult.resultCode);

        // Here, instead of returning resultCode, return the transaction hash
        const transactionID = prelimResult.result?.tx_json?.hash;
        console.log('Transaction ID:', transactionID);

        return transactionID; // Return the transaction ID
    } catch (error) {
        console.error("Error during transaction for", country, ":", error);
        setDonationStatus(`Error during transaction for ${country}`);
        throw error;
    }
};

const handleVote = (country, donationAmount, isReset = false) => {
  // Check if we're resetting the donations
  if (!isReset && donationAmount > 0) {
    setTemporaryReceipt(prevReceipt => [
      ...prevReceipt,
      `Pledged ${donationAmount} XRP to ${country}`
    ]);
  }
  
  if (isReset) {
    setVotesPerCountry(prevVotes => {
      const updatedVotes = { ...prevVotes };
      // Subtract the country's donated amount from the total donations
      const refundedAmount = updatedVotes[country] || 0;
      updatedVotes[country] = 0; // Reset the donation for this country
      setCapital(prevCapital => prevCapital + refundedAmount); // Refund the capital
      return updatedVotes;
    });
  } else {
    // Handle the case for submitting a donation
    if (!donationAmount || donationAmount <= 0) {
      console.error('Invalid donation amount');
      return;
    }
    setVotesPerCountry(prevVotes => {
      const updatedVotes = { ...prevVotes };
      updatedVotes[country] = (updatedVotes[country] || 0) + donationAmount;
      return updatedVotes;
    });
    setCapital(prevCapital => prevCapital - donationAmount); // Deduct the donation from the capital
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
          Welcome to CharityDAO, a decentralized charity platform. Leveraging blockchain, we offer a secure and transparent way for you to contribute to global charitable efforts. 🏩🫂 </p>

          <p>By verifying your humanity with Sismo Connect's ZK proof, and connecting your XRPL testnet wallet, you unlock the ability to directly donate funds cross-boarder to countries to help in global crises situations. You can choose how much to donate for each country based on your budget which will be also viewed in the application. 📈</p>

          <p> But that's not all - as you decide on your preferred countries and specify your donation amounts, you'll receive a real-time tentative voting receipt. This allows you to review your pledges before finalizing them. Upon confirmation, each transaction is executed on the XRPL blockchain, providing you with a transaction ID for transparent tracking on <a href="https://testnet.xrpl.org/">https://testnet.xrpl.org/</a>  as well as a update on your wallet funds. 👨‍💻💰</p>

          <p>Dive into CharityDAO today, and let your voice be heard. It's more than a donation; it's a vote for a better world. 🪂🎁💌          </p>
        </div>
        <div className="prize-pool">
          <h2>Account Capital 💰</h2>
          
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
            {donationAmount > 0 && <p>Total Donation: {donationAmount} XRP</p>}
            {
          temporaryReceipt.length > 0 && !donationStatus
            ? (<p>Temporary Receipt: {temporaryReceipt.join(", ")}</p>)
            : donationStatus && (<p>Status of the Transaction: {donationStatus}</p>)
        }
          </GatedContent>
        </div>
      </div>
      <GatedContent>

      <div className="countries">
        
        {countries.map((country) => (
          
        <VoteOption
          key={country}
          country={country}
          handleVote={handleVote}
          handleReset={() => handleReset(country)}
          isConnected={isConnected} // Assuming isConnected is a state in App.js
        />
          
        ))}
      </div>
      </GatedContent>

      <Footer />  

      </div>
    </div>
    </AppProvider>
  );
  

};

export default App;
