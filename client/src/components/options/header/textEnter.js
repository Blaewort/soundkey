import React, { Component } from 'react';
import './styles.css'
import Header from './index'
import { NonceProvider } from 'react-select';

function TextEnterHeader(props){
    const validatorIcon = props.isValidText ? "check" : "x";
    const button = !props.isValidText ? true : false;
    const rightIconClick = props.isValidText ? props.rightIconClick : null;

      return (
        <Header onRightIconClick={rightIconClick} onTextChange={props.onChange} textValidator={button} placeholder={props.placeholder} leftIconClick={props.toNavView} engaged={true} userText={true} leftIcon={"stream"} rightIcon={validatorIcon}/>
      )
}

  export default TextEnterHeader;

