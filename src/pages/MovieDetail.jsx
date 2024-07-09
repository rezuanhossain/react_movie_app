/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Viewer from 'react-viewer';

const MovieDetail = () => {
    const { movieId } = useParams();
    const [movie, setMovie] = useState(null);
    const [relatedMovies, setRelatedMovies] = useState([]);
    const [activeTab, setActiveTab] = useState('info');
    const navigate = useNavigate();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const storedMovieData = JSON.parse(window.localStorage.getItem('movieData'));
        if (storedMovieData) {
            setMovie(storedMovieData[movieId]);
            if (storedMovieData[movieId] && storedMovieData[movieId].related_movies) {
                const relatedMoviesData = storedMovieData[movieId].related_movies.map(movieName => {
                    return storedMovieData.find(movie => movie.movie_name === movieName.label);
                });
                setRelatedMovies(relatedMoviesData);
            } else {
                setRelatedMovies([]);
            }
        }
    }, [movieId]);

    const PrevArrow = (props) => {
        const { className, style, onClick } = props;
        return (
            <div
                className={className}
                style={{ ...style, display: "block", background: "green" }}
                onClick={onClick}
            />
        );
    };

    const NextArrow = (props) => {
        const { className, style, onClick } = props;
        return (
            <div
                className={className}
                style={{ ...style, display: "block", background: "green" }}
                onClick={onClick}
            />
        );
    };

    const settings = {
        dots: true,
        infinite: true,
        autoplay: true,
        speed: 500,
        autoplaySpeed: 2000,
        slidesToShow: 3,
        slidesToScroll: 1,
        prevArrow: <PrevArrow />,
        nextArrow: <NextArrow />
    };

    return (
        <div>
            <button onClick={() => navigate('/')} className="btn btn-warning fw-bold mb-3">Homepage</button>

            {movie && (
                <div className="text-white">
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
                                <img key={index} src={image} alt={`Additional ${index}`} className="img-fluid rounded-start" onClick={() => {
                                    setVisible(true);
                                    setCurrentIndex(index);
                                }} />
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

                    <div className="mt-4">
                        <h3>Related Movies</h3>
                        <Slider {...settings}>
                            {relatedMovies && relatedMovies.map((relatedMovie, index) => (
                                <div key={index} className="p-2">
                                    <div className="card">
                                        <img src={relatedMovie.poster} className="card-img-top" alt={relatedMovie.movie_name} />
                                        <div className="card-body">
                                            <h5 className="card-title">{relatedMovie.movie_name}</h5>
                                        </div>
                                        <Link to={`/movies/${relatedMovie.id}`} className="btn btn-primary">View Details</Link>
                                    </div>
                                </div>
                            ))}
                        </Slider>
                    </div>
                    <Viewer
                        visible={visible}
                        drag={false}
                        rotatable={false}
                        scalable={false}
                        onClose={() => setVisible(false)}
                        images={movie.additional_images.map((image) => ({ src: image, alt: "" }))}
                        activeIndex={currentIndex}
                    />
                </div>
            )}
        </div>
    );
};

export default MovieDetail;
