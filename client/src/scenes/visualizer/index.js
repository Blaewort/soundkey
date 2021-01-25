import React, { useEffect } from 'react';
import Sidebar from '../../components/sidebar/index';
import Content from '../../components/content/index';
import GuitarFretboard from './guitarFretboard/index';
import {useParams} from 'react-router-dom';
import { fetchChord } from '../../services/api/index';
import { Chord } from 'chord-expressions';
import PianoFretboard from './pianoFretboard/index';



function Visualizer(props) {
    let notation = useParams().notation;
    let instrument = useParams().instrument
    let chord = Chord.chordFromNotation(notation);
    let notes = [];
    chord.notes.forEach(note =>{
        notes.push(note.name);
    });
    /*
    useEffect(() => {
        fetchChord(notation.notation);
    });
    */
    let instrumentVisualizer;
    if(instrument === "guitar"){
        instrumentVisualizer = <GuitarFretboard tuningNotes={["E","B","G","D","A","E"]} selectedNotes={ notes }/>;
    } else if(instrument === "piano"){
        instrumentVisualizer = <PianoFretboard tuningNotes={["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"]} selectedNotes={ notes }></PianoFretboard>
    }
    console.log(notes);
    /* Not needed, keeping as example code
    let modeMenu;
    if(mode === "chord"){
        modeMenu = <Chord></Chord>
    } else if (mode === "scale") {
        modeMenu = <Scale></Scale>
    } */


    return (
        <div>
            <Sidebar/>
            <Content>
                {instrumentVisualizer}
            </Content>
        </div>
    );
  }
  
  export default Visualizer;