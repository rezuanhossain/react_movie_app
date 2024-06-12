/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import GenreForm from '../components/Genre';
import { Link } from "react-router-dom";

const GenrePage = () => {
  const [selectedGenre, setSelectedGenre] = useState("");

  return (
    <div>
      <div className='m-5'>
        <Link to={'/admin'}><button>Back to Add Movie</button></Link>
      </div>
      <GenreForm selectedGenre={selectedGenre} setSelectedGenre={setSelectedGenre} />
    </div>
  );
}

export default GenrePage;
