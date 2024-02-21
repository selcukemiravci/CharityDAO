import React, { useState, useEffect } from 'react';
import { Client, Wallet, xrpToDrops } from 'xrpl';
import { SismoConnectButton, AuthType, SismoConnectResponse } from "@sismo-core/sismo-connect-react";
import './App.css';
import Header from './Header.tsx';
import Footer from './Footer';
import VoteOption from './VoteOption';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ProgressBar } from 'react-bootstrap';
import Button from '@mui/material/Button';
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
  const [capital, setCapital] = useState(1000);
  const [yesVotes, setYesVotes] = useState(0);
  const [progress, setProgress] = useState(0);
  const [donationsStatus, setDonationsStatus] = useState({});
  const [noVotes, setNoVotes] = useState(0);
  const [selectedCountry, setSelectedCountry] = useState(countries[0]); // Default to the first country in the list

  const [client, setClient] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [donationStatus, setDonationStatus] = useState("");
  const [donationAmount, setDonationAmount] = useState(0);
  
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
  
  const handleConfirm = async () => {
    if (!client.isConnected()) {
      await client.connect();
    }
  
    // Object to track donations for each country
    let donationsUpdate = {};
  
    for (const [country, votes] of Object.entries(votesPerCountry)) {
      if (votes > 0) {
        const donationAmount = votes * 5;
        try {
          await sendXrp(donationAmount, country);
          donationsUpdate[country] = `Donated ${donationAmount} XRP`;
          await sleep(1000); // Optional: delay to prevent rate limit issues
        } catch (error) {
          console.error("Error during transaction for", country, ":", error);
          donationsUpdate[country] = "Failed to donate";
        }
      }
    }
    console.log("Votes per Country: ",votesPerCountry); // Check and remove later

    setDonationsStatus(donationsUpdate);

  };
  
  
    
  const sendXrp = async (amount, country) => {
    if (client === null || wallet === null) {
      console.log("Client or wallet is not initialized");
      return;
    }
    const destination = countryWallets[country]; // Dynamically set the destination based on the country
    
    try {
      const prepared = await client.autofill({
        "TransactionType": "Payment",
        "Account": wallet.address,
        "Amount": xrpToDrops(String(amount)),
        "Destination": destination
      });  
      const signed = wallet.sign(prepared);
      const prelimResult = await client.submit(signed.tx_blob);

      console.log('Transaction submitted, preliminary result: ' + prelimResult.resultCode);

      return prelimResult.resultCode;
    } catch (error) {
      console.error("Error during transaction:", error);
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
      console.log("Updated Votes: ", updatedVotes); // Check and remove later

    });

    if (vote === 'yes') {
      if (oldVote === 'yes') {
        setCapital(capital + 5); // Refund $5 to capital for every 'yes' vote
        setYesVotes(yesVotes - 1);
        setProgress(progress - 3); // decrease progress
      } else {
        setCapital(capital - 5); // Deduct $5 from capital for every 'yes' vote
        setYesVotes(yesVotes + 1);
        setProgress(progress + 3); // increase progress
      }
    } else if (vote === 'no') {
      if (oldVote === 'no') {
        setNoVotes(noVotes - 1);
      } else {
        setNoVotes(noVotes + 1);
      }
    }
  };
    
  const percentage = Math.round((capital / 1000) * 100);
  const spentPercentage = 100 - percentage;

  return (
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
          <ProgressBar className="fund-progressbar">
            <ProgressBar striped variant="success" now={percentage} key={1} />
            <ProgressBar striped variant="danger" now={spentPercentage} key={2} />
          </ProgressBar>
          <Button onClick={handleConfirm} style={{ backgroundColor: '#333', color: 'white', marginTop: '10px'}} >
            Confirm Votes & Donate Funds 
          </Button>
          {donationStatus !== "" && <p>Status of the Transaction: {donationStatus}</p>}
          {donationAmount > 0 && <p>Total Donation: {donationAmount} XRP</p>}
        </div>
      </div>
      <div className="countries">
        {countries.map((country) => (
          <VoteOption key={country} country={country} handleVote={handleVote} />
        ))}
      </div>
      {/* Donation Statuses Section */}
      <div className="donation-statuses">
        <h3>Donation Statuses:</h3>
        {Object.entries(donationsStatus).map(([country, status]) => (
          <p key={country}>{country}: {status}</p>
        ))}
      </div>
      <Footer />
      </div>
    </div>
  );
  

};

export default App;
