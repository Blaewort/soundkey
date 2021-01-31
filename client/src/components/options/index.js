import React, {Component} from 'react';
import './styles.css'

import Header from './header/index';
import SearchHeader from './header/search';
import NavSearchHeader from './header/navsearch';
import SelectedObjectHeader from './header/selectedObject';
import EditHeader from './header/edit';
import Footer from './footer/index';
import SelectedObject from './selectedObject/index';
import NoteNav from './noteNav/index';
import ListArea from './listArea/index';
import ChordTypeRadio from './radio/ChordType';
import ScaleTypeRadio from './radio/ScaleType';
import EditChordRadio from './radio/EditChord';
import EditScaleRadio from './radio/EditScale';
import SettingsRadio from './radio/Settings';

class Options extends Component{

    constructor(props) {
        super(props);

        this.state = {
            chord: {
                root: "E",
                name: "E Major",
                symbol: "E",
                notes: [{label: "E", value: 7},{label: "G#", value: 11}, {label: "B", value: 2}]
            },
            scale: {
                root: "E",
                name: "E Lydian",
                notes: [
                    {label: "E", value: 7},
                    {label: "F#", value: 9}, 
                    {label: "G#", value: 11}, 
                    {label: "A#", value: 1}, 
                    {label: "B", value: 2}, 
                    {label: "C#", value: 4}, 
                    {label: "D#", value: 6}
                ]
            },
            matchToggle: {
                // The toggle is visible when the focus is scale or chord and the other is not null (calculate it)
                scale: true,
                chord: true,
            },
            noteSelect: { 
                chord: {
                    value: "0",
                    label: "A",
                    customListIsOpen: false,
                },
                scale: {
                    value: "0",
                    label: "A",
                    customListIsOpen: false,
                }
            },
            radio: {
                settings: null, //this would just default on mounting,
                chord: {
                    edit: null,
                    nav: null,
                },
                scale: {
                    edit: null,
                    nav: null,
                },
            },
            focus: "chord", // "chord", "scale", "settings", null
            view: {
                scale: "selected", // "selected", "search", "Navearch"
                chord: "selected", // navsearch is the list of modes that link to [navmode] 
                settings: "navsearch",
            }
        };

        this.onFooterUpdate = this.onFooterUpdate.bind(this);
        this.onChordDeselect = this.onChordDeselect.bind(this);
        this.onScaleDeselect = this.onScaleDeselect.bind(this);
        this.toScaleSearchView = this.toScaleSearchView.bind(this);
        this.toChordSearchView = this.toChordSearchView.bind(this);
        this.toChordNavSearchView = this.toChordNavSearchView.bind(this);
        this.toScaleNavSearchView = this.toScaleNavSearchView.bind(this);
        this.toChordEditView = this.toChordEditView.bind(this);
        this.toScaleEditView = this.toScaleEditView.bind(this);

        this.toModeNavSearchView = this.toModeNavSearchView.bind(this);

        this.handleCustomClickOutsideNoteNav = this.handleCustomClickOutsideNoteNav.bind(this);
        this.handleCustomNoteNavSelectClick = this.handleCustomNoteNavSelectClick.bind(this);
        this.onNoteSelectionUpdate = this.onNoteSelectionUpdate.bind(this);
        this.onRadioUpdate = this.onRadioUpdate.bind(this);
    }

    onFooterUpdate(newValue) {
        // Compare previous selectedValue to newSelection
        // Deselect and unengage if same, make clicked option the selection and set to engaged if not
        this.setState((state, props) => {
          const sameValue = (state.focus === newValue);
          return {
              ...state, //copy it
            focus: sameValue ? null : newValue, 
          }
        });
    }

    onChordDeselect() {
        this.setState((state, props) => {
            return {
                ...state,
                chord: null
            }
        });
    }

    onScaleDeselect() {
        this.setState((state, props) => {
            return {
                ...state,
                scale: null
            }
        });
    }

    toChordSearchView() {
        this.setState((state, props) => {
            return {
                ...state,
                view: {
                    ...state.view,
                    chord: "search"
                }
            }
        });
    }

    toScaleSearchView() {
        this.setState((state, props) => {
            return {
                ...state,
                view: {
                    ...state.view,
                    scale: "search"
                }
            }
        });
    }

