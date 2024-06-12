/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';


const GenreForm = () => {
  const [genres, setGenres] = useState([]);
  const [newGenre, setNewGenre] = useState("");

  useEffect(() => {
    const storedGenres = JSON.parse(window.localStorage.getItem('genres'));
    if (storedGenres) {
      setGenres(storedGenres);
    }
  }, []);

  const handleAddGenre = () => {
    if (newGenre !== "") {
      const updatedGenres = [...genres, newGenre];
      setGenres(updatedGenres);
      window.localStorage.setItem('genres', JSON.stringify(updatedGenres));
      setNewGenre("");
    }
  };

  const handleDeleteGenre = (index) => {
    const updatedGenres = genres.filter((_, i) => i !== index);
    setGenres(updatedGenres);
    window.localStorage.setItem('genres', JSON.stringify(updatedGenres));
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
            <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
              {genre}
              <button className="btn btn-danger btn-sm" onClick={() => handleDeleteGenre(index)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default GenreForm;
