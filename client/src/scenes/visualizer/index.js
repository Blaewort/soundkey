import React, { useEffect } from 'react';
import Sidebar from '../../components/sidebar/index';
import Content from '../../components/content/index';
import GuitarFretboard from './guitarFretboard/index';
import Toggle from './toggle/index';
import Chord from './chord/index';
import Scale from './scale/index';
import {useParams} from 'react-router-dom';
import { fetchChord } from '../../services/api/index';

function Visualizer(props) {
    let notation = useParams().notation;
    let mode = useParams().mode;
    console.log(notation);
    console.log(mode);
    useEffect(() => {
        fetchChord(notation.notation);
    });
    let modeMenu;
    if(mode === "chord"){
        modeMenu = <Chord></Chord>
    } else if (mode === "scale") {
        modeMenu = <Scale></Scale>
    }


    return (
        <div>
            <Sidebar/>
            <Content>
                <GuitarFretboard tuningNotes={["E","B","G","D","A","E"]} selectedNotes={["A","B","C","E","G"]  }/>
                <Toggle></Toggle>
                {modeMenu}
            </Content>
        </div>
    );
  }
  
  export default Visualizer;