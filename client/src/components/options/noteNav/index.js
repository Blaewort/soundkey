import React, { Component } from 'react';
import './styles.css'

const OPTIONS = [ //props.options default
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
];


// so if you select something, the custom options will be ordered as if the selection were value 0
function selectedFocus(selection,a,b) {
    const [first, second] = [parseInt(a.value), parseInt(b.value)];
    const [firstIsSelected, secondIsSelected] = [first === selection, second === selection];
    const neither = !secondIsSelected && !firstIsSelected;

    if (neither) {
        // invert relationships if the two are on opposite ends of the selected note so the higher value is "lesser"
        const bothOnSameSideOfSelection = (second > selection && first > selection || second < selection && first < selection);
        return bothOnSameSideOfSelection ? first - second : second - first;
    } else if (firstIsSelected) {
        // all compared items come after selection (first)
        return -1;
    } else if (secondIsSelected) {
        // all compared items come after selection (second)
        return 1;
    }
}

class NoteNav extends Component {
    constructor(props) {
        super(props);

        this.sharp = this.buttonChange.bind(this, 1);
        this.flat = this.buttonChange.bind(this, -1);
        this.buttonChange = this.buttonChange.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
        this.handleCustomSelectClick = this.handleCustomSelectClick.bind(this);
        this.handleCustomOptionClick = this.handleCustomOptionClick.bind(this);
      }
 

    handleCustomSelectClick(event) {
        //TODO: to save renders we might need to put this logic in the stateful controller component (props async)
        this.props.handleCustomSelectClick(event, this.props.name);
    }

    handleClickOutside(event) {
        //TODO: to save renders we might need to put this logic in the stateful controller component (props async)
        this.props.handleClickOutside(event, this.noteSelectNode, this.props.name);
    }

    componentDidMount() {
        document.addEventListener("mousedown", this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener("mousedown", this.handleClickOutside);
    }

    buttonChange(degree){
        const valueLabels = ["A","A#","B","C","C#","D","D#","E","F","F#","G","G#"];

        //TODO: to save renders we might need to put this logic in the stateful controller component (props async)

        const currentValue = parseInt(this.props.value);
        // Add and convert sum to 0-11 number
        let sum = currentValue + parseInt(degree);
        let newValue = sum % 12;
        newValue = (newValue >= 0) ? newValue : newValue + 12;

        this.props.onNoteUpdate({
            value: newValue.toString(), 
            label: valueLabels[newValue],
        }, this.props.name);

    }

    handleCustomOptionClick(event) {
        this.props.onNoteUpdate({
            value: event.currentTarget.dataset.value,
            label: event.currentTarget.textContent
        }, this.props.name);
    }

    render() {
        const opts = this.props.options ? [...this.props.options] : OPTIONS;

        // sort order for user
        const options = opts.sort((a,b) => {
            return parseInt(a.value) - parseInt(b.value); 
        });
        

        const selectOptions = options.map(option => {
            if (this.props.value === option.value) {
                return <option key={option.value} value={option.value} defaultValue>{option.label}</option>
            } else {
                return <option key={option.value} value={option.value}>{option.label}</option>
            }
        });

        let customOptions = [...options].sort(selectedFocus.bind(null, this.props.value));

        customOptions = customOptions.map(option => {
            const thisValue = (this.props.value === option.value);
            if (thisValue) {return null;}; //don't render at all
            return <div onClick={this.handleCustomOptionClick} className={thisValue ? "same-as-selected" : ""} key={option.value} data-value={option.value}>{option.label}</div>
        });
        
        

        return (
            <div className="note_navigator">
                <div className="arrow_container left">
                    <button type="button" onClick={this.flat}>
                        <i className="fas fa-arrow-left"></i>
                    </button>
                </div>

                <div className="note_container">
                    <div ref={(node) => {this.noteSelectNode = node;}} className="note_select" onClick={this.handleCustomSelectClick}>
                        <select name={this.props.name}>
                            {selectOptions}
                        </select>
                        <div className={"select-selected" + (this.props.customListIsOpen ? " select-arrow-active" : "") }>{this.props.label}</div>
                        <div className={"select-items" + (this.props.customListIsOpen ? " select-open" : "" )} >
                            {customOptions}
                        </div>
                    </div>
                </div>

                <div className="arrow_container right">
                    <button type="button" onClick={this.sharp}>
                        <i className="fas fa-arrow-right"></i>
                    </button>
                </div>
            </div>
        );
    }
}
  
export default NoteNav;



        
  

