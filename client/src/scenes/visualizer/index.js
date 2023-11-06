import React, { useEffect } from 'react';
import Sidebar from '../../components/sidebar/index';
import Content from '../../components/content/index';
import GuitarFretboard from './guitarFretboard/index';
import {useParams} from 'react-router-dom';
import { fetchChord } from '../../services/api/index';
import { Chord } from 'chord-expressions';
import PianoFretboard from './pianoFretboard/index';



function Visualizer(props) {
    let notes = [];
    const {selection, instrument} = props;
    console.log("Selection");
    console.log(selection);
    if (selection != null){
    selection.notes.forEach(note =>{
        //TODO this is a hack. The ChordScalePanel sometimes gives an array of note objects with the string name in a label field and sometimes i's in a name field. This should be made consistent.
        console.log(note);
        if(note.name !== undefined){
            notes.push(note.name);
        } else {
            notes.push(note.label)
        }
        });
    }
    let instrumentVisualizer;

    if(instrument.name === "Guitar"){
        instrumentVisualizer =  <GuitarFretboard tuningNotes={instrument.tuning} selectedNotes={ notes }/>;
    } else if(instrument.name === "Piano"){
        instrumentVisualizer = <PianoFretboard tuningNotes={instrument.tuning} selectedNotes={ notes }/>;
    }
    
    return (
        <Content>
                {instrumentVisualizer}
        </Content>
    );
  }
  
  export default Visualizer;