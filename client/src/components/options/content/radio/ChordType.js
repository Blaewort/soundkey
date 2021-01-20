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
                icon: <>3</>,
                value: "Triads"
            },
            {
                icon: <>7</>,
                value: "Seventh Chords"
            },
            {
                icon: <>9</>,
                value: "Ninth Chords"
            },
            {
                icon: <>11</>,
                value: "Eleventh Chords"
            },
            {
                icon: <>13</>,
                value: "Thirteenth Chords"
            },
            {
                icon: <>6</>,
                value: "Sixth Chords"
            }
        ];
        const defaultValue = "Triads";

        return (
            <Radio title={title} options={options} defaultValue={defaultValue} />
        );
    }
}
  
  export default ChordTypeRadio;