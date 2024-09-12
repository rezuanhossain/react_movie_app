/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import '../index.css'; 
import callApi from '../api/api';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const Home = () => {
  const [movieData, setMovieData] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await callApi.get('/movies/get-all-movies');
        setMovieData(response.data.movies);
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
  };
  fetchMovies();
  }, []);

  return (
    <div>
      <header className="bg-warning py-3 mb-4">
                <div className="container">
                    <div className="d-flex justify-content-center">
                        <Link to={'/'} className="fw-bold bg-secondary btn btn-dark mx-2">HomePage</Link>
                    </div>
                </div>
            </header>
      <div className="outer-container">
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-4 g-3 inner-container">
          {movieData.length > 0 && movieData.map((movie, index) => (
            <div className="col" key={index}>
              <div className="card bg-dark">
              <img src={`${backendUrl}/${movie.thumbnail_img}`}   className="card-img-top" alt="Poster" />
                <div className="card-body">
                  <h5 className="card-title">{movie.name}</h5>
                  <Link to={`/movies/${movie.id}`} className="btn btn-primary">Read More</Link>
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

