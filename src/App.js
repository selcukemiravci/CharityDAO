import React, { useState } from 'react';
import './App.css';
import Header from './Header';
import Footer from './Footer';
import VoteOption from './VoteOption';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ProgressBar } from 'react-bootstrap';
import { BiCoinStack } from 'react-icons/bi';
import './Header.css';

const countries = ['USA', 'Canada', 'Brazil', 'Turkey', 'Iceland', 'Egypt'];

const App = () => {
  const [capital, setCapital] = useState(1000);

  const handleVote = (country, vote) => {
    if (vote === 'yes') {
      setCapital(capital - 5);  // Deduct $5 from capital for every 'yes' vote
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
          CharityDAO is a decentralized platform fostering global change. We empower users to vote for deserving countries and charities, directing funds where they matter most. Join us, and let your vote shape the world 🪂 🎁 💸 </p>
        </div>
        <div className="prize-pool">
          <h2>Charity Capital 💰</h2>
          <div className="fund-amount">${capital}</div>
          <ProgressBar className="fund-progressbar">
            <ProgressBar striped variant="success" now={percentage} key={1} />
            <ProgressBar striped variant="danger" now={spentPercentage} key={2} />
          </ProgressBar>
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
