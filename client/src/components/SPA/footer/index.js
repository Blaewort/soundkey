import React, { Component } from 'react';
import './styles.css'

import Radio from '../radio/index'

function Footer(props){

      const engaged = props.selectedValue !== null;

      const containerClass = "visual_mod_bar";
      const itemClass = "option";
      const baseClassName = engaged ? containerClass + " engaged" : containerClass;

      const options = [
        {
            html: <><button type="button"><i className="fas fa-chess-rook"></i></button><label>Chords</label></>,
            value: "chord"
        },
        {
            html: <><button type="button"><i className="fas fa-chess-bishop"></i></button><label>Scales</label></>,
            value: "scale"
        },
        {
            html: <><button type="button"><i className="fas fa-cog"></i></button><label>Settings</label></>,
            value: "settings"
        }
    ];



    return (
        <Radio footerOverride={true} onUpdate={props.onUpdate} selectedValue={props.selectedValue} baseClassName={baseClassName} itemClassName={itemClass} options={options} allowDeselect={true} ></Radio>
    );
}

export default Footer;