import React, { useState, useEffect } from 'react';
import './VoteOption.css';

const VoteOption = ({ country, handleVote }) => {
  const [votes, setVotes] = useState({ yes: 0, no: 0 });
  const [countryImage, setCountryImage] = useState(null);

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
    setVotes({ ...votes, [type]: votes[type] + 1 });
    handleVote(country, type);
  };

  return (
    <div className="vote-option">
      {countryImage && <img src={countryImage} alt={country} />}  {/* Display the country image */}
      <h2>{country}</h2>
      <button onClick={() => vote('yes')}>Vote Yes</button>
      <button onClick={() => vote('no')}>Vote No</button>
    </div>
  );
};

export default VoteOption;
