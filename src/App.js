import React, { useState } from 'react';
import './App.css';

const countries = ['USA', 'Canada', 'Mexico', 'France', 'Germany', 'Spain'];

const VoteOption = ({ country, handleVote }) => {
  const [displayButtons, setDisplayButtons] = useState(false);

  return (
    <div className="country-container" onClick={() => setDisplayButtons(!displayButtons)} style={{width: '370px', height: '260px'}}>
      <h2>{country}</h2>
      {displayButtons && (
        <div>
          <button onClick={(e) => {e.stopPropagation(); handleVote(country, 'yes')}}>Vote Yes</button>
          <button onClick={(e) => {e.stopPropagation(); handleVote(country, 'no')}}>Vote No</button>
          <button onClick={(e) => {e.stopPropagation(); handleVote(country, 'abstain')}}>Abstain</button>
        </div>
      )}
    </div>
  );
};

const App = () => {
  const [votes, setVotes] = useState({});
  const [prizePool, setPrizePool] = useState(0);

  const handleVote = (country, vote) => {
    setVotes({
      ...votes,
      [country]: vote,
    });
    setPrizePool(prizePool + 10); // increment prize pool by 10 for every vote
  };

  return (
    <div className="App">
      <h1>Country Voting</h1>
      <div className="prize-pool">
        <h2>Prize Pool: ${prizePool}</h2>
      </div>
      <div className="countries">
        {countries.map((country) => (
          <VoteOption key={country} country={country} handleVote={handleVote} />
        ))}
      </div>
    </div>
  );
};

export default App;
