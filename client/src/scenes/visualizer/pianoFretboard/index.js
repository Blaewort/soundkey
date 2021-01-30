import React, { Component } from 'react';
import './styles.css';

function PianoFretboard(props){
        let tuningNotes = props.tuningNotes ? props.tuningNotes : ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];
        let selectedNotes = props.selectedNotes ? props.selectedNotes : ["C","C#"];
        const noteCount = tuningNotes.length;
        const octaveCount = Math.floor(noteCount / 12);
        let octaveClass ="";
        switch(octaveCount) {
            case 1:
                octaveClass = "oneOctave";
                break
            case 2:
                octaveClass = "twoOctave";
                break;
            case 3:
                octaveClass = "threeOctave";
                break;
        }
        let keys = tuningNotes.map(function(note,index,arr){
            const noteColor = note.length === 1 ? "white" : "black";
            const noteHTML = <div className={selectedNotes.findIndex(element => element === note) > -1 ? "note visible" : "note" }>{note}</div>;
            let classStr = "";
             if(index !== 0 && noteColor === "white" && (arr[index-1].length === 1 ? "white" : "black") === "black"){
                classStr = "key white left " + octaveClass;
            } else {
                classStr = "key " + noteColor + " " + octaveClass;
            }
            return <li key={index} className={classStr}>{noteHTML}</li> 
        });
        return (<ul className="keyboard">
            {keys}    
        </ul> );
}


export default PianoFretboard