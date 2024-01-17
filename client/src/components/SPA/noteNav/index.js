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



        this.selectionAppearsInMatchList = this.selectionAppearsInMatchList.bind(this);
        this.enforceSelection = this.enforceSelection.bind(this)
        this.getSelectionMatchFromMatchList = this.getSelectionMatchFromMatchList.bind(this);
        this.matchNotesContains = this.matchNotesContains.bind(this);

        this.sharp = this.buttonChange.bind(this, 1);
        this.flat = this.buttonChange.bind(this, -1);
        this.buttonChange = this.buttonChange.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
        this.handleCustomSelectClick = this.handleCustomSelectClick.bind(this);
        this.handleCustomOptionClick = this.handleCustomOptionClick.bind(this);

        
    }

    selectionAppearsInMatchList() {
        if (!this.props.matchNotes) {return false;}
        return this.getSelectionMatchFromMatchList();

    }

    getSelectionMatchFromMatchList() {
        if (!this.props.matchNotes) {return;}


        //returns matching note or nothing at all
        for (let i = 0; i < this.props.matchNotes.length; i++) {

            const matchNote = this.props.matchNotes[i];

            if (matchNote.value === parseInt(this.props.value)) {
                console.log("tinmanny");
                return matchNote;
            }

        } 
    }


    matchNotesContains(note) {
        if (!this.props.matchNotes) {return;}

        for (let i = 0; i < this.props.matchNotes.length; i++) {

            const matchNote = this.props.matchNotes[i];

            if (matchNote.value === parseInt(note.value)) {
                return matchNote;
            }

        } 

    }

    enforceSelection() {
        if (this.props.name !== "scale") {return;} //only makes sense in chord
        if (this.selectionAppearsInMatchList()) {return;} //nothing to enforce if selection is already in match list

        //find the closest matching note to ours and select it
        //this. stuff needs updating TODO //also might need to change stuff the way options is working
        //this solution is assuming this.options is always 

        let newValue;
        let newLabel;

        // start searching 1 index behind in the array and bridge array end to array beginning
        const indexStart = this.props.value > 0 ? this.props.value - 1 : OPTIONS.length - 1;
        const indexEnd = indexStart > 0 ? indexStart - 1 : OPTIONS.length - 1;
        let index = indexStart;
        
        for (;;) {
            const atFinalItem = indexEnd === index;
            const thisNote = OPTIONS[index];

            const match = this.matchNotesContains(thisNote);
            if (match) {
                newValue = match.value;
                newLabel = match.label;
                break;
            }
         
            // update index
            if ((index + 1) === OPTIONS.length) {
                index = 0;
            } else {
                index++; 
            }

            if (atFinalItem) {break; }
        }

        // call a function that sets top level state
        this.props.onNoteUpdate({
            value: newValue.toString(), //string
            label: newLabel, //string
        }, this.props.name);
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

        if (this.props.enforceMatch) { this.enforceSelection(); }
    }

    
    componentDidUpdate() {
        if (this.props.enforceMatch) { this.enforceSelection(); }
    }

    componentWillUnmount() {
        document.removeEventListener("mousedown", this.handleClickOutside);
    }

    buttonChange(degree){
        const valueLabels = ["A","A#","B","C","C#","D","D#","E","F","F#","G","G#"];

        //TODO: should check if toggle.[chord/scale] === true and toggle.isRequired === true
        //      in that case, should move by degrees in the list of notes we are meant to match
        //      i.e. take the match list (say match E Lydian's E,F#,G#,A#,B,C#,D#), 
        //      find the current selection position in THAT list and then move by whatever degree


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

        console.log("this.props.value");
                console.log(this.props.value);

        const opts = this.props.options && this.props.enforceMatch ? [...this.props.options] : OPTIONS;



        // sort order for user
        const options = opts.sort((a,b) => {
            return parseInt(a.value) - parseInt(b.value); 
        });

        console.log("osptions");
        console.log(options);
        

        const selectOptions = options.map(option => {
            if (this.props.value === option.value) {
                return <option key={option.value} value={option.value} defaultValue>{option.label}</option>
            } else {
                return <option key={option.value} value={option.value}>{option.label}</option>
            }
        });

        console.log("selectOsptions");
        console.log(selectOptions);

        let customOptions = [...options].sort(selectedFocus.bind(null, this.props.value));

        customOptions = customOptions.map(option => {
            const thisValue = (parseInt(this.props.value) === parseInt(option.value));
            
            if (thisValue) { return null;}; //don't render at all    

            return <div onClick={this.handleCustomOptionClick} className={thisValue ? "same-as-selected" : ""} key={option.value} data-value={option.value}>{option.label}</div>
        });

        console.log("customOsptions");
        console.log(customOptions);
        
        

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



        
  

