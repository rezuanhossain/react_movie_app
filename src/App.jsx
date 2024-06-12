/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from './pages/Home.jsx';
import AddMovie from './pages/AddMovie.jsx';
import MovieDetail from './pages/MovieDetail.jsx';
import CategoryPage from './components/Category.jsx';
import GenrePage from './pages/GenrePage.jsx';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<AddMovie />} />
          <Route path="/movies/:movieId" element={<MovieDetail />} />
          <Route path="/category" element={<CategoryPage />} /> 
          <Route path="/genre" element={<GenrePage />} /> 
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
