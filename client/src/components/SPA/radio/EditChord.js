import React, { Component } from 'react';
import './styles.css'

import Radio from './index'

  class EditChordRadio extends Component {
    constructor(props) {
        super(props);
    }

    static defaultValue = "Extensions";

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
            },
            {
                html: <i class="fas fa-sync-alt"></i>,
                value: "Rotations"
            }
        ];
        //const selectedValue = "Extensions";

        return (
            <Radio name={"Edit Chord"} onUpdate={this.props.onUpdate} title={title} options={options} selectedValue={this.props.selectedValue || "Extensions"} />
        );
    }
}
  
  export default EditChordRadio;