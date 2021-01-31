import React, { Component } from 'react';
import './styles.css'
import Header from './index'

function SearchHeader(props){
      return (
        <Header placeholder={props.placeholder} leftIconClick={props.toNavView} engaged={true} userText={true} leftIcon={"stream"} rightIcon={"search"}/>
      )
}

  export default SearchHeader;