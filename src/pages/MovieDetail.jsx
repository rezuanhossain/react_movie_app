import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";
import Slider from "react-slick";

const MovieDetail = () => {
    const { movieId } = useParams();
    const [movie, setMovie] = useState(null);
    const [relatedMovies, setRelatedMovies] = useState([]);
    const [activeTab, setActiveTab] = useState('info');
    const navigate = useNavigate();
    let sliderRef = useRef(null);

    useEffect(() => {
        const storedMovieData = JSON.parse(window.localStorage.getItem('movieData'));
        const storedCategories = JSON.parse(window.localStorage.getItem('categories'));
        const storedGenres = JSON.parse(window.localStorage.getItem('genres'));

        if (storedMovieData) {
            setMovie(storedMovieData[movieId]);
            if (Object.keys(storedMovieData[movieId]).includes('related_movies')){
                const relatedMoviesData = [];
                 storedMovieData[movieId].related_movies.map(movieName => {
                    relatedMoviesData [movieName.value] = storedMovieData.find((movie,index) => movie.movie_name == movieName.label);
                });
                
                setRelatedMovies(relatedMoviesData);
            }
            else{
                setRelatedMovies([]);
            }    
        }
    }, [movieId]);

    const next = () => {
      sliderRef.slickNext();
    };
    const previous = () => {
      sliderRef.slickPrev();
    };

    var settings = {
        dots: true,
        infinite: true,
        arrow:false,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        lazyLoad: true,
        autoplay: true,
        autoplaySpeed: 2000,
        pauseOnHover: true,
        
        responsive: [
            {
              breakpoint: 1024,
              settings: {
                slidesToShow: 3,
                slidesToScroll: 3,
                infinite: true,
                dots: true
              }
            },
            {
              breakpoint: 600,
              settings: {
                slidesToShow: 2,
                slidesToScroll: 2,
                initialSlide: 2
              }
            },
            {
              breakpoint: 480,
              settings: {
                slidesToShow: 1,
                slidesToScroll: 1
              }
            }
          ]
      };

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
                                        <Link to={`/movies/${index}`} className="btn btn-primary">View Details</Link>
                                    </div>
                                </div>
                            ))}
                        </div>

                    </div>
                    <div className="">
                        <h2>Auto Play {"&"} Pause with buttons</h2>
                        <Slider ref={slider => (sliderRef = slider)} {...settings}>
                            <div>
                            <h3>1</h3>
                            </div>
                            <div>
                            <h3>2</h3>
                            </div>
                            <div>
                            <h3>3</h3>
                            </div>
                            <div>
                            <h3>4</h3>
                            </div>
                            <div>
                            <h3>5</h3>
                            </div>
                            <div>
                            <h3>6</h3>
                            </div>
                        </Slider>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MovieDetail;
