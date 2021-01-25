import React, { Component } from 'react';
import './styles.css';

class PianoFretboard extends Component {
    constructor(props) {
        super(props);
        this.tuningNotes = this.props.tuningNotes ? this.props.tuningNotes : ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];
        this.selectedNotes = this.props.selectedNotes ? this.props.selectedNotes : ["C","C#"];
        const noteCount = this.tuningNotes.length;
        const octaveCount = Math.floor(noteCount / 12);
        switch(octaveCount) {
            case 1:
                this.octaveClass = "oneOctave";
                break
            case 2:
                this.octaveClass = "twoOctave";
                break;
            case 3:
                this.octaveClass = "threeOctave";
                break;
        }
        this.keys = (this.tuningNotes).map(function(note,index,arr){
            const noteColor = note.length === 1 ? "white" : "black";
            const noteHTML = <div className={this.selectedNotes.findIndex(element => element === note) > -1 ? "note visible" : "note" }>{note}</div>;
            let classStr = "";
             if(index !== 0 && noteColor === "white" && (arr[index-1].length === 1 ? "white" : "black") === "black"){
                classStr = "key white left " + this.octaveClass;
            } else {
                classStr = "key " + noteColor + " " + this.octaveClass;
            }
            return <li key={index} className={classStr}>{noteHTML}</li> 
        }.bind(this));
    }
    render() {
        return <ul className="keyboard">
            {this.keys}    
        </ul> 
    }
}


export default PianoFretboard

/*
            <li className="key white"></li>
            <li className="key black"></li>
            <li className="key white left"></li>
            <li className="key black"></li>
            <li className="key white left"></li>
            <li className="key white"></li>
            <li className="key black"></li>
            <li className="key white left"></li>
            <li className="key black"></li>
            <li className="key white left"></li>
            <li className="key black"></li>
            <li className="key white left"></li>    
            */