import React, { Component } from 'react';
import './styles.css'

import Radio from './index'

  class EditScaleRadio extends Component {
    constructor(props) {
        super(props);
    }


    render() {
        const title = "Edit Scale";
        const options = [
            {
                icon: <i class="fas fa-car-battery"></i>,
                value: "Alterations"
            },
            {
                icon: <i class="fas fa-plus"></i>,
                value: "Added Tones"
            },
            {
                icon: <i class="fas fa-minus"></i>,
                value: "Removed Tones"
            }
        ];
        const defaultValue = "Alterations";

        return (
            <Radio title={title} options={options} defaultValue={defaultValue} />
        );
    }
}
  
  export default EditScaleRadio;