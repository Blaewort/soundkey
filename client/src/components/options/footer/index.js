import React, { Component } from 'react';
import './styles.css'

import Radio from '../content/radio/index'

class Footer extends Component {

  constructor(props) {
      super(props);

      const {engaged=true} = props;

      this.state = {
        enegaged: engaged,
        selectedValue: null,
      }

      this.onUpdate = this.onUpdate.bind(this);
  }

  onUpdate(newValue) {
      // Compare previous selectedValue to newSelection
      // Deselect and unengage if same, make clicked option the selection and set to engaged if not
      this.setState((state, props) => {
        const sameValue = (this.state.selectedValue === newValue);

        return {
          selectedValue: sameValue ? null : newValue,
          engaged: sameValue ? false : true,
        }
      });
  }

    render() {
      const containerClass = "visual_mod_bar";
      const itemClass = "option";
      console.log(this.state.engaged);
      const baseClassName = this.state.engaged ? containerClass + " engaged" : containerClass;

      const options = [
        {
            html: <><button type="button"><i className="fas fa-chess-rook"></i></button><label>Chords</label></>,
            value: "Chords"
        },
        {
            html: <><button type="button"><i className="fas fa-chess-bishop"></i></button><label>Scales</label></>,
            value: "Scales"
        },
        {
            html: <><button type="button"><i className="fas fa-cog"></i></button><label>Settings</label></>,
            value: "Settings"
        }
    ];



    return (
        <Radio onUpdate={this.onUpdate} selectedValue={this.state.selectedValue} baseClassName={baseClassName} itemClassName={itemClass} options={options} allowDeselect={true} ></Radio>
    );
  }
}
  
  export default Footer;