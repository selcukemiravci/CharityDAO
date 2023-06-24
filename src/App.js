import React, { useState } from 'react';
import './App.css';

const countries = ['USA', 'Canada', 'Mexico', 'Turkey', 'Vietnam'];

const VoteOption = ({ country, handleVote }) => {
  const [displayButtons, setDisplayButtons] = useState(false);
  const [voteCounts, setVoteCounts] = useState({ yes: 0, no: 0, abstain: 0 });  // Initialize vote distribution
  const [votePercentages, setVotePercentages] = useState({ yes: 0, no: 0, abstain: 0 });  // Initialize vote percentages

  const handleVoteClick = (voteType) => {
    let updatedVoteCounts = {...voteCounts};
    updatedVoteCounts[voteType]++;
    let totalVotes = Object.values(updatedVoteCounts).reduce((a, b) => a + b, 0);

    // Create a new object to hold the updated percentages
    let updatedVotePercentages = {};

    // Update percentages
    for (let vote in updatedVoteCounts) {
      updatedVotePercentages[vote] = (updatedVoteCounts[vote] / totalVotes) * 100;
    }

    setVoteCounts(updatedVoteCounts);
    setVotePercentages(updatedVotePercentages);
    handleVote(country, voteType);
  }

  const calculateColor = (baseColor, percentage) => {
    const alpha = (percentage + 30) / 100;  // Add 30 to the percentage to ensure a minimum alpha value of 0.3
    return `rgba(${baseColor}, ${alpha})`;
  }

  return (
    <div className="country-container" onClick={() => setDisplayButtons(!displayButtons)} style={{width: '370px', height: '260px'}}>
      <h2>{country}</h2>
      {displayButtons && (
        <div>
          <button style={{backgroundColor: calculateColor('0, 128, 0', votePercentages.yes)}} onClick={(e) => {e.stopPropagation(); handleVoteClick('yes')}}>Vote Yes: {votePercentages.yes.toFixed(2)}%</button>
          <button style={{backgroundColor: calculateColor('255, 0, 0', votePercentages.no)}} onClick={(e) => {e.stopPropagation(); handleVoteClick('no')}}>Vote No: {votePercentages.no.toFixed(2)}%</button>
          <button style={{backgroundColor: calculateColor('128, 128, 128', votePercentages.abstain)}} onClick={(e) => {e.stopPropagation(); handleVoteClick('abstain')}}>Abstain: {votePercentages.abstain.toFixed(2)}%</button>
        </div>
      )}
    </div>
  );
};



const App = () => {
  const [capital, setCapital] = useState(200000);

  const handleVote = (country, vote) => {
    if (vote === 'yes') {
      setCapital(capital - 5);  // Deduct $5 from capital for every 'yes' vote
    }
  };

  return (
    <div className="App">
      <h1>Country Voting</h1>
      <div className="prize-pool">
        <h2>Charity Capital: ${capital}</h2>
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
