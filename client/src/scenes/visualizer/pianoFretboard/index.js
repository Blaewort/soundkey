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
        //TODO: if it's not set, maybe automatically set it to 2?
        if (!Number.isInteger(props.octaves)) {throw new Error("props.octaves must be an integer");}
        if (props.octaves < 2) {throw new Error("min props.octave count is 2");}
        /* I think in order to make 1 octave look good on big screens the width of the keyboard needs to be markedly reduced, which would necessitate adding its own breakpoints
        for low-height screens and given it's so short as to be impractical at times especially compared to 2 and 3 octaves 
        (think a B major chord in 1 octave not rendering in root position on the piano because we always start on C in current implementation),
         I'm comfortable not supporting for now */
        if (props.octaves > 3) {throw new Error("max props.octaves count is 3");}

        //TODO: prob should check if props.selectedNotes is an array
        let selectedNotes = props.selectedNotes ? props.selectedNotes : ["C","C#"];
        let octaveClass ="";
        switch(props.octaves) {
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
        let keys;

        if (props.octaves === 2) {
            keys = allNotesFromC.map(function(note,index,arr){
                const noteColor = note.length === 1 ? "white" : "black";
                const noteHTML = <div className={selectedNotes.findIndex(element => element === note) > -1 ? "note visible" : "note" }>{note}</div>;
                let classStr = "";
                 if(index !== 0 && noteColor === "white" && (arr[index-1].length === 1 ? "white" : "black") === "black"){
                    classStr = "key white left ";
                } else {
                    classStr = "key " + noteColor;
                }
                return  <li key={index} className={classStr}>{noteHTML}</li>;
            });
        } else if (props.octaves === 3 || props.octaves === 1) {
            /* TODO? different dom/css structure in this case. dont want to break 2 octaves but maybe it can be brought to this solution later. 
               This way black notes are in the white key elements. This implementation breaks being able to add starting or ending on black notes, something in that realm 
               without making some potential workaround */

            //when we hit a black note, store that whole dom element in a variable. 
            // Then, upon the next white note, place the black note inside the noteHTML div as first child
            // Then, set that black note variable to null
            
            let blackNote;
            keys= []; /* array of white keys containing the black keys */
            for (let index = 0; index < allNotesFromC.length; index++) {
                const note = allNotesFromC[index];
                const noteColor = note.length === 1 ? "white" : "black";
                const noteHTML = <div className={selectedNotes.findIndex(element => element === note) > -1 ? "note visible" : "note" }>{note}</div>;
                let classStr = "";
                 if(index !== 0 && noteColor === "white" && (allNotesFromC[index-1].length === 1 ? "white" : "black") === "black"){
                    classStr = "key white left ";
                } else {
                    classStr = "key " + noteColor;
                }


                if (noteColor === "black") {
                    blackNote = <li key={index} className={classStr}>{noteHTML}</li>;
                } else {
                    /* our note is white */
                    if (blackNote) {
                        /* we have a blacknote */
                        keys.push(<li key={index} className={classStr}>{blackNote}{noteHTML}</li>);
                        // add our white note with black note inside
                        blackNote = null;
                        // unset 
                    } else {
                        //we dont have a black note
                        keys.push(<li key={index} className={classStr}>{noteHTML}</li>);
                    }
                    
                }
     
            }
        }
        

        //now iterate through each key. when you hit a black note, store it in a variable. Then upon the next white note, 



        return (<div class="piano-container"><ul className={"keyboard ".concat(octaveClass)}>
            {keys}    
        </ul></div> );
}


export default PianoFretboard