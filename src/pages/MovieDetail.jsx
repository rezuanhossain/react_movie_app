import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const MovieDetail = () => {
    const { movieId } = useParams();
    const [movie, setMovie] = useState(null);
    const [relatedMovies, setRelatedMovies] = useState([]);
    const [activeTab, setActiveTab] = useState('info');
    const navigate = useNavigate();

    useEffect(() => {
        const storedMovieData = JSON.parse(window.localStorage.getItem('movieData'));
        const storedCategories = JSON.parse(window.localStorage.getItem('categories'));
        const storedGenres = JSON.parse(window.localStorage.getItem('genres'));

        if (storedMovieData) {
            setMovie(storedMovieData[movieId]);

            // Fetch related movie details
            const relatedMoviesData = storedMovieData[movieId].existing_movies.map(movieName => {
                return storedMovieData.find(movie => movie.movie_name === movieName);
            });

            setRelatedMovies(relatedMoviesData);
        }
    }, [movieId]);

    return (
        <div>
            <button onClick={() => navigate('/')} className="btn btn-warning fw-bold mb-3">Homepage</button>

            {movie && (
                <div>
                    <div className="tab-buttons">
                        <button onClick={() => setActiveTab('info')} className="btn btn-primary mx-1">Info</button>
                        <button onClick={() => setActiveTab('trailer')} className="btn btn-primary mx-1">Trailer</button>
                        <button onClick={() => setActiveTab('gallery')} className="btn btn-primary mx-1">Gallery</button>
                        <button onClick={() => setActiveTab('link')} className="btn btn-primary mx-1">Link</button>
                    </div>

                    {activeTab === 'info' && (
                        <div>
                            <h1>{movie.movie_name}</h1>
                            <img src={movie.poster} alt={movie.movie_name} className="img-fluid rounded-start" />
                            <p>{movie.description}</p>
                            <p>Release Date: {new Date(movie.release_date).toLocaleDateString()}</p>
                            <p>Star Cast: {movie.star_cast}</p>
                            <p>Duration: {movie.duration}</p>
                            <p>Category: {movie.category}</p>
                            <p>Genre: {movie.genres.map((genre) => genre.label).join(', ')}</p>
                        </div>
                    )}

                    {activeTab === 'trailer' && (
                        <div>
                            <h1>{movie.movie_name}</h1>
                            <img src={movie.poster} alt={movie.movie_name} className="img-fluid rounded-start mb-3" />
                            <br />
                            <iframe
                                width="560"
                                height="315"
                                src={movie.trailer}
                                title="Movie Trailer"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>
                    )}

                    {activeTab === 'gallery' && (
                        <div>
                            <h1>{movie.movie_name}</h1>
                            <img src={movie.poster} alt={movie.movie_name} className="img-fluid rounded-start mb-3" />
                            <br />
                            {movie.additional_images && movie.additional_images.map((image, index) => (
                                <img key={index} src={image} alt={`Additional ${index}`} className="img-fluid rounded-start" />
                            ))}
                        </div>
                    )}

                    {activeTab === 'link' && (
                        <div>
                            <h1>{movie.movie_name}</h1>
                            <img src={movie.poster} alt={movie.movie_name} className="img-fluid rounded-start mb-3" />
                            <br />
                            {movie.links && movie.links.map((link, index) => (
                                <p key={index}><a href={link.url} target="_blank" rel="noopener noreferrer">{link.label}</a></p>
                            ))}
                        </div>
                    )}

                    {/* Related Movies Section */}
                    <div className="mt-4">
                        <h3>Related Movies</h3>
                        <div className="row">
                            {relatedMovies && relatedMovies.map((relatedMovie, index) => (
                                <div key={index} className="col-md-3 mb-4">
                                    <div className="card">
                                        <img src={relatedMovie.poster} className="card-img-top" alt={relatedMovie.movie_name} />
                                        <div className="card-body">
                                            <h5 className="card-title">{relatedMovie.movie_name}</h5>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MovieDetail;
