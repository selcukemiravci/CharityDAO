import React from 'react';
import { FaGithub } from 'react-icons/fa';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <h1>CharityDAO</h1>
      <div>
        <button>Connect Wallet</button>
        <a href="https://github.com/selcukemiravci/CharityDAO" target="_blank" rel="noopener noreferrer">
          <FaGithub size={30}/>
        </a>
      </div>
    </header>
  );
};

export default Header;
