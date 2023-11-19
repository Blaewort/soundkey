import React, { Component } from 'react';
import './styles.css';
const NOTES_ARRAY = [
    "A",
    "A#",
    "B",
    "C",
    "C#",
    "D",
    "D#",
    "E",
    "F",
    "F#",
    "G",
    "G#"
];

const FLATS_ARRAY = [
  "A",
  "Bb",
  "B",
  "C",
  "Db",
  "D",
  "Eb",
  "E",
  "F",
  "Gb",
  "G",
  "Ab"
];

function getNoteStringValue(noteString) {
    //check if it's in NOTES_ARRAY. If so, return that number
    const sharpsIndex = NOTES_ARRAY.indexOf(noteString); 
    if (sharpsIndex >= 0) {return sharpsIndex;}

    const flatsIndex = FLATS_ARRAY.indexOf(noteString); 
    if (flatsIndex >= 0) {return flatsIndex;}
    
    return -1;
}

//There's no checking that anything we receive is valid, no error handling

function GuitarFretboard(props) {
    const {tuningNotes, selectedNotes } = props;
    let strings = [];
    //need to go backwards otherwise EADGBE goes top to bottom EBGDAE in the DOM

    const tuningNoteStringArray = tuningNotes.match(/[A-G][b|#]?/g); /* supports singular # and b but converts to # */ 
    for(var i = tuningNoteStringArray.length - 1; i > -1; i--) {
        strings.push(<String key={i} stringNote={tuningNoteStringArray[i]} selectedNotes={selectedNotes}/>);
    }
    return <div class="guitarFretboard">{strings}</div>;
}

function String(props) {
    const {stringNote, selectedNotes } = props;
    var notes = [];
    const index = getNoteStringValue(stringNote);
    for(let i = 0; i < 13; i++) {
      notes.push(NOTES_ARRAY[(index + i) % 12 ]);
    }
    let frets = [];
    
      for(let i = 0; i < notes.length; i++) {
      let selected = selectedNotes.includes(notes[i]);
    	 frets.push(
         <Fret note={notes[i]} key={i} notePosition={i} selected={selected}/>
       );
      }
    return <ul className="string"> {frets} </ul>;
}

function Fret(props) {
    const { note, notePosition, selected } = props;
  	return (
    		 <li className="fret-wrapper">
           <div className="fret">
             <div className="guitarNote">
             {selected ? <span className="marker">{note}</span>: <span className="marker hide">{note}</span>}
             </div>
           </div>
        </li>
    );
}/* {notePosition > 0 && <div className="string-line"></div> } */
/* {notePosition === 0 && <div className="nut"></div>} */

export default GuitarFretboard