    toChordNavSearchView() {
        this.setState((state, props) => {
            return {
                ...state,
                view: {
                    ...state.view,
                    chord: "navsearch"
                }
            }
        });
    }

    toScaleNavSearchView() {
        this.setState((state, props) => {
            return {
                ...state,
                view: {
                    ...state.view,
                    scale: "navsearch"
                }
            }
        });
    }

    toModeNavSearchView(mode) {
        // TODO
        this.setState((state, props) => {
            return {
                ...state,
                view: {
                    ...state.view,
                    scale: "navsearchmode"
                }
            }
        });
    }

    toChordEditView() {
        this.setState((state, props) => {
            return {
                ...state,
                view: {
                    ...state.view,
                    chord: "edit"
                }
            }
        });
    }

    toScaleEditView() {
        this.setState((state, props) => {
            return {
                ...state,
                view: {
                    ...state.view,
                    scale: "edit"
                }
            }
        });
    }

    // Note Nav State stuff
    handleCustomClickOutsideNoteNav(event, noteSelectNode, which) {
        // Abort if it's not an outside click
        if (noteSelectNode.contains(event.target)) {return;}


        this.setState((state, props) => {
            const whichObj = state.noteSelect[which];

            return {
                ...state,
                noteSelect: {
                    ...state.noteSelect,
                    [which]: {
                        ...whichObj,
                    customListIsOpen: false
                    }
                },
            }
        });
    }
    handleCustomNoteNavSelectClick(event, which) {

        this.setState((state, props) => {
            const whichObj = state.noteSelect[which];

            return {
                ...state,
                noteSelect: {
                    ...state.noteSelect,
                    [which]: {
                        ...whichObj,
                        customListIsOpen: !state.noteSelect[which].customListIsOpen
                    }
                },
            };
        });
    }

    
    onNoteSelectionUpdate(updated, which) {

        this.setState((state, props) => {
            const whichObj = state.noteSelect[which];

            return {
                ...state,
                noteSelect: {
                    ...state.noteSelect,
                    [which]: {
                        ...whichObj,
                        value: updated.value,
                        label: updated.label
                    }
                },
            };
        });
    }

    // radio stuff
    onRadioUpdate(updated, name) {
        let which;

        if (name.includes("Type")) {
            which = "nav";
        } else if (name.includes("Edit")) {
            which = "edit";
        }
        else if (name === "Settings") {
            which = "settings";
        }

        this.setState((state, props) => {
            const radioFocus = state.radio[state.focus];
            const whichObj = radioFocus ? radioFocus[which] : null;

            if (state.focus === "settings") {
                return {
                    ...state,
                    radio: {
                        ...state.radio,
                        [state.focus]: updated
                    }
                };
            } else {
                return {
                    ...state,
                    radio: {
                        ...state.radio,
                        [state.focus]: {
                            ...radioFocus,
                            [which]: updated
                        }
                    }
                };
            }
            

        });
    }



    render() {

        let pane;

        switch(this.state.focus) {
            case "chord":
                pane = <ChordScalePane radio={this.state.radio.chord} onRadioUpdate={this.onRadioUpdate} noteSelectHandleClickOutside={this.handleCustomClickOutsideNoteNav} noteSelectOnUpdate={this.onNoteSelectionUpdate} noteSelectHandleCustomClick={this.handleCustomNoteNavSelectClick} noteSelect={this.state.noteSelect.chord} toEditView={this.toChordEditView} toNavView={this.toChordNavSearchView} toSearchView={this.toChordSearchView} view={this.state.view.chord} selection={this.state.chord} onDeselect={this.onChordDeselect} type="chord" />
                break;
            case "scale":
                pane = <ChordScalePane radio={this.state.radio.scale} onRadioUpdate={this.onRadioUpdate} noteSelectHandleClickOutside={this.handleCustomClickOutsideNoteNav} noteSelectOnUpdate={this.onNoteSelectionUpdate} noteSelectHandleCustomClick={this.handleCustomNoteNavSelectClick} noteSelect={this.state.noteSelect.scale} toEditView={this.toScaleEditView} toNavView={this.toScaleNavSearchView} toSearchView={this.toScaleSearchView} view={this.state.view.scale} selection={this.state.scale} onDeselect={this.onScaleDeselect} type="scale" />
                break;
            case "settings":
                pane = <SettingsPane radioValue={this.state.radio.settings} onRadioUpdate={this.onRadioUpdate} type="settings" view={this.state.view.settings} />
                break;
            case null:
                pane = <NoFocusPane />;
                break;
            default:
                throw new Error("state.focus not a valid option");
        }
        return (
            <div className="options">
                    {pane}
                    <Footer onUpdate={this.onFooterUpdate} selectedValue={this.state.focus} />
            </div>
        );
  }
}
  
