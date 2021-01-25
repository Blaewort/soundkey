import React, { useEffect } from 'react';
import Sidebar from '../../components/sidebar/index';
import Content from '../../components/content/index';
import GuitarFretboard from './guitarFretboard/index';
import {useParams} from 'react-router-dom';
import { fetchChord } from '../../services/api/index';
//import { Chord } from 'chord-expressions';
import PianoFretboard from './pianoFretboard/index';



function Visualizer(props) {
    return null;
    return null;
    /*
    let notation = useParams().notation;
    let instrument = useParams().instrument
    //let chord = Chord.chordFromNotation(notation);
    let notes = [];
    chord.notes.forEach(note =>{
        notes.push(note.name);
    });

    let instrumentVisualizer;
    if(instrument === "guitar"){
        instrumentVisualizer = <GuitarFretboard tuningNotes={["E","B","G","D","A","E"]} selectedNotes={ notes }/>;
    } else if(instrument === "piano"){
        instrumentVisualizer = <PianoFretboard tuningNotes={["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"]} selectedNotes={ notes }></PianoFretboard>
    }
    console.log(notes);


    return (
        <div>
            <Sidebar/>
            <Content>
                {instrumentVisualizer}
            </Content>
        </div>
    );*/
  }
  
  export default Visualizer;