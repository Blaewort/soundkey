import React, { useEffect } from 'react';
import Sidebar from '../../components/sidebar/index';
import Content from '../../components/content/index';
import GuitarFretboard from './guitarFretboard/index';
import {useParams} from 'react-router-dom';
import { fetchChord } from '../../services/api/index';
import { Chord } from 'chord-expressions';
import PianoFretboard from './pianoFretboard/index';



function VisualInstrument({selectedNotes, instrument}) {
    let visualInstrument;

    if(instrument.name === "Guitar"){
        visualInstrument =  <GuitarFretboard tuningNotes={instrument.tuning} selectedNotes={ selectedNotes}/>;
    } else if(instrument.name === "Piano"){
        visualInstrument = <PianoFretboard octaves={instrument.pianoOctaves} selectedNotes={ selectedNotes }/>;
    }
    
    return (
        <Content>
                {visualInstrument}
        </Content>
    );
  }
  
  export default VisualInstrument;