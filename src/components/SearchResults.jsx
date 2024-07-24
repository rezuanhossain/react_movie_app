/* eslint-disable no-undef */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';



const SearchResults = () => {
  const { searchTerm } = useParams();
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedMovieData = JSON.parse(window.localStorage.getItem('movieData'));
    if (storedMovieData) {
      const results = storedMovieData.filter(movie =>
        movie.movie_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(results);
    }
  }, [searchTerm]);

  return (
    <div>
        <div style={{ backgroundColor: 'DarkSlateGray' }}>
        <button onClick={() => navigate('/')} className="btn btn-warning fw-bold m-3">Homepage</button>
        </div>
     
      <div className="container mt-4">
        <h2>Search Results for: "{searchTerm}"</h2>
        <div className="row">
          {searchResults.map((movie, index) => (
            <div className="col-md-4 mb-4" key={index}>
              <div className="card">
                <img src={movie.poster} className="card-img-top" alt={movie.movie_name} />
                <div className="card-body">
                  <h5 className="card-title">{movie.movie_name}</h5>
                  <p className="card-text">{movie.description}</p>
                  <Link to={`/movies/${index}`} className="btn btn-primary">View Details</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
