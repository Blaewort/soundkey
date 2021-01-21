import React, { Component } from 'react';
import './styles.css'

class Radio extends Component {

    constructor(props) {
        super(props);
        // ARG: props.options is a list of objects: 
        //            Obj Attributes are .icon (jsx html)  .value (str defining value)
        // ARG: props.title is a string for the title
        // ARG (Optional): props.defaultValue is the default value. Defaults to first in list

        if (props.defaultValue && !props.options.find(opt => opt.value === props.defaultValue)) {
            throw new Error("Default value passed that is not found in the Options list");
        }

        this.state = {
                selectedValue: props.defaultValue || props.options[0].value,
        }; 

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(event) {
        const newSelection = this.props.options.find(option => option.value === event.currentTarget.dataset.value);
        this.setState({
            selectedValue: newSelection.value,
        });
    }


    render() {

        const options = [];
        this.props.options.forEach(opt => {
            //TODO: For accessibility, this should be an input/radio setup rather than the div it is now
            //                         It would alter our use of data-value
            options.push(<div onClick={this.handleClick} data-value={opt.value} className={"radio_options" + (this.state.selectedValue === opt.value ? " selected" : "" )}>{opt.icon}</div>);
        });


        return (
            <div className="radio">
                <span>{this.props.title}</span>
                {options}
            </div>
        );
    }
}

  export default Radio;
//TODO Add all Radio exports here


