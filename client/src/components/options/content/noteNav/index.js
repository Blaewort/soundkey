import React, { Component } from 'react';
import Select from 'react-select'
import './styles.css'

class NoteNav extends Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.buttonChange= this.buttonChange.bind(this);
        this.state = {value: {value:'1', label: "A"}};
      }
 

    buttonChange(value){
        const valuesLabel = ["A","A#","B","C","C#","D","D#","E","F","F#","G","G#"];
        let currentStateValue = parseInt(this.state.value.value);
        let nextStateValue = currentStateValue + parseInt(value);
        if(nextStateValue <= 0 ) {
            nextStateValue = 12;
        } else if (nextStateValue >= 13) {
            nextStateValue = 1;
        }
        this.setState({value: {value: nextStateValue, label: valuesLabel[nextStateValue-1]}});
    }

    handleChange(value) {
        this.setState({value: value});
    }

    render() {
        const options = [
            {value:'1', label: "A"},
            {value:'2', label: "A#"},
            {value:'3', label: "B"},
            {value:'4', label: "C"},
            {value:'5', label: "C#"},
            {value:'6', label: "D"},
            {value:'7', label: "D#"},
            {value:'8', label: "E"},
            {value:'9', label: "F"},
            {value:'10', label: "F#"},
            {value:'11', label: "G"},
            {value:'12', label: "G#"}
        ];
        const customStyles = {
            option: (provided, state) => ({
              ...provided,
              border: '1px solid transparent;',
              color: '#bdc0d4',
              background: '#4f5471'
            }),
            placeholder: (provided, state) => ({
                ...provided,
                color: '#bdc0d4'
              }),
              dropdownIndicator: (provided, state) => ({
                ...provided,
                color: 'white',
                background: '#4f5471'
              }),
              valueContainer: (provided, state) => ({
                ...provided,
                color: '#bdc0d4',
                background: '#4f5471'
              }),
              container: (provided, state) => ({
                ...provided,
                color: '#bdc0d4',
                background: '#4f5471'
              }),
              control: (provided, state) => ({
                ...provided,
                color: '#bdc0d4',
                background: '#4f5471'
              }),
              singleValue: (provided, state) => ({
                ...provided,
                color: '#bdc0d4',

              }),
          }

        return (
            <div className="note_navigator">
                <div className="arrow_container left">
                    <button type="button" onClick={(e) => this.buttonChange(-1)}>
                        <i className="fas fa-arrow-left"></i>
                    </button>
                </div>

                <div >
                    <div>
                    <Select 
                        styles={customStyles}
                        options={options} 
                        components={{
                            IndicatorSeparator: () => null
                        }}
                        isSearchable={false}
                        value={this.state.value}
                        onChange={value => this.handleChange(value)}
                        defaultValue={{ label: "A", value: 1 }}
                    />
                    </div>
                </div>

                <div className="arrow_container right">
                    <button type="button" onClick={(e) => this.buttonChange(1)}>
                        <i className="fas fa-arrow-right"></i>
                    </button>
                </div>
        </div>
        );
    }
}
  
export default NoteNav;



        
  

