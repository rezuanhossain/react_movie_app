/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import CategoryForm from '../components/Category';

const CategoryPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("");

  return (
    <div>
      <div className='m-5'>
        <Link to={'/admin'}><button>Back to Add Movie</button></Link>
      </div>
      <CategoryForm selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
    </div>
  );
}

export default CategoryPage;
