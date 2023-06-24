import React, { useState } from 'react';
import './App.css';
import Header from './Header';
import Footer from './Footer';
import VoteOption from './VoteOption';
import 'bootstrap/dist/css/bootstrap.min.css';

const countries = ['USA', 'Canada', 'Brazil', 'Turkey', 'Iceland'];

const App = () => {
  const [capital, setCapital] = useState(200000);

  const handleVote = (country, vote) => {
    if (vote === 'yes') {
      setCapital(capital - 5);  // Deduct $5 from capital for every 'yes' vote
    }
  };

  return (
    <div className="App">
      <Header />
      <div className="prize-pool">
        <h2>Charity Capital: ${capital}</h2>
      </div>
      <div className="countries">
        {countries.map((country) => (
          <VoteOption key={country} country={country} handleVote={handleVote} />
        ))}
      </div>
      <Footer />
    </div>
  );
};

export default App;
