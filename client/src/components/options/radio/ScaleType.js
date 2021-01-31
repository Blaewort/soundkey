import React, { Component } from 'react';
import './styles.css'

import Radio from './index'

  class ScaleTypeRadio extends Component {
    constructor(props) {
        super(props);
    }


    render() {
        const title = "Scale Notes";
        const options = [
            {
                html: <>5</>,
                value: "Pentatonic"
            },
            {
                html: <>6</>,
                value: "Hexatonic"
            },
            {
                html: <>7</>,
                value: "Heptatonic"
            },
            {
                html: <>8</>,
                value: "Octatonic"
            },
            {
                html: <>12</>,
                value: "Dodecatonic"
            },
        ];
        //const selectedValue = "Heptatonic";

        return (
            <Radio name={"Scale Type"} title={title} onUpdate={this.props.onUpdate}  options={options} selectedValue={this.props.selectedValue || "Heptatonic"} />
        );
    }
}
  
  export default ScaleTypeRadio;