import React, { useState, useEffect } from 'react';
import { ProgressBar } from 'react-bootstrap';
import './VoteOption.css';

const VoteOption = ({ country, handleVote }) => {
  const [votes, setVotes] = useState({ yes: 0, no: 0 });
  const [voteChangeCount, setVoteChangeCount] = useState(0);
  const [countryImage, setCountryImage] = useState(null);
  const [lastVote, setLastVote] = useState(null);
  const [warning, setWarning] = useState('');

  useEffect(() => {
    const storedVote = localStorage.getItem(`vote-${country}`);
    if (storedVote) {
      setLastVote(storedVote);
    }

    import(`./images/${country.toLowerCase()}.png`)
      .then((image) => {
        setCountryImage(image.default);
      })
      .catch((error) => {
        console.error(`Error loading image: ${error}`);
      });
  }, [country]);

  const vote = (type) => {
    setVotes({ ...votes, [type]: votes[type] + 1 });
    handleVote(country, type);
    setLastVote(type);
    localStorage.setItem(`vote-${country}`, type);
  };

  const getButtonColor = (type) => {
    const totalVotes = votes.yes + votes.no;
    if (totalVotes === 0) return 'grey';
    const percentage = votes[type] / totalVotes;
    if (percentage > 0.5) return 'green';
    if (percentage < 0.5) return 'red';
    return 'navy';
  };

  const totalVotes = votes.yes + votes.no;
  const yesPercentage = totalVotes ? (votes.yes / totalVotes) * 100 : 0;
  const noPercentage = totalVotes ? (votes.no / totalVotes) * 100 : 0;

  return (
    <div className="vote-option" style={ {paddingBottom: '20px'}}>
      {countryImage && <img src={countryImage} alt={country} />}
      <h2>{country}</h2>
      <button 
        style={{backgroundColor: getButtonColor('yes'), width: '150px', height: '50px', margin: '10px'}}
        onClick={() => vote('yes')}
      >
        Yes: ({((votes.yes / (votes.yes + votes.no || 1)) * 100).toFixed(2)}%)
      </button>
      <button 
        style={{backgroundColor: getButtonColor('no'), width: '150px', height: '50px', margin: '10px'}}
        onClick={() => vote('no')}
      >
        No: ({((votes.no / (votes.yes + votes.no || 1)) * 100).toFixed(2)}%)
      </button>
      <ProgressBar>
        <ProgressBar striped variant="success" now={yesPercentage} key={1} />
        <ProgressBar striped variant="danger" now={noPercentage} key={2} />
      </ProgressBar>
      {warning && <p>{warning}</p>}
    </div>
  );
};

export default VoteOption;
