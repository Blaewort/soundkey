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
                html: <i class="fas fa-sliders-h">Tun</i>,
                value: "Tunings"
            },
            {
                html: <i class="fas fa-theater-masks">Inst</i>,
                value: "Intruments"
            },
        ];
        const defaultValue = "Tunings";

        return (
            <Radio title={title} options={options} defaultValue={defaultValue} />
        );
    }
}
  
  export default SettingsRadio;