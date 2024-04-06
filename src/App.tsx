import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';
import { RouteGo } from './screens/RouteGo/RouteGo';

import './App.css';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Header/>
        <Routes>
          <Route path="/" element={<div>kkk</div>} />
          <Route path="/about" element={<div>kkk</div>} />
          <Route path="/portfolio" element={<div>kkk</div>} />
          <Route path="/contact" element={<div>kkk</div>} />
          <Route path="/route/:id" element={<div>kkk2</div>} />
          <Route path="/route/:id/go" element={<RouteGo/>} />
        </Routes>
      </BrowserRouter>
      <Footer/>
    </div>
  );
}

export default App;
