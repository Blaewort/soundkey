import React, { Component } from 'react';
import './styles.css'

import Radio from '../content/radio/index'

class Footer extends Component {

  constructor(props) {
      super(props);
  }

    render() {
      const options = [
        {
            html: <><button type="button"><i class="fas fa-chess-rook"></i></button><label>Chords</label></>,
            value: "Chords"
        },
        {
            html: <><button type="button"><i class="fas fa-chess-bishop"></i></button><label>Scales</label></>,
            value: "Scales"
        },
        {
            html: <><button type="button"><i class="fas fa-cog"></i></button><label>Settings</label></>,
            value: "Settings"
        }
    ];


    return (
        <Radio baseClassName="visual_mod_bar" itemClassName="option" options={options} allowDeselect={true} ></Radio>
    );
  }
}
  
  export default Footer;