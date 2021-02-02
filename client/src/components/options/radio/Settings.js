import React, { Component } from 'react';
import './styles.css'

import Radio from './index'

  class SettingsRadio extends Component {
    constructor(props) {
        super(props);
    }


    render() {
        const title = "Change";


        const optionsTunable = [
            {
                html: <i className="fas fa-sliders-h"></i>,
                value: "Tunings"
            },
            {
                html: <i className="fas fa-theater-masks"></i>,
                value: "Instruments"
            },
        ];

        const optionsNonTunable = [
            {
                html: <i className="fas fa-theater-masks"></i>,
                value: "Instruments"
            },
        ];


        let options;

        switch(this.props.instrument) {
            case "Guitar":
                options = optionsTunable;
                break;
            case "Piano":
                options = optionsNonTunable;
                break;
            default:
                throw new Error("figure out what you did wrong");
        }


        //const selectedValue = "Tunings";

        return (
            <Radio name={"Settings"} title={title} onUpdate={this.props.onUpdate}  options={options} selectedValue={this.props.selectedValue || "Tunings"} />
        );
    }
}
  
  export default SettingsRadio;