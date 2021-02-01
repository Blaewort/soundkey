import React, { Component } from 'react';
import './styles.css'
import Header from './index'

function NavSearchHeader(props){
    let rightIcon;

    if (["chord", "scale"].includes(props.focus)) {
      rightIcon = "search";
    } else { //"settings"
      rightIcon = props.tuning ? "keyboard" : null;
    }

    return (
    <Header onRightIconClick={props.toSearchView} rightIcon={rightIcon} engaged={true} userText={false} />
    )
}

  export default NavSearchHeader;