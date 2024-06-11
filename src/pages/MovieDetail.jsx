import  { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const MovieDetail = () => {
  const { movieId } = useParams();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    const storedMovieData = JSON.parse(window.localStorage.getItem('movieData'))[movieId];
    setMovie(storedMovieData);   
  },[]);

  return (
    <div>
      {movie && (
        <div>
            <h1>{movie.movie_name}</h1>
            <img src={movie.poster} alt={movie.movie_name} />
            <p>{movie.description}</p>
            <p>Release Date: {new Date(movie.release_date).toLocaleDateString()}</p>
            <p>Star Cast: {movie.star_cast}</p>
            <p>Genre: {movie.genre}</p>
            <p>Duration: {movie.duration}</p>
            <p>Language: {movie.language}</p>
        </div>
      )}
    </div>
  );
};

export default MovieDetail;
