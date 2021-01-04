import React, { Component } from 'react';
import './styles.css';

function Toggle() {


    return (
        <label className="switch">
            <input type="checkbox"/>
            <span className="slider round"></span>
        </label>
    );
  }
  
  export default Toggle;
  