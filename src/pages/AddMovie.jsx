/* eslint-disable no-irregular-whitespace */
/* eslint-disable no-undef */
/* eslint-disable no-useless-escape */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import '../App.css';
import { Link } from "react-router-dom";
import { MultiSelect } from "react-multi-select-component";
import callApi from '../api/api';

const genreOptions = [];
const movieOptions = [];

const AddMovie = () => {
    const [inputs, setInputs] = useState({});
    const [imgData, setImgData] = useState();
    const [additionalImages, setAdditionalImages] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [movieData, setMovieData] = useState([]);
    const [startDate, setStartDate] = useState(new Date());
    const [editIndex, setEditIndex] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedCategories, setSelectedCategories] = useState([]);

    const [categories, setCategories] = useState([]);
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [selectedRelatedMovies, setSelectedRelatedMovies] = useState([]);
   

    // Fetch categories and movies
    useEffect(() => {
        const fetchCategoriesAndMovies = async () => {
            try {
                const categoryResponse = await callApi.get('/categories/get-all-categories');
                setCategories(categoryResponse.data.categories);

                const movieResponse = await callApi.get('/movies/get-all-movies');
                console.log("Fetched movie data:", movieResponse.data.movies);
                setMovieData(movieResponse.data.movies);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchCategoriesAndMovies();
    }, []);

// Other event handlers and render code remains the same

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({ ...values, [name]: value }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        let oldData = JSON.parse(window.localStorage.getItem('movieData')) ?? [];

        let trailerUrl = inputs.trailer;

        const extractVideoId = (url) => {
            const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
            const matches = url.match(regex);
            return matches ? matches[1] : null;
        };

    const videoId = extractVideoId(trailerUrl);
    if (videoId) {
        trailerUrl = `https://www.youtube.com/embed/${videoId}`;
    }

    const movieDetails = {
        ...inputs,
        trailer: trailerUrl,
        release_date: startDate,
        categories: selectedCategories,  // Update here
        genres: selectedGenres,
        additional_images: additionalImages,
        related_movies: selectedRelatedMovies
    };
    

    if (editIndex !== null) {
        oldData[editIndex] = movieDetails;
    } else {
        oldData = [...oldData, movieDetails];
    }

    window.localStorage.setItem('movieData', JSON.stringify(oldData));
    setMovieData(oldData);
    setInputs({});
    setImgData(null);
    setAdditionalImages([]);
    setStartDate(new Date());
    setShowModal(false);
    setEditIndex(null);
    setSelectedCategory("");
    setSelectedGenres([]);
    setSelectedRelatedMovies([]);
};

    const handleDelete = (index) => {
        const deletedData = movieData.filter((_, i) => i !== index);
        setMovieData(deletedData);
        window.localStorage.setItem('movieData', JSON.stringify(deletedData));
    };

    const handleEdit = (index) => {
        const movie = movieData[index];
        setInputs(movie);
        setImgData(movie.poster);
        setAdditionalImages(movie.additional_images || []);
        setStartDate(new Date(movie.release_date));
        setEditIndex(index);
        setShowModal(true);
        setSelectedCategories(movie.categories || []);  // Update here
        setSelectedGenres(movie.genres || []);
        setSelectedRelatedMovies(movie.related_movies || []);
    };
    

    let base64String = "";
    const imageUploaded = (event) => {
        let files = event.target.files;
        let reader = new FileReader();

        reader.onload = function () {
            base64String = reader.result;
            setInputs((prev) => ({
                ...prev,
                "poster": base64String
            }));
            setImgData(base64String);
        };

        reader.readAsDataURL(files[0]);
    };

    const additionalImagesUploaded = (event) => {
        let files = Array.from(event.target.files);
        let promises = files.map(file => {
            return new Promise((resolve, reject) => {
                let reader = new FileReader();
                reader.onload = function () {
                    resolve(reader.result);
                };
                reader.readAsDataURL(file);
            });
        });

        Promise.all(promises).then(images => {
            setAdditionalImages(images);
        });
    };
    
    return (
        <div>
            <header className="bg-warning py-3 mb-4">
                <div className="container">
                    <div className="d-flex justify-content-center">
                        <Link to={'/'} className="fw-bold bg-secondary btn btn-dark mx-2">HomePage</Link>
                        <Link to={'/category'} className="fw-bold bg-secondary btn btn-dark mx-2">Language</Link>
                        <Link to={'/genre'} className="fw-bold bg-secondary btn btn-dark mx-2">Genre</Link>
                    </div>
                </div>
            </header>

            <div className="container">
                <button type="button" className="btn btn-primary mb-4" data-bs-toggle="modal" data-bs-target="#exampleModal" data-bs-whatever="@mdo" onClick={() => setShowModal(true)}>Add Movie</button>
                {showModal && (
                    <div className="modal fade show" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-modal="true" role="dialog" style={{ display: 'block' }}>
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => { setShowModal(false); setEditIndex(null); setSelectedCategory(""); }}></button>
                                </div>
                                <div className="modal-body">
                                    <form onSubmit={handleSubmit}>
                                        <div className="mb-3">
                                            <label htmlFor="formFile" className="form-label">Movie Poster</label>
                                            <input className="form-control" type="file" id="formFile" name='poster' onChange={imageUploaded} required={!imgData} />
                                            <div className=''>
                                                <img src={imgData} alt="" className='h-100px w-100px' />
                                            </div>
                                        </div>
                                        {/* <div className="mb-3">
                                            <label htmlFor="additionalImages" className="form-label">Additional Images</label>
                                            <input className="form-control" type="file" id="additionalImages" name='additionalImages' onChange={additionalImagesUploaded} multiple />
                                            <div className=''>
                                                {additional_images && additional_images.map((img, index) => (
                                                    <img key={index} src={img} alt="" className='h-100px w-100px' />
                                                ))}
                                            </div>
                                        </div> */}
                                        <div className="mb-3">
                                            <label htmlFor="movie_name" className="form-label">Movie Name</label>
                                            <input type="text" className="form-control" id="movie_name" name="movie_name" value={inputs.movie_name || ""} onChange={handleChange} required />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="description" className="form-label">Description</label>
                                            <textarea className="form-control" id="description" rows="3" name="description" value={inputs.description || ""} onChange={handleChange} required></textarea>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="star_cast" className="form-label">Star Cast</label>
                                            <input type="text" className="form-control" id="star_cast" name="star_cast" value={inputs.star_cast || ""} onChange={handleChange} required />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="duration" className="form-label">Duration</label>
                                            <input type="text" className="form-control" id="duration" name="duration" value={inputs.duration || ""} onChange={handleChange} required />
                                        </div>
                                        
                                        <div className="mb-3">
                                            <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} required />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="categories" className="form-label">Languages</label>
                                            <MultiSelect
                                                id="categories"
                                                options={categories.map(category => ({ label: category.name, value: category.name }))}
                                                value={selectedCategories}
                                                onChange={setSelectedCategories}
                                                labelledBy="Select Categories"
                                            />
                                        </div>

                                        
                                        <div className='mb-3'>
                                            <label htmlFor="genres" className="form-label">Genres</label>
                                            <MultiSelect
                                                id = "genres"
                                                options={genreOptions}
                                                value={selectedGenres}
                                                onChange={setSelectedGenres}
                                                labelledBy="Select Genres"
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label htmlFor="relatedMovies" className="form-label">Related Movies</label>
                                            {console.log("aa", movieOptions)}
                                            <MultiSelect
                                                id = "relatedMovies"
                                                options={movieOptions}
                                                value={selectedRelatedMovies}
                                                onChange={setSelectedRelatedMovies}
                                                labelledBy="Select Related Movies"
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label htmlFor="trailer" className="form-label">Trailer Link</label>
                                            <input type="text" className="form-control" id="trailer" name="trailer" value={inputs.trailer || ""} onChange={handleChange} required />
                                        </div>
                                        <button type='submit' className="btn btn-primary">Submit</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Poster</th>
                            <th scope="col">Movie Name</th>
                            <th scope="col">Description</th>
                            <th scope="col">Release Date</th>
                            <th scope="col">Star Cast</th>
                            <th scope="col">Duration</th>
                            <th scope="col">Language</th>
                            <th scope="col">Genre</th>
                            <th scope="col">Related Movies</th>
                            <th scope="col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {movieData.length > 0 && movieData.map((movie, index) => {
                            
                            return (
                                <tr key={index}>
                                    <th scope="row">{index + 1}</th>
                                    <td>
                                        <div className="h-100px w-100px">
                                            <img src={`http://localhost:8000${movie.thumbnail_img}`} className="img-fluid rounded-start" alt={movie.name} />
                                        </div>
                                    </td>
                                    <td>{movie.name}</td>
                                    <td>{movie.description}</td>
                                    <td>{new Date(movie.release_date).toLocaleDateString()}</td>
                                    <td>{movie.star_casts}</td>
                                    <td>{movie.durations}</td>
                                    <td>{movie.genres && JSON.parse(movie.genres)?.map((genre, id) => (
                                        <div key={id}><span>{genre.label}</span><br /></div>
                                    ))}</td>
                                    <td>{movie.related_movies && JSON.parse(movie.related_movies)?.map((movie, id) => (
                                        <div key={id}><span>{movie?.label}</span><br /></div>
                                    ))}</td>
                                    <td>{movie.categories && movie.categories.map((category, id) => (
    <div key={id}><span>{category.label}</span><br /></div>
))}</td>

                                    <td>
                                        <button className="btn btn-danger" onClick={() => handleDelete(index)}>Delete</button>
                                        <button className="btn btn-success" onClick={() => handleEdit(index)}>Edit</button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AddMovie;
