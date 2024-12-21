import React, { Component } from 'react';
import './styles.css'

import Radio from './index'

  class ScaleTypeRadio extends Component {
    constructor(props) {
        super(props);
    }

    static defaultValue = "Heptatonic";

    static options = [
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

    render() {
        const title = "Scale Notes";
        
        //const selectedValue = "Heptatonic";

        return (
            <Radio name={"Scale Type"} title={title} onUpdate={this.props.onUpdate}  options={ScaleTypeRadio.options} selectedValue={this.props.selectedValue || "Heptatonic"} />
        );
    }
}

ScaleTypeRadio.getOptionValueFromScaleLength = function getOptionFromScaleLength(length) {
    return {
        5: "Pentatonic",
        6: "Hexatonic",
        7: "Heptatonic",
        8: "Octatonic",
        12: "Dodecatonic"
    }[length];
};
  
  export default ScaleTypeRadio;