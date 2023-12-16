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

    let onRightIconClick = props.toSearchView;
    if (props.focus === "scale" && props.view && props.view === "navsearch") { 
      /* only navsearchmode gets search button on scale focus */
      rightIcon = null;
      onRightIconClick = props.focus === "scale" ? null : onRightIconClick
    }
    

    return (
    <Header onRightIconClick={onRightIconClick} rightIcon={rightIcon} engaged={true} userText={false} />
    )
}

  export default NavSearchHeader;