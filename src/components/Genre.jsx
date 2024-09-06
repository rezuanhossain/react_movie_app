/* eslint-disable no-irregular-whitespace */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import callApi from '../api/api'

const GenreForm = () => {
  const [genres, setGenres] = useState([]);
  const [newGenre, setNewGenre] = useState("");

  // useEffect(() => {
  //   const storedGenres = JSON.parse(window.localStorage.getItem('genres'));
  //   if (storedGenres) {
  //     setGenres(storedGenres);
  //   }
  // }, []);
  useEffect(() => {
    const fetchGenre = async () => {
      try {
        const response = await callApi.get('/genres/get-all-genres');
        console.log(response)
        setGenres(response.data.genres);
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    };
  
    fetchGenre();
  }, []);

  // const handleAddGenre = () => {
  //   if (newGenre !== "") {
  //     const updatedGenres = [...genres, newGenre];
  //     setGenres(updatedGenres);
  //     window.localStorage.setItem('genres', JSON.stringify(updatedGenres));
  //     setNewGenre("");
  //   }
  // };
  const handleAddGenre = async () => {
    if (newGenre !== "") {
      try {
        const response = await callApi.post('/genres', { name: newGenre });
        const updatedGenres = [...genres, response.data.genre];
        setGenres(updatedGenres);
        setNewGenre("");
      } catch (error) {
        console.error('Error adding genre:', error);
      }
    }
  };

  // const handleDeleteGenre = (index) => {
  //   const updatedGenres = genres.filter((_, i) => i !== index);
  //   setGenres(updatedGenres);
  //   window.localStorage.setItem('genres', JSON.stringify(updatedGenres));
  // };
  const handleDeleteGenre = async (id) => {
    try {
      await callApi.post('/genres/destroy', { id : id });
      const updatedGenres = genres.filter(genre => genre.id !== id);
      setGenres(updatedGenres);
    } catch (error) {
      console.error('Error deleting genre:', error);
    }
  };

  return (
    <div>
      <div className="mb-3">
        <input 
          type="text" 
          className="form-control" 
          placeholder="Add new genre" 
          onChange={(e) => setNewGenre(e.target.value)}
          value={newGenre} 
          required
        />
        <button className="btn btn-primary mt-2" onClick={handleAddGenre}>Add Genre</button>
      </div>
      <div>
        <ul className="list-group">
          {genres.map((genre, index) => (
            <li key={genre.id} className="list-group-item d-flex justify-content-between align-items-center">
              {genre.name}
              <button className="btn btn-danger btn-sm" onClick={() => handleDeleteGenre(genre.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default GenreForm;
