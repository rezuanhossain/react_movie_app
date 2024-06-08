/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function App() {

  const [inputs, setInputs] = useState({});
  const [imgUrl, setImgUrl] = useState();
  const [imgData, setImgData] = useState();
  const [movieData, setMovieData] = useState([]);
  const [startDate, setStartDate] = useState(new Date());

  useEffect(() => {
    const storedMovieData = JSON.parse(window.localStorage.getItem('movieData'));
    if (storedMovieData) {
      setMovieData([storedMovieData]);
    }
  }, []);

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs(values => ({ ...values, [name]: value }))

  }

  const handleSubmit = (event) => {
    event.preventDefault();
    let oldData = JSON.parse(window.localStorage.getItem('movieData')) ?? [];

    const movieDetails = { ...inputs, release_date: startDate };
    
    window.localStorage.setItem('movieData', JSON.stringify([...oldData,movieDetails]));
    setMovieData([movieData]);
  }

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
    }
    reader.readAsDataURL(file);
  }
 

  return (
    <>
      <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal" data-bs-whatever="@mdo">Add Movie</button>
      <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-modal="true" role="dialog">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="formFile" className="form-label">Movie Poster</label>
                  <input className="form-control" type="file" id="formFile" name='poster' onChange={imageUploaded} />
                  <div className=''>
                    <img src={imgData} alt="" className='h-100px w-100px' />
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="movie_name" className="form-label">Movie Name</label>
                  <input type="text" className="form-control" id="movie_name" name="movie_name" value={inputs.movie_name || ""} onChange={handleChange} />
                </div>
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">Description</label>
                  <textarea className="form-control" id="description" rows="3" name="description" value={inputs.description || ""} onChange={handleChange}></textarea>
                </div>
                <div className="mb-3">
                  <label htmlFor="star_cast" className="form-label">Star Cast</label>
                  <input type="text" className="form-control" id="star_cast" name="star_cast" value={inputs.star_cast || ""} onChange={handleChange} />
                </div>
                <div className="mb-3">
                  <label htmlFor="genre" className="form-label">Genre</label>
                  <input type="text" className="form-control" id="genre" name="genre" value={inputs.genre || ""} onChange={handleChange} />
                </div>
                <div className="mb-3">
                  <label htmlFor="duration" className="form-label">Duration</label>
                  <input type="text" className="form-control" id="duration" name="duration" value={inputs.duration || ""} onChange={handleChange} />
                </div>
                <div className="mb-3">
                  <label htmlFor="language" className="form-label">Language</label>
                  <input type="text" className="form-control" id="language" name="language" value={inputs.language || ""} onChange={handleChange} />
                </div>
                <div className="mb-3">
                  <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
                </div>
                <button type='submit' className="btn btn-primary">Submit</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  ) 
}


export default App;
