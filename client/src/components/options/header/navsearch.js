import React, { Component } from 'react';
import './styles.css'
import Header from './index'

function NavSearchHeader(props){
    const rightIcon = ["chord", "scale"].includes(props.focus) ? "search" : "keyboard";

    return (
    <Header onRightIconClick={props.toSearchView} rightIcon={rightIcon} engaged={true} userText={false} />
    )
}

  export default NavSearchHeader;