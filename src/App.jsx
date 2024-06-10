/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from './pages/Home.jsx';
import AddMovie from './pages/AddMovie.jsx';
import MovieDetail from './pages/MovieDetail.jsx';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<AddMovie />} />
          <Route path="/movies/:movieId" element={<MovieDetail />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
