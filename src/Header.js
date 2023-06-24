import React from 'react';
import { FaGithub } from 'react-icons/fa';
import './Header.css';
import logo from './images/world.png'; // replace with the path to your logo file

const Header = () => {
  return (
    <header className="header">
      <div className="header-title"> {/* Add this div */}
        <img src={logo} alt="logo" className="logo" style={{marginLeft:30}}/> {/* Ensure this is inside the new div */}
        <h1 >CharityDAO</h1>
      </div>
      <div>
        <button>Connect Wallet</button>
        <a href="https://github.com/selcukemiravci/CharityDAO" target="_blank" rel="noopener noreferrer">
          <FaGithub size={30} color="white"/> {/* Add the color prop */}
        </a>
      </div>
    </header>
  );
};

export default Header;
