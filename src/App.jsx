/* eslint-disable react/jsx-no-undef */
import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from './pages/Home.jsx';
import AddMovie from './pages/AddMovie.jsx';
import MovieDetail from './pages/MovieDetail.jsx';
import CategoryPage from './components/Category.jsx';
import GenrePage from './pages/GenrePage.jsx';
import Navbar from './pages/Navbar.jsx';

function App() {
  return (
    <>
      <BrowserRouter>
      <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movies/:movieId" element={<MovieDetail />} />
          <Route path="/admin" element={<AddMovie />} />
          <Route path="/category" element={<CategoryPage />} /> 
          <Route path="/genre" element={<GenrePage />} /> 
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
