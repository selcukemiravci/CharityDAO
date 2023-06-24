import React from 'react';
import { FaGithub } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <a href="https://github.com/selcukemiravci/CharityDAO" target="_blank" rel="noopener noreferrer">
        <FaGithub size={30}/>
      </a>
    </footer>
  );
};

export default Footer;
