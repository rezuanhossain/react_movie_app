import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const MovieDetail = () => {
  const { movieId } = useParams();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    const storedMovieData = JSON.parse(window.localStorage.getItem('movieData'));
    setMovie(storedMovieData[movieId]);
  }, [movieId]);

  return (
    <div>
      {movie && (
        <div>
          <h1>{movie.movie_name}</h1>
          <img src={movie.poster} alt={movie.movie_name} className="img-fluid rounded-start" />
          <div className="additional-images">
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
