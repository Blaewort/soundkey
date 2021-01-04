import React from 'react';
import {
    Link
  } from "react-router-dom";
import './styles.css';

function Sidebar() {
    return (
        <div className="sidebar">
            <Link to="/">Home</Link>
            <Link to="/visualizer">Visualizer</Link>
            <Link to="/dictionary">Dictionary</Link>
        </div>
    );
  }
  
  export default Sidebar;
  