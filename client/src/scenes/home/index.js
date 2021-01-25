import React from 'react';
import Sidebar from '../../components/sidebar/index'
import Content from '../../components/content/index'


import Options from '../../components/options/index'

/*
const OPTIONS = [
    {value:'0', label: "A"},
    {value:'1', label: "A#"},
    {value:'2', label: "B"},
    {value:'3', label: "C"},
    {value:'4', label: "C#"},
    {value:'5', label: "D"},
    {value:'6', label: "D#"},
    {value:'7', label: "E"},
    {value:'8', label: "F"},
    {value:'9', label: "F#"},
    {value:'10', label: "G"},
    {value:'11', label: "G#"}
]; */

function Home() {
    
    
    return (
        <div>
            { null  /* <Sidebar /> */}
            <Options /> 

            
            <Content>
            { /* <ListArea title="Instrument" list={["Guitar","Bass"]}/> */}
            { /* <NoteNav/> */}
            { /* <Header engaged={true} userText={true} leftIcon="logo" rightIcon="keyboard" placeholder=""/> */}
            {/* <SelectedObject label="Bm" subLabel="i"/> */}
            </Content>
        </div>
    );
  }
  
  export default Home;
  