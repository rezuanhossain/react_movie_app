/* eslint-disable no-unused-vars */
import React from 'react';
import { Link } from 'react-router-dom';
import '../index.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h1 className='text-info'>MediaManager</h1>
      </div>
      <div className="navbar-right">
        <input type="text" className="form-control" placeholder="Search..." />
      </div>
    </nav>
  );
};

export default Navbar;
