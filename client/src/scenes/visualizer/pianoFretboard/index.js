import React, { Component } from 'react';
import './styles.css';  //there's a CSS clash between piano and fretboard, need to resolve that

const NOTES_ARRAY = [ //dont know why we need this, copied from guitarFretboard for posterity?
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

const NOTES_FROM_C = [ //need this because our piano starts on C
    "C",
    "C#",
    "D",
    "D#",
    "E",
    "F",
    "F#",
    "G",
    "G#",
    "A",
    "A#",
    "B"
];

function PianoFretboard(props){
        //TODO: if it's not set, maybe automatically set it to 1?
        if (!Number.isInteger(props.octaves)) {throw new Error("props.octaves must be an integer");}
        if (props.octaves < 1) {throw new Error("min props.octave count is 1");}
        if (props.octaves > 3) {throw new Error("max props.octaves count is 3");}

        //TODO: prob should check if props.selectedNotes is an array
        let selectedNotes = props.selectedNotes ? props.selectedNotes : ["C","C#"];
        let octaveClass ="";
        switch(props.octaves) {
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

        // take NOTES_FROM_C and multiply its contents by the number of octaves
        let allNotesFromC = NOTES_FROM_C;
        for (let i = 0; i < props.octaves-1; i++) {
            allNotesFromC = allNotesFromC.concat(NOTES_FROM_C);
        }

        console.log(allNotesFromC);

        //TODO: pickup here
        // only if pianooctave is 3 (and later, more)
        //when we hit a black note, store that whole dom element in a variable. 
        // Then, upon the next white note, place the black note inside the noteHTML div as first child
        // Then, set that black note variable to null
        let keys = allNotesFromC.map(function(note,index,arr){
            const noteColor = note.length === 1 ? "white" : "black";
            const noteHTML = <div className={selectedNotes.findIndex(element => element === note) > -1 ? "note visible" : "note" }>{note}</div>;
            let classStr = "";
             if(index !== 0 && noteColor === "white" && (arr[index-1].length === 1 ? "white" : "black") === "black"){
                classStr = "key white left ";
            } else {
                classStr = "key " + noteColor;
            }
            return <li key={index} className={classStr}>{noteHTML}</li> 
        });

        //now iterate through each key. when you hit a black note, store it in a variable. Then upon the next white note, 



        return (<div class="piano-container"><ul className={"keyboard ".concat(octaveClass)}>
            {keys}    
        </ul></div> );
}


export default PianoFretboard