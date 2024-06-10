/* eslint-disable no-unused-vars */
import React from 'react'
import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import '../App.css'
import { Link } from "react-router-dom";

const AddMovie = () => {
    const [inputs, setInputs] = useState({});
    const [imgData, setImgData] = useState();
    const [showModal, setShowModal] = useState(false);
    const [movieData, setMovieData] = useState([]);
    const [startDate, setStartDate] = useState(new Date());
    const [editIndex, setEditIndex] = useState(null);
  
    useEffect(() => {
      const storedMovieData = JSON.parse(window.localStorage.getItem('movieData'));
      if (storedMovieData) {
        setMovieData(storedMovieData);
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
      
      const movieDetails = { ...inputs, release_date: startDate };
      
      if (editIndex !== null) {
        oldData[editIndex] = movieDetails;
      } else {
        oldData = [...oldData, movieDetails];
      }
  
      window.localStorage.setItem('movieData', JSON.stringify(oldData));
      setMovieData(oldData);
      setInputs({});
      setImgData(null);
      setStartDate(new Date());
      setShowModal(false);
      setEditIndex(null);
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
      setStartDate(new Date(movie.release_date));
      setEditIndex(index);
      setShowModal(true);
    };
  
    let base64String = "";
    const imageUploaded = () => {
      let file = document.querySelector('input[type=file]')['files'][0];
  
      let reader = new FileReader();
      reader.onload = function () {
        base64String = reader.result;
        setInputs((prev) => ({
          ...prev,
          "poster": base64String
        }));
        setImgData(base64String);
      };
      reader.readAsDataURL(file);
    };
  
  return (
    <div>
      <div className='m-5'>
        <Link to={'/'}><button>HomePage</button></Link>          
      </div>
      <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal" data-bs-whatever="@mdo" onClick={() => setShowModal(true)}>Add Movie</button>
      {showModal && (
        <div className="modal fade show" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-modal="true" role="dialog" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => { setShowModal(false); setEditIndex(null); }}></button>
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
                    <label htmlFor="genre" className="form-label">Genre</label>
                    <input type="text" className="form-control" id="genre" name="genre" value={inputs.genre || ""} onChange={handleChange} required />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="duration" className="form-label">Duration</label>
                    <input type="text" className="form-control" id="duration" name="duration" value={inputs.duration || ""} onChange={handleChange} required />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="language" className="form-label">Language</label>
                    <input type="text" className="form-control" id="language" name="language" value={inputs.language || ""} onChange={handleChange} required />
                  </div>
                  <div className="mb-3">
                    <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} required />
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
            <th scope="col">Genre</th>
            <th scope="col">Duration</th>
            <th scope="col">Language</th>
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
                <td>{movie.genre}</td>
                <td>{movie.duration}</td>
                <td>{movie.language}</td>
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
  )
}

export default AddMovie
