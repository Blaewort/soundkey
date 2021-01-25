import React, {Component} from 'react';
import './styles.css'

import Header from './header/index';
import Footer from './footer/index';
import SelectedObject from './selectedObject/index';

class Options extends Component{

    constructor(props) {
        super(props);

        this.state = {
            chord: {
                root: "E",
                name: "E Major",
                symbol: "E",
                notes: [{label: "E", value: 7},{label: "G#", value: 11}, {label: "B", value: 2}]
            },
            scale: {
                root: "E",
                name: "E Lydian",
                notes: [
                    {label: "E", value: 7},
                    {label: "F#", value: 9}, 
                    {label: "G#", value: 11}, 
                    {label: "A#", value: 1}, 
                    {label: "B", value: 2}, 
                    {label: "C#", value: 4}, 
                    {label: "D#", value: 6}
                ]
            },
            matchToggle: {
                // The toggle is visible when the focus is scale or chord and the other is not null
                scale: true,
                chord: true,
            },
            radio: {
                settings: "tuning" //this would just default on mounting
            },
            // "chord", "scale", "settings", null
            focus: "chord",
        }

        this.onFooterUpdate = this.onFooterUpdate.bind(this);
    }

    onFooterUpdate(newValue) {
        // Compare previous selectedValue to newSelection
        // Deselect and unengage if same, make clicked option the selection and set to engaged if not
        this.setState((state, props) => {
          const sameValue = (state.focus === newValue);
  
          return {
              ...state, //copy it
            focus: sameValue ? null : newValue, 
          }
        });
    }



    render() {
        let selectedObject = null;
        let header = null;

        switch(this.state.focus) {
            case "chord":
                selectedObject = <SelectedObject label={this.state.chord.name}/>
                header = <Header engaged={true} userText={this.state.chord ? true : false} leftIcon="stream" rightIcon="search" placeholder="C7, E, Gm, etc" />
                break;
            case "scale":
                selectedObject = <SelectedObject label={this.state.scale.name}/>
                header = <Header engaged={this.state.focus !== null} userText={this.state.scale ? true : false} leftIcon="stream" rightIcon="search" placeholder="C Major, E Lydian, etc" />
                break;
            case "settings":
                header = <Header engaged={this.state.focus !== null} userText={false} rightIcon="keyboard" placeholder="" />
                break;
            case null:
                header = <Header engaged={false} leftIcon="logo" />
                break;
            default:
                throw new Error("state.focus not a valid option");
        }
        return (
            <div className="options">
                    {header}
                    {selectedObject}
                    <Footer onUpdate={this.onFooterUpdate} selectedValue={this.state.focus} />
            </div>
        );
  }
}
  
export default Options;

