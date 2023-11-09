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

//There's no checking that anything we receive is valid, no error handling

function GuitarFretboard(props) {
    const {tuningNotes, selectedNotes } = props;
    let strings = [];
    //need to go backwards otherwise EADGBE goes top to bottom EBGDAE in the DOM
    for(var i = tuningNotes.length - 1; i > -1; i--) {
        strings.push(<String key={i} stringNote={tuningNotes[i]} selectedNotes={selectedNotes}/>);
    }
    const fullClassName = "guitarFretboard ".concat(props.extraClassString);
    return <div class={fullClassName}>{strings}</div>;
}

function String(props) {
    const {stringNote, selectedNotes } = props;
    var notes = [];
    const index = NOTES_ARRAY.indexOf(stringNote);
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