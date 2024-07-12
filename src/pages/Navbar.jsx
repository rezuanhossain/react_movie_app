/* eslint-disable no-unused-vars */
import React from 'react';
import '../index.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-left m-1">
        <h1 className='text-info'>MediaManager</h1>
      </div>
      <div className="navbar-right m-1">
        <input type="text" className="form-control" placeholder="Search..." />
      </div>
    </nav>
  );
};

export default Navbar;
