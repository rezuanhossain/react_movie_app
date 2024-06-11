/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

const Home = () => {
  const [movieData, setMovieData] = useState([]);

  useEffect(() => {
    const storedMovieData = JSON.parse(window.localStorage.getItem('movieData'));
    if (storedMovieData) {
      setMovieData(storedMovieData);
    }
  }, []);

  return (
    <>
      <div className="row row-cols-3 g-3">
        {movieData.length > 0 && movieData.map((movie, index) => (
          <Link to={`/movies/${index}`} className="col" key={index}>
            <div className="card">
              <img src={movie.poster} className="card-img-top" alt="Poster" />
              <div className="card-body">
                <h5 className="card-title">{movie.movie_name}</h5>
                <p className="card-text">{movie.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
};

export default Home;