export default Options;
















/* My consituents */


class ChordScalePane extends Component{

    constructor(props) {
        super(props);
        this.getPlaceholder = this.getPlaceholder.bind(this);
    }

    getPlaceholder() {
        switch(this.props.type) {
            case "chord":
                return "C7, E, Am, etc";
                break;
            case "scale":
                return "C Major, E Lydian, etc";
                break;
            default:
                throw TypeError("props.type is not 'scale' or 'chord'");
        }
    }

    render() {
        const placeholder = this.getPlaceholder();
        let header;
        let selectedObject;
        let radio;
        let noteNav;
        let listArea;

        

  

        switch(this.props.view) {
            case "selected":
                if(!this.props.selection) {
                    // act like search if there's no selection
                    header = <SearchHeader placeholder={placeholder} toNavView={this.props.toNavView} />;
                } else {
                    header = <SelectedObjectHeader toNavView={this.props.toNavView} toSearchView={this.props.toSearchView} /> ;
                    selectedObject = <SelectedObject onEditRequest={this.props.toEditView} onDeselect={this.props.onDeselect} label={this.props.selection.name}/>;
                }
                break;
            case "search":
                header = <SearchHeader placeholder={placeholder} toNavView={this.props.toNavView} />;
                break;
            case "navsearch":
                header = <NavSearchHeader toSearchView={this.props.toSearchView} focus={this.props.type}/>;
                noteNav = <NoteNav value={this.props.noteSelect.value} label={this.props.noteSelect.label} handleClickOutside={this.props.noteSelectHandleClickOutside} onNoteUpdate={this.props.noteSelectOnUpdate} handleCustomSelectClick={this.props.noteSelectHandleCustomClick} customListIsOpen={this.props.noteSelect.customListIsOpen} name={this.props.type} />;
                listArea = <ListArea />;
                radio = this.props.type === "chord" ? <ChordTypeRadio selectedValue={this.props.radio.nav} onUpdate={this.props.onRadioUpdate} /> : <ScaleTypeRadio selectedValue={this.props.radio.nav} onUpdate={this.props.onRadioUpdate}/>;
                break;
            case "navsearchmode":
                if (this.props.type === "chord") {throw new TypeError("props.type 'chord' has no 'navsearchmode'");}
                //todo: finish this
                header = <NavSearchHeader toSearchView={this.props.toSearchView} focus={this.props.type}/>;
                break;
            case "edit":
                if (!this.props.selection) {throw new TypeError(this.props.view + " requires this.props.selection (" + this.props.type + ")");}
                header = <EditHeader />
                listArea = <ListArea />;
                radio = this.props.type === "chord" ? <EditChordRadio selectedValue={this.props.radio.edit} onUpdate={this.props.onRadioUpdate}/> : <EditScaleRadio selectedValue={this.props.radio.edit} onUpdate={this.props.onRadioUpdate} />
                break;
            default:
                throw new TypeError("this.props.view (" + this.props.view +  " ) is not valid");
        }

        return <>
            {header}
            {noteNav}
            {listArea}
            {radio}
            {selectedObject}
        </>
    }
}









class SettingsPane extends Component{

    constructor(props) {
        super(props);
    }

    render() {
        const visibleText = null; //TODO conditions on this.props.view
        const leftIcon = null; //TODO conditions on this.props.view
        const rightIcon = "keyboard"; //TODO conditions on this.props.view

        //const header = <Header engaged={true} userText={visibleText} rightIcon={rightIcon} placeholder="" />;

        const header = <NavSearchHeader focus={"settings"}/>;
        const radio = <SettingsRadio selectedValue={this.props.radioValue} onUpdate={this.props.onRadioUpdate}/>

        return <>
            {header}
            {radio}
            TODO: SETTINGS
        </>
    }
}









class NoFocusPane extends Component{

    constructor(props) {
        super(props);
    }

    render() {
        const header = <Header engaged={false} leftIcon="logo" />;

        return <>
            {header}
        </>
    }
}