import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import CoffeeList from './components/CoffeeList';
import CoffeeForm from './components/CoffeeForm';
import CoffeeDetail from './components/CoffeeDetail';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  return (
    <div className="App min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/coffee" element={<CoffeeList />} />
          <Route path="/coffee/new" element={<CoffeeForm />} />
          <Route path="/coffee/:id" element={<CoffeeDetail />} />
          <Route path="/coffee/:id/edit" element={<CoffeeForm />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
