import React, { Component } from 'react';

class Radio extends Component {

    constructor(props) {
        super(props);
        // ARG: props.options is a list of objects: 
        //            Obj Attributes are .html (jsx html)  .value (str defining value)
        // ARG (Optional): props.title is a string for the title. Not passed, no HTML for it generated
        // ARG (Optional): props.allowDeselect. Defaults to false (true means clicking a selected item will deselect it)
        // ARG (Optional): props.baseClassName is class string for any classname you want to pass. Default is "radio"
        // ARG (Optional): props.itemClassName is class string for any style you want to pass FOR THE RADIO OPTION DIVS. Default is "radio_options"
        // ARG: onUpdate: is a function that receives 1 arg of 'newSelection' with .value attribute
        // ARG: selectedValue: a value to be selected, must be in among values in options objects. For no selection pass nothing and make sure props.allowDeselect is true

        const {selectedValue, options, title=null, baseClassName=null, itemClassName=null} = props;

        if (selectedValue && !options.find(option => option.value === selectedValue)) {
            throw new TypeError("props.selectedValue does not match any props.options item value");
        }
        if (baseClassName && typeof baseClassName !== 'string') {
            throw new TypeError("props.baseClassName is not a string");
        }
        if (itemClassName && typeof itemClassName !== 'string') {
            throw new TypeError("props.itemClassName is not a string");
        }
        if (title && typeof title !== 'string') {
            throw new TypeError("props.title is not a string");
        }

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(event) {
        //TODO: to save renders we might need to put this logic in the stateful controller component (props async)
        // because this.props.options could change as controller component state changes
        const {options} = this.props;
        const newSelection = options.find(option => option.value === event.currentTarget.dataset.value);

        this.props.onUpdate(newSelection.value, this.props.name);
    }


    render() {

        const {selectedValue, options, baseClassName="radio", itemClassName="radio_option"} = this.props;
        const title = this.props.title ? <span>{this.props.title}</span> : null;
        

        const choices = options.map( option => {
            //TODO: For accessibility, this should be an input/radio setup rather than the div it is now
            //                         It would alter our use of data-value and have CSS implications
            const className = itemClassName + (selectedValue === option.value ? " selected" : "" );
            return <div key={option.value} onClick={this.handleClick} data-value={option.value} className={className}>{option.html}</div>;
        });

        let optionContainer;
        if (this.props.footerOverride) {
            //footer needs options near container for styling (maybe TODO, see if we can remove that req?)
            optionContainer = <>{choices}</>;

        }else {
            optionContainer = <div className="radio_options">{choices}</div>;
        }

        return (
            <div className={baseClassName}>
                {title}
                {optionContainer}
                
            </div>
        );
    }
}

  export default Radio;
//TODO Add all Radio exports here


