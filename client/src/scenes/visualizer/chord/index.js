import React from 'react';
import './styles.css';
import Toggle from '../toggle/index.js';
function Chord(props) {


    return (
        <div className="mode-box">
            <div className='mode-box-left'>
                <div className="soft-box">Chord</div>
                <select>
                    <option value="0">🎵</option>
                    <option value="1">A</option>
                    <option value="2">A#</option>
                    <option value="3">B</option>
                    <option value="4">C</option>
                    <option value="5">C#</option>
                    <option value="6">D</option>
                    <option value="7">D#</option>
                    <option value="8">E</option>
                    <option value="9">F</option>
                    <option value="10">F#</option>
                    <option value="11">G</option>
                    <option value="12">G#</option>
                </select>
                <div className="arrow arrow-bar is-left"></div>
                <div className="arrow arrow-bar is-right"></div>
                <div className="soft-box">b3</div>
                <button className="soft-box">Match Chord</button>
                <Toggle></Toggle>
            </div>
        </div>
    );
  }
  
  export default Chord;
  