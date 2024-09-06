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
const backendUrl = process.env.REACT_APP_BACKEND_URL;

const AddMovie = () => {

    const [inputs, setInputs] = useState({});
    const [imgData, setImgData] = useState();
    const [additionalImages, setAdditionalImages] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [movieData, setMovieData] = useState([]);
    const [startDate, setStartDate] = useState(new Date());
    const [editIndex, setEditIndex] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [categories, setCategories] = useState([]);
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [selectedRelatedMovies, setSelectedRelatedMovies] = useState([]);
    const [additionalImageFiles, setAdditionalImageFiles] = useState([]);


    //Fetch movies 
    useEffect(() => {
        const fetchMovies = async () => {
            try {
              const response = await callApi.get('/movies/get-all-movies');
              setMovieData(response.data.movies);
    
              if (response.data.movies) {
                response.data.movies.map((movie,index) => {
                    let movieObj = {
                        label: movie.name, 
                        value: movie.id
                    }
                    movieOptions.push(movieObj);
                });
            }
            } catch (error) {
              console.error('Error fetching movies:', error);
            }
        };
        fetchMovies();
    }, []);

    // Fetch categories and movies
    useEffect(() => {
        const fetchCategoriesAndMovies = async () => {
            try {
                const categoryResponse = await callApi.get('/categories/get-all-categories');
                setCategories(categoryResponse.data.categories);
    
                const movieResponse = await callApi.get('/movies/get-all-movies');
                console.log("Fetched movie data:", movieResponse.data.movies);
                setMovieData(movieResponse.data.movies);
    
                movieOptions.length = 0;  
                movieResponse.data.movies.forEach(movie => movieOptions.push({ label: movie.name, value: movie.name }));
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchCategoriesAndMovies();
    }, []);
    
    // Fetch genres and movies
    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const genreResponse = await callApi.get('/genres/get-all-genres');
                const genres = genreResponse.data.genres;
                genreOptions.length = 0;  
                genres.forEach(genre => genreOptions.push({ label: genre.name, value: genre.name }));
            } catch (error) {
                console.error('Error fetching genres:', error);
            }
        };
    
        fetchGenres();
    }, []);
    

