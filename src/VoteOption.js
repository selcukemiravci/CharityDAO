import React, { useState, useEffect } from 'react';
import { ProgressBar } from 'react-bootstrap';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import './VoteOption.css';

const VoteOption = ({ country, handleVote, handleReset, isConnected, targetDonation = 10000 }) => {
  const [donationAmount, setDonationAmount] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [totalDonated, setTotalDonated] = useState(0);
  const [countryImage, setCountryImage] = useState(null);

  useEffect(() => {
    import(`./images/${country.toLowerCase()}.png`)
      .then((image) => setCountryImage(image.default))
      .catch((error) => console.error(`Error loading image: ${error}`));
  }, [country]);

  const handleDonationChange = (event) => {
    setDonationAmount(event.target.value);
  };

  const submitDonation = () => {

    if (!isConnected) {
      setErrorMessage("Please connect your wallet before submitting a donation.");
      return; // Prevent further execution
    }
    const donation = parseInt(donationAmount, 10);

    if (isNaN(donation) || donation <= 0) {
      setErrorMessage('Please enter a positive number for your donation.');
      setResetMessage(''); // Clear reset message when submitting a new donation
    } else {
      setTotalDonated(prevTotal => {
        const updatedTotal = prevTotal + donation;
        setFeedbackMessage(`Just ordered ${donation} XRP Donation, your total donation now is ${totalDonated + donation} XRP. Please confirm your transaction to approve.`);
        return updatedTotal;
      });
      handleVote(country, donation);
      setDonationAmount(''); // Reset input field
      setErrorMessage(''); // Clear any error message
      setResetMessage(''); // Also clear reset message when a valid donation is submitted
    }
  };
  
  const resetDonations = () => {
    // Reset local state as before
    setTotalDonated(0);
    setResetMessage(`Your donations have been reset to 0 XRP`);
    // Clear any error and feedback messages
    setErrorMessage('');
    setFeedbackMessage('');
    // Invoke the reset handler passed from the parent component
    handleReset(); // This will call the function in App.js
  };
  
  
  

  const donationProgress = Math.min((totalDonated / targetDonation) * 100, 100);

  return (
    <div className="vote-option" style={{ paddingBottom: '20px' }}>

      <h3>Target Donation: {targetDonation} XRP</h3>
      {countryImage && <img src={countryImage} alt={country} />}
      <h2>{country}</h2>
      <div style={{ width: '100%', maxWidth: '500px' }}>
      <TextField
        id="outlined-number"
        label="XRP Donation Amount"
        type="number"
        InputLabelProps={{ shrink: true, style: { color: '#fff' } }}
        InputProps={{ style: { color: '#fff', backgroundColor: 'rgba(0, 0, 0, 0.5)' } }}
        variant="outlined"
        value={donationAmount}
        onChange={handleDonationChange}
        fullWidth
        sx={{
          "& .MuiOutlinedInput-root": {
            "& fieldset": { borderColor: "black" },
            "&:hover fieldset": { borderColor: "lightgray" },
            "&.Mui-focused fieldset": { borderColor: "white" },
          }
        }}
      />
      <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'center', width: '100%', gap: '10px' }}>
      <Button variant="contained" onClick={submitDonation} style={{ backgroundColor: '#333', color: 'white' }}>
        Submit Donation
      </Button>
      <Button variant="contained" onClick={resetDonations} style={{ backgroundColor: '#777', color: 'white' }}>
        Reset
      </Button>
      </div>
      {feedbackMessage && <p style={{ color: 'white' }}>{feedbackMessage}</p>}
      {resetMessage && <p style={{ color: 'yellow' }}>{resetMessage}</p>}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

      {/* Ensure the ProgressBar container has a full width */}
      <div style={{ width: '100%', maxWidth: '500px', marginTop: '20px' }}> 
        <ProgressBar striped variant="info" now={donationProgress} label={`${totalDonated} XRP`} style={{ width: '100%' }} />
      </div>
    </div>
    </div>

  );
};



export default VoteOption;
