/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const MovieDetail = () => {
  const { movieId } = useParams();
  const [movie, setMovie] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedMovieData = JSON.parse(window.localStorage.getItem('movieData'));
    setMovie(storedMovieData[movieId]);
  }, [movieId]);

  return (
    <div>
      {movie && (
        <div>
          <button onClick={() => navigate('/')} className="btn btn-warning fw-bold mb-3">Homepage</button>
          <h1>{movie.movie_name}</h1>
          <img src={movie.poster} alt={movie.movie_name} className="img-fluid rounded-start" />
          <div className="additional-images">
            <h4>ScreenShort</h4>
            {movie.additional_images && movie.additional_images.map((image, index) => (
              <img key={index} src={image} alt={`Additional ${index}`} className="img-fluid rounded-start" />
            ))}
          </div>
          <p>{movie.description}</p>
          <p>Release Date: {new Date(movie.release_date).toLocaleDateString()}</p>
          <p>Star Cast: {movie.star_cast}</p>
          <p>Duration: {movie.duration}</p>
          <p>Language: {movie.language}</p>
          <p>Genre: {movie.genre}</p>
        </div>
      )}
    </div>
  );
};

export default MovieDetail;