// Other event handlers and render code remains the same

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({ ...values, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        let trailerUrl = inputs.trailer_url;
        if (trailerUrl.includes("watch?v=")) {
            trailerUrl = trailerUrl.replace("watch?v=", "embed/");
        }
    
        const formData = new FormData();
        formData.append('name', inputs.name);
        formData.append('description', inputs.description);
        formData.append('category_id', selectedCategory);
        formData.append('release_date', startDate.toISOString().split('T')[0]);
        formData.append('trailer_url', trailerUrl);
        formData.append('star_casts', inputs.star_casts);
        formData.append('durations', inputs.durations);
    
        if (inputs.poster) {
            formData.append('thumbnail_img', inputs.poster);
        }
    
        formData.append('genres', JSON.stringify(selectedGenres));
        formData.append('related_movies', JSON.stringify(selectedRelatedMovies));
    
        additionalImageFiles.forEach(file => {
            formData.append('additional_images', file);
        });
    
        try {
            let response;
            if (editIndex !== null) {
                formData.append('id', editIndex);
                response = await callApi.post('/movies/update', formData, { withCredentials: true });
                console.log('Movie updated successfully:', response.data);
            } else {
                response = await callApi.post('/movies', formData, { withCredentials: true });
                console.log('Movie created successfully:', response.data);
            }
    
            fetchMovies(); 
            resetFormState(); 
    
        } catch (error) {
            if (error.response) {
                console.error('Error response data:', error.response.data);
                console.error('Error response status:', error.response.status);
                console.error('Error response headers:', error.response.headers);
            } else if (error.request) {
                console.error('Error request data:', error.request);
            } else {
                console.error('Error message:', error.message);
            }
            console.error('Error config:', error.config);
        }
    };   

    const resetFormState = () => {
        setShowModal(false);
        setInputs({});
        setImgData(null);
        setAdditionalImages([]);
        setAdditionalImageFiles([]);
        setStartDate(new Date());
        setEditIndex(null);
        setSelectedCategory("");
        setSelectedGenres([]);
        setSelectedRelatedMovies([]);
    };


    //Delete Function

    const handleDelete = async (id) => {
        try {
            await callApi.post('/movies/destroy', { id });
            const updatedMovies = movieData.filter(movie => movie.id !== id);
            setMovieData(updatedMovies);
          } catch (error) {
            console.error('Error deleting movie:', error);
          }
    };

    const handleEdit = async (id) => {
        try {
        
            const response = await callApi.get(`/movies/${id}`);
            const movie = response.data.movie;
    
            if (!movie) return;
    
            const parseJSON = (jsonString) => {
                try {
                    return JSON.parse(jsonString.replace(/\\/g, ''));
                } catch (error) {
                    console.error('Error parsing JSON:', error);
                    return [];
                }
            };
    
            const relatedMovies = Array.isArray(movie.related_movies)
                ? movie.related_movies
                : parseJSON(movie.related_movies || '[]');
    
            const movieGenres = Array.isArray(movie.genres)
                ? movie.genres
                : parseJSON(movie.genres || '[]');
    
            setSelectedRelatedMovies(
                relatedMovies.map(relatedMovie => ({
                    label: relatedMovie.label,
                    value: relatedMovie.value
                }))
            );
    
            setSelectedGenres(
                movieGenres.map(genre => ({
                    label: genre.label,
                    value: genre.value
                }))
            );
    
            setInputs({
                name: movie.name,
                description: movie.description,
                star_casts: movie.star_casts,
                durations: movie.durations,
                trailer_url: movie.trailer_url,
            });
    
            setImgData(movie.thumbnail_img ? `${process.env.REACT_APP_BACKEND_URL}${movie.thumbnail_img}` : null);
    
            const additionalImages = Array.isArray(movie.additional_images)
                ? movie.additional_images
                : parseJSON(movie.additional_images || '[]');
    
            setAdditionalImages(
                additionalImages.map(img => `${process.env.REACT_APP_BACKEND_URL}${img}`)
            );
    
            setAdditionalImageFiles([]); 
            setStartDate(new Date(movie.release_date));
            setEditIndex(id);
            setSelectedCategory(movie.category_id || "");
            setShowModal(true);
    
            const relatedMoviesData = await Promise.all(
                relatedMovies.map(async relatedMovie => {
                    try {
                        const relatedResponse = await callApi.get(`/movies/${relatedMovie.value}`);
                        const relatedMovieData = relatedResponse.data.movie;
                        return {
                            label: relatedMovie.label,
                            value: relatedMovie.value,
                            poster: relatedMovieData?.thumbnail_img,
                            movie_name: relatedMovieData?.name
                        };
                    } catch (e) {
                        console.error(`Error fetching related movie data for ${relatedMovie.value}:`, e);
                        return {
                            label: relatedMovie.label,
                            value: relatedMovie.value,
                            poster: null,
                            movie_name: null
                        };
                    }
                })
            );
    
            setSelectedRelatedMovies(relatedMoviesData);
    
        } catch (error) {
            console.error("Error fetching movie data or related movies:", error);
        }
    };
    

    let base64String = "";
    const imageUploaded = (event) => {
        const file = event.target.files[0];
        let reader = new FileReader();
    
        reader.onload = function () {
            setImgData(reader.result);
            setInputs((prev) => ({
                ...prev,
                "poster": file
            }));
        };
    
        reader.readAsDataURL(file);
    };

    const additionalImagesUploaded = (event) => {
        const files = Array.from(event.target.files);
        const promises = files.map(file => {
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
            setAdditionalImageFiles(files); 
        });
    };


    const handleDeleteImage = (index) => {
        const newAdditionalImages = additionalImages.filter((_, imgIndex) => imgIndex !== index);
        setAdditionalImages(newAdditionalImages);

        const newAdditionalImageFiles = additionalImageFiles.filter((_, imgIndex) => imgIndex !== index);
        setAdditionalImageFiles(newAdditionalImageFiles);
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
                                        <div className="mb-3">
                                            <label htmlFor="additionalImages" className="form-label">Additional Images</label>
                                            <input className="form-control" type="file" id="additionalImages" name='additionalImages' onChange={additionalImagesUploaded} multiple />
                                            <div className=''>
                                                {additionalImages.length > 0 ? (
                                                    <div>
                                                        {additionalImages.map((img, index) => (
                                                            <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                                                <img src={img} alt={`Additional ${index}`} style={{ width: '100px', height: '100px', objectFit: 'cover', marginRight: '10px' }} />
                                                                <button onClick={() => handleDeleteImage(index)} className="btn btn-danger">Delete</button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <p>No additional images available.</p>
                                                )}
                                            </div>
                                        </div>
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
                                            <label htmlFor="durations" className="form-label">Durations</label>
                                            <input type="text" className="form-control" id="durations" name="durations" value={inputs.durations || ""} onChange={handleChange} required />
                                        </div>
                                        
                                        <div className="mb-3">
                                            <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} required />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="categories" className="form-label">Languages</label>
                                            <select className="form-control" id="category_id" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} required>
                                                <option value="">Select a category</option>
                                                {categories.map((category, index) => (
                                                    <option key={category.id} value={category.id}>{category.name}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className='mb-3'>
                                            <label htmlFor="genres" className="form-label">Genres</label>
                                            <MultiSelect
                                                id="genres"
                                                options={genreOptions}
                                                value={selectedGenres}
                                                onChange={setSelectedGenres}
                                                labelledBy="Select Genres"
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label htmlFor="relatedMovies" className="form-label">Related Movies</label>
                                            <MultiSelect
                                                id="relatedMovies"
                                                options={movieOptions}
                                                value={selectedRelatedMovies}
                                                onChange={setSelectedRelatedMovies}
                                                labelledBy="Select Related Movies"
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label htmlFor="trailer" className="form-label">Trailer Link</label>
                                            <input type="text" className="form-control" id="trailer_url" name="trailer_url" value={inputs.trailer_url || ""} onChange={handleChange} required />
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
                            <th scope="col">Durations</th>
                            <th scope="col">Language</th>
                            <th scope="col">Genre</th>
                            <th scope="col">Related Movies</th>
                            <th scope="col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {movieData.length > 0 && movieData.map((movie, index) => {
                            
                            return (
                                <tr key={movie.id}>
                                    <th scope="row">{index + 1}</th>
                                    <td>
                                        <div className="h-100px w-100px">
                                            <img 
                                                src={`${backendUrl}/${movie.thumbnail_img}`}  
                                                className="img-fluid rounded-start" 
                                                alt={movie.name} 
                                            />
                                        </div>
                                    </td>
                                    <td>{movie.name}</td>
                                    <td>{movie.description}</td>
                                    <td>{new Date(movie.release_date).toLocaleDateString()}</td>
                                    <td>{movie.star_casts}</td>
                                    <td>{movie.durations}</td>
                                    {/* <td>{movie.category}</td> */}
                                    <td>{JSON.parse(movie.genres).map((genre) => (
                                        <div key={genre.value}><span>{genre.label}</span><br /></div>
                                    ))}</td>
                                    <td>{JSON.parse(movie.related_movies).map((movie, index) => (
                                        <div key={movie.value}><span>{movie.label}</span><br /></div>
                                    ))}</td>
                                    <td>
                                        <button className="btn btn-danger" onClick={() => handleDelete(movie.id)}>Delete</button>
                                        <button className="btn btn-success" onClick={() => handleEdit(movie.id)}>Edit</button>
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
