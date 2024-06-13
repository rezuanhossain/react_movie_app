/* eslint-disable no-unused-vars */

import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import '../App.css';
import { Link } from "react-router-dom";

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
    const [selectedGenre, setSelectedGenre] = useState("");
    const [genres, setGenres] = useState([]);

    useEffect(() => {
        const storedMovieData = JSON.parse(window.localStorage.getItem('movieData'));
        if (storedMovieData) {
            setMovieData(storedMovieData);
        }

        const storedCategories = JSON.parse(window.localStorage.getItem('categories'));
        if (storedCategories) {
            setCategories(storedCategories);
        }
        const storedGenres = JSON.parse(window.localStorage.getItem('genres'));
        if (storedGenres) {
            setGenres(storedGenres);
        }
    }, []);

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({ ...values, [name]: value }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        let oldData = JSON.parse(window.localStorage.getItem('movieData')) ?? [];

        const movieDetails = { ...inputs, release_date: startDate, category: selectedCategory, genre: selectedGenre, additional_images: additionalImages };

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
        setSelectedGenre("");
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
        setSelectedCategory(movie.category || "");
        setSelectedGenre(movie.genre || "");
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
            <div className='m-5'>
                <Link to={'/'}><button>HomePage</button></Link>
            </div>
            <div className='m-5'>
                <Link to={'/category'}><button>Category</button></Link>
            </div>
            <div className='m-5'>
                <Link to={'/genre'}><button>Genre</button></Link>
            </div>
            <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal" data-bs-whatever="@mdo" onClick={() => setShowModal(true)}>Add Movie</button>
            {showModal && (
                <div className="modal fade show" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-modal="true" role="dialog" style={{ display: 'block' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => { setShowModal(false); setEditIndex(null); setSelectedCategory(""); }}></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleSubmit} >
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
                                            {additionalImages.map((img, index) => (
                                                <img key={index} src={img} alt="" className='h-100px w-100px' />
                                            ))}
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
                                        <label htmlFor="duration" className="form-label">Duration</label>
                                        <input type="text" className="form-control" id="duration" name="duration" value={inputs.duration || ""} onChange={handleChange} required />
                                    </div>
                                    
                                    <div className="mb-3">
                                        <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} required />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="category" className="form-label">Category</label>
                                        <select className="form-control" id="category" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} required>
                                            <option value="">Select a category</option>
                                            {categories.map((category, index) => (
                                                <option key={index} value={category}>{category}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="genre" className="form-label">Genre</label>
                                        <select className="form-control" id="genre" value={selectedGenre} onChange={(e) => setSelectedGenre(e.target.value)} required>
                                            <option value="">Select a genre</option>
                                            {genres.map((genre, index) => (
                                                <option key={index} value={genre}>{genre}</option>
                                            ))}
                                        </select>
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
                                        <img src={movie.poster} className="img-fluid rounded-start" alt={movie.movie_name} />
                                    </div>
                                </td>
                                <td>{movie.movie_name}</td>
                                <td>{movie.description}</td>
                                <td>{new Date(movie.release_date).toLocaleDateString()}</td>
                                <td>{movie.star_cast}</td>
                                <td>{movie.duration}</td>
                                <td>{movie.category}</td>
                                <td>{movie.genre}</td>
                                <td>
                                    <button className="btn btn-danger" onClick={() => handleDelete(index)}>Delete</button>
                                    <button className="btn btn-primary" onClick={() => handleEdit(index)}>Edit</button>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    );
}

export default AddMovie;
