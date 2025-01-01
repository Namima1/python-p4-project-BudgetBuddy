import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import ExpenseList from "./components/ExpenseList";
import './index.css';

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route
          path="/"
          element={
            <div className="home-container">
              <h1 className="home-title">Welcome to Budget Buddy</h1>
              <div className="home-description">
                <p>
                  Budget Buddy is a dynamic and user-friendly personal finance tracker 
                  that allows users to seamlessly add expenses, monitor their spending habits, 
                  and customize interactive dashboards for better financial insights.
                </p>
              </div>
            </div>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/expenses" element={<ExpenseList />} />
      </Routes>
    </Router>
  );
}

export default App;