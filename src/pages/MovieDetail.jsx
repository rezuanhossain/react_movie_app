/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import callApi from '../api/api';
import Viewer from 'react-viewer';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const MovieDetail = () => {
    const { movieId } = useParams();
    const [movie, setMovie] = useState(null);
    const [relatedMovies, setRelatedMovies] = useState([]);
    const [activeTab, setActiveTab] = useState('info');
    const navigate = useNavigate();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const fetchMovieData = async () => {
            try {
                const response = await callApi.get(`/movies/${movieId}`);
                const movieData = response.data.movie;
    
                if (movieData) {
                    
                    movieData.genres = JSON.parse(movieData.genres);
    
                    let cleanAdditionalImages = movieData.additional_images
                        .replace(/\\/g, '')   
                        .replace(/^"|"$/g, ''); 
    
                    try {
                        movieData.additional_images = JSON.parse(cleanAdditionalImages);
                    } catch (parseError) {
                        console.error('Failed to parse additional_images:', parseError);
                        movieData.additional_images = []; 
                    }
    
                    movieData.related_movies = JSON.parse(movieData.related_movies);
                    setMovie(movieData);
                    
                    const relatedMoviesData = await Promise.all(
                        movieData.related_movies.map(async (relatedMovie) => {
                            try {
                                const relatedResponse = await callApi.get(`/movies/${relatedMovie.value}`);
                                const relatedMovieData = relatedResponse.data.movie;
    
                                return {
                                    label: relatedMovie.label,
                                    value: relatedMovie.value,
                                    thumbnail_img: relatedMovieData.thumbnail_img,
                                    name: relatedMovieData.name,
                                };
                            } catch (error) {
                                console.error(`Error fetching related movie ${relatedMovie.value}:`, error);
                                return null; 
                            }
                        })
                    );
    
                    setRelatedMovies(relatedMoviesData.filter(movie => movie !== null));
                }
            } catch (error) {
                console.error('Error fetching movie data:', error);
            }
        };
    
        fetchMovieData();
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
        slidesToScroll: 3,
        prevArrow: <PrevArrow />,
        nextArrow: <NextArrow />
    };
       
    return (
        <div>
            <div style={{ backgroundColor: 'DarkSlateGray' }}>
                <button onClick={() => navigate('/')} className="btn btn-warning fw-bold m-3">Homepage</button>
                

                {movie && (
                    <div className="text-white">
                        <div className="tab-buttons">
                            <button onClick={() => setActiveTab('info')} className="fw-bold btn btn-primary  mx-1">Info</button>
                            <button onClick={() => setActiveTab('trailer')} className="fw-bold btn btn-primary mx-1">Trailer</button>
                            <button onClick={() => setActiveTab('gallery')} className="fw-bold btn btn-primary mx-1">Gallery</button>
                            <button onClick={() => setActiveTab('link')} className="fw-bold btn btn-primary mx-1">Link</button>
                        </div>
                        
                        {activeTab === 'info' && (
                            <div>
                                <h1>{movie.name}</h1>
                                <img src={`${backendUrl}${movie.thumbnail_img}`} alt={movie.name} className="img-fluid rounded-start mb-4" />
                                <hr className='info-line'/>
                                <p className='text-warning m-2'>{movie.description}</p>
                                <p>Release Date: {new Date(movie.release_date).toLocaleDateString()}</p>
                                <p>Star Cast: {movie.star_cast}</p>
                                <p>Duration: {movie.durations} minutes</p>
                                <p>Category: {movie.category}</p>
                                <p>Genre: {movie.genres.map((genre) => genre.label).join(', ')}</p>
                            </div>
                        )}

                        {activeTab === 'trailer' && (
                            <div>
                                <h1>{movie.name}</h1>
                                <img src={`${backendUrl}${movie.thumbnail_img}`} alt={movie.name} className="img-fluid rounded-start mb-3" />
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
                                <h1>{movie.name}</h1>
                                <img src={`${backendUrl}/${movie.thumbnail_img}`} alt={movie.name} className="img-fluid rounded-start mb-3" />
                                <br />
                                <div className='card'>
                                {movie?.additional_images && Array.isArray(movie.additional_images) && movie.additional_images.length > 0 ? (
                                        movie.additional_images.map((image, index) => {
                                            const imageUrl = `${backendUrl}${image}`;
                                            return (
                                                <div className="card mb-3" key={index}>
                                                    <img 
                                                        src={imageUrl} 
                                                        alt={`Additional ${index}`} 
                                                        className="img-fluid rounded-start" 
                                                        onClick={() => {
                                                            setVisible(true);
                                                            setCurrentIndex(index);
                                                        }} 
                                                    />
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <p>No additional images available.</p>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === 'link' && (
                            <div>
                                 <h1>{movie.name}</h1>
                                 <img src={`${backendUrl}/${movie.thumbnail_img}`} alt={movie.name} className="img-fluid rounded-start mb-3" />
                                <br />
                                {movie.links && movie.links.map((link, index) => (
                                    <p key={index}><a href={link.url} target="_blank" rel="noopener noreferrer">{link.label}</a></p>
                                ))}
                            </div>
                        )}
                        
                        <div className="mt-4">
                            <div>
                                <hr className='info-line'/>
                            </div>
                            <h3 className='text-danger'>Related Movies</h3>
                            <Slider {...settings}>
                                {relatedMovies && relatedMovies?.map((relatedMovie, index) => (
                                    <div key={index} className="p-2">
                                    <div className="card">
                                    <img src={`${backendUrl}/${relatedMovie?.thumbnail_img}`} className="card-img-top" alt={relatedMovie.name} />
                                        <div className="card-body">
                                            <h5 className="card-title">{relatedMovie?.name}</h5>
                                        </div>
                                        <Link to={`/movies/${relatedMovie.value}`} className="btn btn-primary">View Details</Link>
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
                            images={
                                movie?.additional_images && Array.isArray(movie.additional_images)
                                    ? movie.additional_images.map((image) => ({
                                        src: `${backendUrl}/${image}`,
                                        alt: ""
                                    }))
                                    : [] 
                            }
                            activeIndex={currentIndex}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default MovieDetail;
