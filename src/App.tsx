import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <BrowserRouter>

        <Routes>
          <Route path="/" element={<div>kkk</div>} />
          <Route path="/about" element={<div>kkk</div>} />
          <Route path="/portfolio" element={<div>kkk</div>} />
          <Route path="/contact" element={<div>kkk</div>} />
          <Route path="/contact/:id" element={<div>kkk2</div>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
