import React, { useEffect } from 'react';
import {useParams} from 'react-router-dom';
import GuitarFretboard from './guitarFretboard/index';
import PianoFretboard from './pianoFretboard/index';



function VisualInstrument({selectedNotes, instrument}) {
    let visualInstrument;

    if(instrument.name === "Guitar"){
        visualInstrument =  <GuitarFretboard tuningNotes={instrument.tuning} selectedNotes={ selectedNotes}/>;
    } else if(instrument.name === "Piano"){
        visualInstrument = <PianoFretboard octaves={instrument.pianoOctaves} selectedNotes={ selectedNotes }/>;
    }
    
    return (
        <>
            {visualInstrument}
        </>
    );
  }
  
  export default VisualInstrument;