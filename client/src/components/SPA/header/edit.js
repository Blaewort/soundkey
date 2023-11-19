import React, { Component } from 'react';
import './styles.css'
import Header from './index'

function EditHeader(props){

    return (
    <Header leftIcon={"logo"} engaged={true} userText={false} />
    )
}

  export default EditHeader;