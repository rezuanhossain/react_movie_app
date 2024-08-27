/* eslint-disable no-irregular-whitespace */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import callApi from '../api/api'
const CategoryForm = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");

  // useEffect(() => {
  //   const storedCategories = JSON.parse(window.localStorage.getItem('categories'));
  //   if (storedCategories) {
  //     setCategories(storedCategories);
  //   }
  // }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await callApi.get('/categories/get-all-categories');
        console.log(response)
        setCategories(response.data.categories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
  
    fetchCategories();
  }, []);

  // const handleAddCategory = () => {
  //   if (newCategory !== "") {
  //     const updatedCategories = [...categories, newCategory];
  //     setCategories(updatedCategories);
  //     window.localStorage.setItem('categories', JSON.stringify(updatedCategories));
  //     setNewCategory("");
  //   }
  // };

  const handleAddCategory = async () => {
    if (newCategory !== "") {
      try {
        const response = await callApi.post('/categories', { name: newCategory });
        const updatedCategories = [...categories, response.data.category];
        setCategories(updatedCategories);
        setNewCategory("");
      } catch (error) {
        console.error('Error adding category:', error);
      }
    }
  };


  // const handleDeleteCategory = (index) => {
  //   const updatedCategories = categories.filter((_, i) => i !== index);
  //   setCategories(updatedCategories);
  //   window.localStorage.setItem('categories', JSON.stringify(updatedCategories));
  // };

  const handleDeleteCategory = async (id) => {
    try {
      await callApi.post('/categories/destroy', { id : id });
      const updatedCategories = categories.filter(category => category.id !== id);
      setCategories(updatedCategories);
    } catch (error) {
      console.error('Error deleting category:', error);
    }
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
          {categories && categories?.map((category, id) => (
            <li key={id} className="list-group-item d-flex justify-content-between align-items-center">
              {category.name}
              <button className="btn btn-danger btn-sm" onClick={() => handleDeleteCategory(category.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CategoryForm;
