import React, { Component } from 'react';
import './styles.css'

import Radio from './index'

  class ScaleTypeRadio extends Component {
    constructor(props) {
        super(props);
    }


    render() {
        const title = "Scale Type";
        const options = [
            {
                icon: <>5</>,
                value: "Pentatonic"
            },
            {
                icon: <>6</>,
                value: "Hexatonic"
            },
            {
                icon: <>7</>,
                value: "Heptatonic"
            },
            {
                icon: <>8</>,
                value: "Octatonic"
            },
            {
                icon: <>12</>,
                value: "Dodecatonic"
            },
        ];
        const defaultValue = "Heptatonic";

        return (
            <Radio title={title} options={options} defaultValue={defaultValue} />
        );
    }
}
  
  export default ScaleTypeRadio;