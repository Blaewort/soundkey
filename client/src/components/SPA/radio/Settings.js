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
                html: <i className="fa fa-road"></i>,
                value: "Tonewood"
            },
            {
                html: <i class="far fa-hand-paper"></i>,
                value: "Orientation"
            },
            {
                html: <i class="fas fa-guitar"></i>,
                value: "Instruments"
            },
        ];

        const optionsNonTunable = [
            {
                html: <i class="fas fa-sort"></i>,
                /* alternate: <i class="fas fa-divide"></i> */
                /* alternate: <i class="fas fa-arrows-alt-h"></i> */
                value: "Octaves"
            },
            {
                html: <i class="fas fa-ruler-horizontal"></i>,
                value: "Instruments"
            },
        ];


        let options;

        switch(this.props.instrument) {
            case "Guitar":
                options = optionsTunable;
                break;
                case "Bass":
                    options = optionsTunable;
                    break;
            case "Piano":
                options = optionsNonTunable;
                break;
            default:
                throw new Error("figure out what you did wrong" + this.props.instrument);
        }


        //ensures we can have defaults where user supplies no selectedValue 
        let selectedValue;
        if (this.props.instrument === "Guitar" || this.props.instrument === "Bass") {
            selectedValue = this.props.selectedValue || "Tunings";
        } else if (this.props.instrument === "Piano") {
            selectedValue = this.props.selectedValue || "Octaves";
        }

        return (
            <Radio name={"Settings"} title={title} onUpdate={this.props.onUpdate}  options={options} selectedValue={selectedValue} />
        );
    }
}
  
  export default SettingsRadio;