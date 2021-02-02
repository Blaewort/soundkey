import React, { Component } from 'react';
import './styles.css'
import Header from './index'

function TextEnterHeader(props){
    const validatorIcon = props.isValidText ? "check" : "x";

      return (
        <Header onTextChange={props.onChange} textValidator={true} placeholder={props.placeholder} leftIconClick={props.toNavView} engaged={true} userText={true} leftIcon={"stream"} rightIcon={validatorIcon}/>
      )
}

  export default TextEnterHeader;

