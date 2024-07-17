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
    <div>
      <div className="outer-container">
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-4 g-3 inner-container">
          {movieData.length > 0 && movieData.map((movie, index) => (
            <div className="col" key={index}>
              <div className="card bg-dark">
                <img src={movie.poster} className="card-img-top rounded-2" alt="Poster" />
                <div className="card-body">
                  <h5 className="text-white">{movie.movie_name}</h5>
                  <Link to={`/movies/${index}`} className="btn btn-primary">Read More</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
    </div>
  );
};

export default Home;

