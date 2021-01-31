import React, { Component } from 'react';
import './styles.css'

import Radio from './index'

  class EditChordRadio extends Component {
    constructor(props) {
        super(props);
    }


    render() {
        const title = "Edit Chord";
        const options = [
            {
                html: <i class="fas fa-layer-group"></i>,
                value: "Extensions"
            },
            {
                html: <i class="fas fa-car-battery"></i>,
                value: "Alterations"
            },
            {
                html: <i class="fas fa-plus"></i>,
                value: "Added Tones"
            },
            {
                html: <i class="fas fa-minus"></i>,
                value: "Removed Tones"
            }
        ];
        const selectedValue = "Extensions";

        return (
            <Radio title={title} options={options} selectedValue={selectedValue} />
        );
    }
}
  
  export default EditChordRadio;