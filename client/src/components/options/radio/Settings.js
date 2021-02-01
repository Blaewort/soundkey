import React, { Component } from 'react';
import './styles.css'

import Radio from './index'

  class SettingsRadio extends Component {
    constructor(props) {
        super(props);
    }


    render() {
        const title = "Change";
        const options = [
            {
                html: <i class="fas fa-sliders-h"></i>,
                value: "Tunings"
            },
            {
                html: <i class="fas fa-theater-masks"></i>,
                value: "Instruments"
            },
        ];
        //const selectedValue = "Tunings";

        return (
            <Radio name={"Settings"} title={title} onUpdate={this.props.onUpdate}  options={options} selectedValue={this.props.selectedValue || "Tunings"} />
        );
    }
}
  
  export default SettingsRadio;