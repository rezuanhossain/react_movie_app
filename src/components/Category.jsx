/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
const CategoryForm = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");

  useEffect(() => {
    const storedCategories = JSON.parse(window.localStorage.getItem('categories'));
    if (storedCategories) {
      setCategories(storedCategories);
    }
  }, []);

  const handleAddCategory = () => {
    if (newCategory !== "") {
      const updatedCategories = [...categories, newCategory];
      setCategories(updatedCategories);
      window.localStorage.setItem('categories', JSON.stringify(updatedCategories));
      setNewCategory("");
    }
  };

  const handleDeleteCategory = (index) => {
    const updatedCategories = categories.filter((_, i) => i !== index);
    setCategories(updatedCategories);
    window.localStorage.setItem('categories', JSON.stringify(updatedCategories));
  };

  return (
    <div>
      <div className='m-5'>
        <Link to={'/admin'}><button>Back to Add Movie</button></Link>
      </div>
      <div className="mb-3">
        <input 
          type="text" 
          className="form-control" 
          placeholder="Add new category" 
          onChange={(e) => setNewCategory(e.target.value)}
          value={newCategory} 
          required
        />
        <button className="btn btn-primary mt-2" onClick={handleAddCategory}>Add Category</button>
      </div>
      <div>
        <ul className="list-group">
          {categories.map((category, index) => (
            <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
              {category}
              <button className="btn btn-danger btn-sm" onClick={() => handleDeleteCategory(index)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CategoryForm;
