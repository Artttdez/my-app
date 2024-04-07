import React, { createContext } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from 'react-query';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';
import { RouteGo } from './screens/RouteGo/RouteGo';
import { RouteCreate } from './screens/RouteCreate/RouteCreate';
import { Callback } from './screens/Callback/Callback';

import './App.css';

const UserContext = createContext<{user: any}>({
  user: null,
});

const queryClient = new QueryClient();

function App() {
  return (
    <UserContext.Provider value={{ user: null }}>
    <QueryClientProvider client={queryClient}>
    <div className="App">
      <style>
@import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap')
</style>
      <BrowserRouter>
        <Header/>
        <Routes>
          <Route path="/" element={<div>kkk</div>} />
          <Route path="/about" element={<div>kkk</div>} />
          <Route path="/portfolio" element={<div>kkk</div>} />
          <Route path="/contact" element={<div>kkk</div>} />
          <Route path="/route/create" element={<RouteCreate/>} />
          <Route path="/route/:id" element={<div>kkk2</div>} />
          <Route path="/route/:id/go" element={<RouteGo/>} />
          <Route path="/callback" element={<Callback/>} />
        </Routes>
      </BrowserRouter>
      <Footer/>
    </div>
    </QueryClientProvider>
    </UserContext.Provider>
  );
}

export default App;
