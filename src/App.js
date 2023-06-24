import React, { useState } from 'react';
import './App.css';
import Header from './Header';
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
    }
  };

  const handleConfirm = () => {
    // Do something with yesVotes
    console.log(`Sending funds for ${yesVotes} yes votes.`);
    // Reset votes
    setYesVotes(0);
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
          CharityDAO is a decentralized platform fostering global change. We empower users to vote for deserving countries and charities, directing funds where they matter most. Join us, and let your vote shape the world 🪂 🎁 💸 </p>
        </div>
        <div className="prize-pool">
          <h2>Charity Capital 💰</h2>
          <div className="fund-amount">${capital}</div>
          <ProgressBar className="fund-progressbar">
            <ProgressBar striped variant="success" now={percentage} key={1} />
            <ProgressBar striped variant="danger" now={spentPercentage} key={2} />
          </ProgressBar>
          <Button  onClick={handleConfirm}  style={{ backgroundColor: '#333', color: 'white', marginTop: '10px'}} >Confirm Votes & Donate Funds </Button>
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