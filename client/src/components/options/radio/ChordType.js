import React, { Component } from 'react';
import './styles.css'

import Radio from './index'

  class ChordTypeRadio extends Component {
    constructor(props) {
        super(props);
    }


    render() {
        const title = "Chord Type";
        const options = [
            {
                html: <>3</>,
                value: "Triads"
            },
            {
                html: <>7</>,
                value: "Seventh Chords"
            },
            {
                html: <>9</>,
                value: "Ninth Chords"
            },
            {
                html: <>11</>,
                value: "Eleventh Chords"
            },
            {
                html: <>13</>,
                value: "Thirteenth Chords"
            },
            {
                html: <>6</>,
                value: "Sixth Chords"
            }
        ];
        //const selectedValue = "Triads";

        return (
            <Radio name={"Chord Type"} onUpdate={this.props.onUpdate} title={title} options={options} selectedValue={this.props.selectedValue || "Triads"} />
        );
    }
}
  
  export default ChordTypeRadio;