import React, { useState, useEffect } from 'react';
import { ProgressBar } from 'react-bootstrap';
import Button from '@mui/material/Button';
import './VoteOption.css';

const VoteOption = ({ country, handleVote }) => {
  const [votes, setVotes] = useState({ yes: Math.floor(Math.random() * 100) + 1, no: Math.floor(Math.random() * 100) + 1 });
  const [countryImage, setCountryImage] = useState(null);
  const [selectedVote, setSelectedVote] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    import(`./images/${country.toLowerCase()}.png`)
      .then((image) => {
        setCountryImage(image.default);
      })
      .catch((error) => {
        console.error(`Error loading image: ${error}`);
      });
  }, [country]);

  const vote = (type) => {
    if (selectedVote === type) {
      setSelectedVote(null);
      setVotes(prevVotes => ({
        ...prevVotes,
        [type]: prevVotes[type] - 1,
      }));
      if (hasVoted) {
        handleVote(country, type, type); // Refund the vote
        setHasVoted(false);
      }
    } else {
      setSelectedVote(type);
      setVotes(prevVotes => ({
        ...prevVotes,
        [type]: prevVotes[type] + 1,
      }));
      if (!hasVoted) {
        handleVote(country, type, selectedVote); // Deduct the vote
        setHasVoted(true);
      }
    }
  };

  const totalVotes = votes.yes + votes.no;
  const yesPercentage = totalVotes ? (votes.yes / totalVotes) * 100 : 0;
  const noPercentage = totalVotes ? (votes.no / totalVotes) * 100 : 0;

  return (
    <div className="vote-option" style={{ paddingBottom: '20px' }}>
      {countryImage && <img src={countryImage} alt={country} />}
      <h2>{country}</h2>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <Button 
      variant="contained"
      onClick={() => vote('yes')}
      disabled={selectedVote === 'no'}
      style={{width: '45%', backgroundColor: selectedVote === 'no' ? 'transparent' : '#333', color: 'white', marginBottom: '10px'}}
      >
      Yes: {yesPercentage.toFixed(2)}%
      </Button>
      <Button 
      variant="contained"
      onClick={() => vote('no')}
      disabled={selectedVote === 'yes'}
      style={{width: '45%', backgroundColor: selectedVote === 'yes' ? 'transparent' : '#333', color: 'white', marginBottom: '10px'}}
      >
      No: {noPercentage.toFixed(2)}%
      </Button>

      </div>
      <ProgressBar>
        <ProgressBar striped variant="success" now={yesPercentage} key={1} />
        <ProgressBar striped variant="danger" now={noPercentage} key={2} />
      </ProgressBar>
    </div>
  );
};

export default VoteOption;