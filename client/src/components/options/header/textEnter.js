import React, { Component } from 'react';
import './styles.css'
import Header from './index'

function TextEnterHeader(props){
    //TODO: checkmark or X based on input
    //TODO: make it not look like a button
      return (
        <Header placeholder={props.placeholder} leftIconClick={props.toNavView} engaged={true} userText={true} leftIcon={"stream"} rightIcon={"x"}/>
      )
}

  export default TextEnterHeader;