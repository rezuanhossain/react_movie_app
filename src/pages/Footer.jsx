/* eslint-disable no-unused-vars */
import React from 'react';
import '../index.css';
import { FaFacebook, FaInstagram, FaTwitter, FaPinterest } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer bg-dark text-white py-3">
      <div className="container">
        <div className="row">
          <div className="col-md-6 text-left">
            <p>&copy; 2024 MediaManager. All rights reserved.</p>
          </div>
          <div className="col-md-6 text-right social-icons">
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
              <FaFacebook />
            </a>
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
              <FaInstagram />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <FaTwitter />
            </a>
            <a href="https://www.pinterest.com" target="_blank" rel="noopener noreferrer">
              <FaPinterest />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
