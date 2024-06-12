/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import CategoryForm from '../components/Category';


const CategoryPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("");

  return (
    <div>
      
      <CategoryForm selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
    </div>
  );
}

export default CategoryPage;
