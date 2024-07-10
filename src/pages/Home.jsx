/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import '../index.css'; 

const Home = () => {
  const [movieData, setMovieData] = useState([]);

  useEffect(() => {
    const storedMovieData = JSON.parse(window.localStorage.getItem('movieData'));
    if (storedMovieData) {
      setMovieData(storedMovieData);
    }
  }, []);

  return (
    <div className="outer-container">
      <div className="row row-cols- g-3 inner-container">
        {movieData.length > 0 && movieData.map((movie, index) => (
          <div className="col" key={index}>
            <div className="card">
              <img src={movie.poster} className="card-img-top" alt="Poster" />
              <div className="card-body">
                <h5 className="card-title">{movie.movie_name}</h5>
                <Link to={`/movies/${index}`} className="btn btn-primary">View Details</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
