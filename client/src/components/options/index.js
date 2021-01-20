import React from 'react';
import './styles.css'

import OptHeader from './header/index';
import OptContent from './content/index';
import OptFooter from './footer/index';

class Options extends Component (props) {

    constructor(props) {
        super(props);

        this.state = {
            active: false,
            mainSelection: null, //chords, scales, settings
            radioType: null, //nav chord or scale, edit selected chord or scale, settings
            radioSelection: null, //the absolute selection of radio
            listType: null, //chords, scales, tunings, instruments, modes (special list which items link to relevant scale list area)
            noteNavSelection: null, //the note that is selected by the note nav component
            toggleAvailable: false, //whether the toggle is there
            selectedChordName: null, //ditto
            selectedChordNotes: null, //array
            selectedScaleName: null, //ditto
            selectedScaleNotes: null, //array
        };
    }

// How do I set a default state?    props


    render() {
        return (
            <div className="options">
                    <OptHeader active={this.state.active}></OptHeader>
                    <OptContent active={this.state.active}></OptContent>
                    <OptFooter active={this.state.active} selection={this.state.mainSelection}></OptFooter>
            </div>
        );
  }
}
  
export default Options;

