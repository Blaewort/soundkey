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

class GuitarFretboard extends Component {
  
  render() {
    const {tuningNotes, selectedNotes } = this.props;
    let strings = [];
    for(var i = 0; i < tuningNotes.length; i++) {
        strings.push(<String key={i} stringNote={tuningNotes[i]} selectedNotes={selectedNotes}/>);
    }
    return strings;
}

}

class String extends Component {
  render(){
    const {stringNote, selectedNotes } = this.props;
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
}

class Fret extends Component {
	render() {
    const { note, notePosition, selected } = this.props;
  	return (
    		 <li className="fret-wrapper">
           <div className="fret">
           {notePosition > 0 && <div className="string-line"></div> }
           {notePosition === 0 && <div className="nut"></div>}
             <div className="note">
             {selected ? <span className="marker">{note}</span>: <span className="marker hide">{note}</span>}
             </div>
           </div>
        </li>
    );
  }
}

export default GuitarFretboard