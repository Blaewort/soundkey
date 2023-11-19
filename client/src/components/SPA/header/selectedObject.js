import React, { Component } from 'react';
import './styles.css'
import Header from './index'

function SelectedObjectHeader(props){
      return (
        <Header onRightIconClick={props.toSearchView} leftIconClick={props.toNavView} engaged={true} userText={false} leftIcon={"stream"} rightIcon={"search"}/>
      )
}

  export default SelectedObjectHeader;