import React, { useState, useEffect } from 'react';
import { Client, Wallet, xrpToDrops } from 'xrpl';
import { SismoConnectButton, AuthType, SismoConnectResponse } from "@sismo-core/sismo-connect-react";
import { config } from "./sismo-connect-config.ts";
import './App.css';
import Header from './Header.tsx';
import Footer from './Footer';
import VoteOption from './VoteOption';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ProgressBar } from 'react-bootstrap';
import Button from '@mui/material/Button';
import './Header.css';

const countries = ['Singapore', 'Canada', 'Brazil', 'France', 'Australia','Iceland', 'Japan','USA'];

const App = () => {
  const [capital, setCapital] = useState(1000);
  const [yesVotes, setYesVotes] = useState(0);
  const [progress, setProgress] = useState(0);
  const [noVotes, setNoVotes] = useState(0);

  const [client, setClient] = useState(null);
  const [wallet, setWallet] = useState(null);


    useEffect(() => {
    const client = new Client("wss://s.altnet.rippletest.net:51233");
    const wallet = Wallet.fromSeed("sEdTDrA92JzRNCg1EjsZCBjn5MXiWqB"); // Replace with your actual seed
  
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

  const [donationStatus, setDonationStatus] = useState("");
  const [donationAmount, setDonationAmount] = useState(0);
  
  const handleConfirm = async () => {
    const totalDonation = yesVotes * 5; // calculates the total donation based on the number of 'yes' votes
  
    // Check if there's enough capital before making a donation
    if (totalDonation > capital) {
      setDonationStatus("Failed: Not enough capital");
      return;
    }
  
    setDonationAmount(totalDonation);
  
    setDonationStatus(`Processing the request... ⏳ Sending total of ${totalDonation} XRP 🚀.`);
    try {
      if (!client.isConnected()) {
        await client.connect();
      }
  
      const result = await sendXrp(totalDonation); 
  
      // Wait for 4 seconds before checking the result
      setTimeout(async () => {
        setDonationStatus("Donation has been completed 🥳 🎉");    
      }, 4000); // 4000 milliseconds = 4 seconds
  
    } catch (error) {
      console.error("Error during transaction:", error);
      setDonationStatus("Failed with error: " + error.message);
    }
  
    // Reset the donation amount and status after a transaction is completed or when an error occurs
    setDonationAmount(0);
    setYesVotes(0);
    setNoVotes(0);
    // Once the transaction is done, wait 15 seconds and then reload the page
    setTimeout(() => {
      window.location.reload();
    }, 15000); // 15000 milliseconds = 15 seconds
  };
    
  const sendXrp = async (amount) => {
    if (client === null || wallet === null) {
      console.log("Client or wallet is not initialized");
      return;
    }
    const destination = "r4UcZSU1UxiPDQ36453kkipBN3E1DDp3uq"; // The destination address
    
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
      <Footer />
      </div>
    </div>
  );

};

export default App;