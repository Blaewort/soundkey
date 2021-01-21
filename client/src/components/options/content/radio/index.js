import React, { Component } from 'react';

class Radio extends Component {

    constructor(props) {
        super(props);
        // ARG: props.options is a list of objects: 
        //            Obj Attributes are .html (jsx html)  .value (str defining value)
        // ARG (Optional): props.title is a string for the title. Not passed, no HTML for it generated
        // ARG (Optional): props.defaultValue is the default value. Defaults to first in list (props.allowDeselect is false) or no selection (props.allowDeselect is true)
        // ARG (Optional): props.allowDeselect. Defaults to false (true means clicking a selected item will deselect it)
        // ARG (Optional): props.baseClassName is class string for any classname you want to pass. Default is "radio"
        // ARG (Optional): props.itemClassName is class string for any style you want to pass FOR THE RADIO OPTION DIVS. Default is "radio_options"

        const {options, allowDeselect} = props;
        // optional
        const defaultValue = props.defaultvalue;
        const baseClassName = props.baseClassName;
        const itemClassName = props.itemClassName;
        const title = props.title;

        if (defaultValue && !options.find(option => option.value === defaultValue)) {
            throw new Error("Default value passed that is not found in the Options list");
        }
        if (baseClassName && typeof baseClassName !== 'string') {
            throw new Error("props.baseClassName is not a string");
        }
        if (itemClassName && typeof itemClassName !== 'string') {
            throw new Error("props.itemClassName is not a string");
        }
        if (title && typeof title !== 'string') {
            throw new Error("props.title is not a string");
        }

        this.state = {
                selectedValue: defaultValue || (allowDeselect ? null : options[0].value),
        }; 

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(event) {
        const newSelection = this.props.options.find(option => option.value === event.currentTarget.dataset.value);
        
        if (this.props.allowDeselect) {
            // Need to compare previous selectedValue to newSelection
            // Deselect if same, make clicked option the selection if not
            this.setState((state, props) => ({
                selectedValue: (state.selectedValue === newSelection.value) ? null : newSelection.value,
            }));

        } else {
            // just make clicked option the selection
            this.setState({
                selectedValue: newSelection.value,
            });
        }
        
        
    }


    render() {
        const title = this.props.title ? <span>{this.props.title}</span> : null; 

        const baseClassName = this.props.baseClassName || "radio";
        const itemClassName = this.props.itemClassName || "radio_options";

        const options = [];
        this.props.options.forEach(opt => {
            //TODO: For accessibility, this should be an input/radio setup rather than the div it is now
            //                         It would alter our use of data-value
            const className = itemClassName + (this.state.selectedValue === opt.value ? " selected" : "" );
            options.push(<div onClick={this.handleClick} data-value={opt.value} className={className}>{opt.html}</div>);
        });


        return (
            <div className={baseClassName}>
                {title}
                {options}
            </div>
        );
    }
}

  export default Radio;
//TODO Add all Radio exports here


