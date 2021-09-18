import React, {Component} from 'react';
import './styles.css'

import Header from './header/index';
import SearchHeader from './header/search';
import NavSearchHeader from './header/navsearch';
import TextEnterHeader from './header/textEnter';
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
import Toggle from './toggle/index';

import { fapi_getModes, 
    fapi_getScalesFromModeName, 
    fapi_getChords, 
    fapi_getChordNearbys,
    fapi_getScaleNearbys,
    fapi_getTunings,
    fapi_getInstruments,
    fapi_isValidTextTuning,
    fapi_getChordsFromUserString,
    fapi_getScalesFromUserString
}  from '../../services/api/index';

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
            toggle: {
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
            textInput: {
                settings: null,
                chord: null,
                scale: null,
            },
            //TODO/ New Addition: list
            list: {
                chord: {
                    nav: null,
                    edit: null,
                },
                //TODO: Add settings, scale
            },
            focus: "chord", // "chord", "scale", "settings", null
            view: {
                scale: "selected", // "selected", "search", "Navearch"
                chord: "selected", // navsearch is the list of modes that link to [navmode] 
                settings: "navsearch",
                scaleNavSearchMode: null,
            },
            instrument: {
                name: "Guitar",
                tuning: "EADGBE",
            },
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

        this.onNavSearchModeItemClick = this.onNavSearchModeItemClick.bind(this);
        this.onNavSearchChordItemClick = this.onNavSearchChordItemClick.bind(this);
        this.onNavSearchScaleItemClick = this.onNavSearchScaleItemClick.bind(this);

        // these two might be redundant to the above 2
        this.onSearchChordItemClick = this.onSearchChordItemClick.bind(this);
        this.onSearchScaleItemClick = this.onSearchScaleItemClick.bind(this);

        this.toTuningTextInputView = this.toTuningTextInputView.bind(this);
        this.toSettingsNavView = this.toSettingsNavView.bind(this);

        this.onTuningTextChange = this.onTuningTextChange.bind(this);

        this.selectTextTuningButtonClick = this.selectTextTuningButtonClick.bind(this);
        this.onScaleSearchTextChange = this.onScaleSearchTextChange.bind(this);
        this.onChordSearchTextChange = this.onChordSearchTextChange.bind(this);

        this.handleToggleClick = this.handleToggleClick.bind(this);

        this.onTuningNavSearchItemClick = this.onTuningNavSearchItemClick.bind(this);
        this.onInstrumentNavSearchItemClick = this.onInstrumentNavSearchItemClick.bind(this);

        this.onTextEnterKeyUp = this.onTextEnterKeyUp.bind(this);

        
        
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
        console.log("dfsdfdsfsdfsdfdfddddddddddddd2222");
            this.setState(async (state, props) => {
                console.log("dfsdfdsfsdfsdfdfddddddddddddd33333");
                //TODO? Do we want to honor prior list state (if any) or keep user snapped to the current chord selection?
                // We currently honor prior list state as it's easier

                // adding static property defaultValue to radios
                const radioValue = state.radio.chord.nav ? state.radio.chord.nav : ChordTypeRadio.defaultValue;
                console.log("dfsdfdsfsdfsdfdfddddddddddddd44444");

                let chords;
                try {
                    chords = await fapi_getChords(parseInt(state.noteSelect.chord.value), radioValue, state.scale);
                }
                catch(err){
                    console.log(err);
                    console.log("badddddd");
                    return;
                }

                console.log("goodgood");

                console.log("dfsdfdsfsdfsdfdfddddddddddddd");
                // format list of chords to list data
                chords = chords.map(chord => {
                    return {   
                        "label": chord.name,
                        "object": chord
                    };
                });

                console.log("dfsdfdsfsdfsdfdf");

                return {
                    ...state,
                    view: {
                        ...state.view,
                        chord: "navsearch",
                    },
                    //set list to this.state.list.chord.nav
                    list: {
                        ...state.list,
                        chord: {
                            ...state.list.chord,
                            nav: [{"label": "hoi"}],
                        }
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

    toTuningTextInputView() {
        this.setState((state, props) => {
            return {
                ...state,
                view: {
                    ...state.view,
                    settings: "textEnter"
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

    //nav search stuff
    onNavSearchScaleItemClick(e, item) {
        // click from a scale navsearch menu (list of modes)
        // should open menu for mode where items are scales to select
      
        
        this.setState((state, props) => {
            return {
                ...state,
                view: {
                    ...state.view,
                    scale: "navsearchmode",
                    scaleNavSearchMode: item.label
                },
            };
        });

    }

    onNavSearchChordItemClick(e, item) {
        // click chord item to select

        //convert from {label: ddd} to {item.name}
        //const newItem = {name: item.name};

        this.setState((state, props) => {
            return {
                ...state,
                chord: item,
                view: {
                    ...state.view,
                    chord: "selected"
                    
                }
            };
        });

    }

    onNavSearchModeItemClick(e, item) {
        // click scale item to select


        this.setState((state, props) => {
            return {
                ...state,
                scale: item,
                view: {
                    ...state.view,
                    scale: "selected"
                }
            };
        });

    }

    toSettingsNavView() {
        this.setState((state, props) => {
            return {
                ...state,
                view: {
                    ...state.view,
                    settings: "navsearch",
                },
            };
        });
    }

    onTuningTextChange(event) {
        const evt = event.nativeEvent.target.value;

        this.setState((state, props) => {
            return {
                ...state,
                textInput: {
                    ...state.textInput,
                    settings: evt,
                },
            };
        });
    }

    selectTextTuningButtonClick() {
        this.setState((state, props) => {
            //TODO: there should be a converter from text input to array maybe
            const newTuning = state.textInput.settings;

            return {
                ...state,
                textInput: {
                    ...state.textInput,
                    settings: null,
                },
                instrument: {
                    ...state.instrument,
                    tuning: newTuning
                },
                textInput: {
                    //reset text input state
                    ...state.textInput,
                    settings: ""
                },
                focus: null //kick them out to the instrument
            };
        });
    }

    onChordSearchTextChange(event) {
        const evt = event.nativeEvent.target.value;

        this.setState((state, props) => {
            return {
                ...state,
                textInput: {
                    ...state.textInput,
                    chord: evt,
                },
            };
        });
    }

    onScaleSearchTextChange(event) {
        const evt = event.nativeEvent.target.value;

        this.setState((state, props) => {
            return {
                ...state,
                textInput: {
                    ...state.textInput,
                    scale: evt,
                },
            };
        });
    }

    onSearchScaleItemClick(e, item) {
        // click from a scale navsearch menu (list of modes)
        // should open menu for mode where items are scales to select
      
        
        this.setState((state, props) => {
            return {
                ...state,
                scale: item,
                view: {
                    ...state.view,
                    scale: "selected"
                    
                },
                textInput: {
                    //reset text input state
                    ...state.textInput,
                    scale: ""
                },
            };
        });

    }

    onSearchChordItemClick(e, item) {
        // click chord item to select

        //convert from {label: ddd} to {item.name}
        const newItem = {name: item.name};

        this.setState((state, props) => {
            return {
                ...state,
                chord: item,
                view: {
                    ...state.view,
                    chord: "selected"
                    
                },
                textInput: {
                    //reset text input state
                    ...state.textInput,
                    chord: ""
                },
            };
        });

    }

     /* delete this when options state is working */
     handleToggleClick(event) {
        this.setState((state, props) => {
            return {
                toggle: {
                    ...state.toggle,
                    [state.focus]: !state.toggle[state.focus]
                }
            };
        });
      }

    onTuningNavSearchItemClick(e, item) {
        this.setState((state, props) => {
            return {
                ...state,
                instrument: {
                    ...state.instrument,
                    tuning: item.label
                },
                textInput: {
                    //reset text input state
                    ...state.textInput,
                    settings: ""
                },
                focus: null
            };
        });
    }

    onInstrumentNavSearchItemClick(e, item) {
        //TODO: remove .tuning when it's a piano? nonsensical
        this.setState((state, props) => {
            return {
                ...state,
                instrument: {
                    ...state.instrument,
                    name: item.label
                },
                focus: null
            };
        });
    }

    // when user presses enter in tuning text input, update tuning if it's valid
    onTextEnterKeyUp(e, component) {
        if (e.keyCode === 13) {
            //enter
            
        
            //update the tuning in state
            this.setState((state, props) => {

                // but if it's not valid, set the state to the same
                if (!fapi_isValidTextTuning(component.value)) {
                    console.log("bad tuning");
                    return state;
                }

                return {
                    ...state,
                    instrument: {
                        ...state.instrument,
                        tuning: component.value
                    },
                    textInput: {
                        //reset text input state
                        ...state.textInput,
                        settings: ""
                    },
                    focus: null
                };
            });
        }  
    }
 



    render() {

        let pane;

        console.log("this.state");
        console.log(this.state);

        switch(this.state.focus) {
            case "chord":
                pane = <ChordScalePane textValue={this.state.textInput.chord} handleToggleClick={this.handleToggleClick} otherSelection={this.state.scale} toggleValue={this.state.toggle.chord} onSearchItemClick={this.onSearchChordItemClick} textSearch={fapi_getChordsFromUserString} searchInputValue={this.state.textInput.chord} onSearchTextChange={this.onChordSearchTextChange} getChordNearbys={fapi_getChordNearbys} navChordList={this.state.list.chord.nav} onNavSearchItemClick={this.onNavSearchChordItemClick} radio={this.state.radio.chord} onRadioUpdate={this.onRadioUpdate} noteSelectHandleClickOutside={this.handleCustomClickOutsideNoteNav} noteSelectOnUpdate={this.onNoteSelectionUpdate} noteSelectHandleCustomClick={this.handleCustomNoteNavSelectClick} noteSelect={this.state.noteSelect.chord} toEditView={this.toChordEditView} toNavView={this.toChordNavSearchView} toSearchView={this.toChordSearchView} view={this.state.view.chord} selection={this.state.chord} onDeselect={this.onChordDeselect} type="chord" />
                break;
            case "scale":
                pane = <ChordScalePane textValue={this.state.textInput.scale} handleToggleClick={this.handleToggleClick} otherSelection={this.state.chord} toggleValue={this.state.toggle.scale} onSearchItemClick={this.onSearchScaleItemClick} textSearch={fapi_getScalesFromUserString} searchInputValue={this.state.textInput.scale} onSearchTextChange={this.onScaleSearchTextChange} getScaleNearbys={fapi_getScaleNearbys} noteSelect={this.state.noteSelect.scale} mode={this.state.view.scaleNavSearchMode} getScalesFromModeName={fapi_getScalesFromModeName} onNavSearchItemClick={this.onNavSearchScaleItemClick} onNavSearchModeItemClick={this.onNavSearchModeItemClick} getModes={fapi_getModes} radio={this.state.radio.scale} onRadioUpdate={this.onRadioUpdate} noteSelectHandleClickOutside={this.handleCustomClickOutsideNoteNav} noteSelectOnUpdate={this.onNoteSelectionUpdate} noteSelectHandleCustomClick={this.handleCustomNoteNavSelectClick} noteSelect={this.state.noteSelect.scale} toEditView={this.toScaleEditView} toNavView={this.toScaleNavSearchView} toSearchView={this.toScaleSearchView} view={this.state.view.scale} selection={this.state.scale} onDeselect={this.onScaleDeselect} type="scale" />
                break;
            case "settings":
                pane = <SettingsPane textValue={this.state.textInput.settings} onTextEnterKeyUp={this.onTextEnterKeyUp} instrumentName={this.state.instrument.name} onInstrumentNavSearchItemClick={this.onInstrumentNavSearchItemClick} onTuningNavSearchItemClick={this.onTuningNavSearchItemClick} selectTextTuning={this.selectTextTuningButtonClick} tuningText={this.state.textInput.settings} isValidTextTuning={fapi_isValidTextTuning} onTuningTextChange={this.onTuningTextChange} toNavView={this.toSettingsNavView} toTuningTextInputView={this.toTuningTextInputView} getTunings={fapi_getTunings} getInstruments={fapi_getInstruments} radioValue={this.state.radio.settings} onRadioUpdate={this.onRadioUpdate} type="settings" view={this.state.view.settings} />
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
        let toggle;

        const limitByOther = this.props.toggleValue === true ? this.props.otherSelection : null;
        const searchGets = this.props.textSearch(this.props.searchInputValue, limitByOther);
        const toggleRequired = this.props.otherSelection;



        
  

        switch(this.props.view) {

            case "selected":
                if(!this.props.selection) {
                    // act like search if there's no selection
                    header = <SearchHeader textValue={this.props.textValue} onChange={this.props.onSearchTextChange} placeholder={placeholder} toNavView={this.props.toNavView} />;
                    if (searchGets) {
                        listArea = <ListArea handleItemClick={this.props.onSearchItemClick} list={searchGets} title={this.props.type === "chord" ? "Chords" : "Scales"} />
                    }
                    if (toggleRequired) {
                        toggle = <Toggle handleClick={this.props.handleToggleClick} checked={this.props.toggleValue} title={"Match Scale"} />;
                    }
                } else {
                    header = <SelectedObjectHeader toNavView={this.props.toNavView} toSearchView={this.props.toSearchView} /> ;
                    selectedObject = <SelectedObject onEditRequest={this.props.toEditView} onDeselect={this.props.onDeselect} label={this.props.selection.name}/>;
                }
                break;
            case "search":
                header = <SearchHeader textValue={this.props.textValue} onChange={this.props.onSearchTextChange} placeholder={placeholder} toNavView={this.props.toNavView} />;
                if (searchGets) {
                    listArea = <ListArea handleItemClick={this.props.onSearchItemClick} list={searchGets} title={this.props.type === "chord" ? "Chords" : "Scales"} />
                }

                if (toggleRequired) {
                    toggle = <Toggle handleClick={this.props.handleToggleClick} checked={this.props.toggleValue} title={"Match Scale"} />;
                }
                break;
            case "navsearch":
                if (this.props.type === "chord") {
                    //this.props.getChords(this.props.noteSelect.value, this.props.radio.nav, limitByOther);


                    header = <NavSearchHeader toSearchView={this.props.toSearchView} focus={this.props.type}/>
                    noteNav = <NoteNav value={this.props.noteSelect.value} label={this.props.noteSelect.label} handleClickOutside={this.props.noteSelectHandleClickOutside} onNoteUpdate={this.props.noteSelectOnUpdate} handleCustomSelectClick={this.props.noteSelectHandleCustomClick} customListIsOpen={this.props.noteSelect.customListIsOpen} name={this.props.type} />;
                    listArea = <ListArea title={this.props.radio.nav || "Triads"}  handleItemClick={this.props.onNavSearchItemClick} list={this.props.navChordList/*this.props.list*/} />;
                    radio = this.props.type === "chord" ? <ChordTypeRadio selectedValue={this.props.radio.nav} onUpdate={this.props.onRadioUpdate} /> : <ScaleTypeRadio selectedValue={this.props.radio.nav} onUpdate={this.props.onRadioUpdate}/>;
                    if (toggleRequired) {
                        toggle = <Toggle handleClick={this.props.handleToggleClick} checked={this.props.toggleValue} title={"Match Scale"} />;
                    }
                } else if (this.props.type === "scale") {
                    // need to make it a mode list that links to other lists
                    header = <NavSearchHeader toSearchView={this.props.toSearchView} focus={this.props.type}/>;
                    noteNav = <NoteNav value={this.props.noteSelect.value} label={this.props.noteSelect.label} handleClickOutside={this.props.noteSelectHandleClickOutside} onNoteUpdate={this.props.noteSelectOnUpdate} handleCustomSelectClick={this.props.noteSelectHandleCustomClick} customListIsOpen={this.props.noteSelect.customListIsOpen} name={this.props.type} />;
                    listArea = <ListArea title={"Scale Groups"} handleItemClick={this.props.onNavSearchItemClick} list={this.props.getModes(this.props.noteSelect.value, this.props.radio.nav, limitByOther)} />;
                    radio = this.props.type === "chord" ? <ChordTypeRadio selectedValue={this.props.radio.nav} onUpdate={this.props.onRadioUpdate} /> : <ScaleTypeRadio selectedValue={this.props.radio.nav} onUpdate={this.props.onRadioUpdate}/>;
                    if (toggleRequired) {
                        toggle = <Toggle handleClick={this.props.handleToggleClick} checked={this.props.toggleValue} title={"Match Chord"}/>;
                    }
                } else {throw new Error("navsearch must be chord or scale")};
                
                break;
            case "navsearchmode":
                if (this.props.type === "chord") {throw new TypeError("props.type 'chord' has no 'navsearchmode'");}

                let list = this.props.getScalesFromModeName(this.props.noteSelect.value, this.props.mode, limitByOther);

                
                header = <NavSearchHeader toSearchView={this.props.toSearchView} focus={this.props.type}/>;
                noteNav = <NoteNav value={this.props.noteSelect.value} label={this.props.noteSelect.label} handleClickOutside={this.props.noteSelectHandleClickOutside} onNoteUpdate={this.props.noteSelectOnUpdate} handleCustomSelectClick={this.props.noteSelectHandleCustomClick} customListIsOpen={this.props.noteSelect.customListIsOpen} name={this.props.type} />;
                listArea = <ListArea title={this.props.mode + " Modes"} handleItemClick={this.props.onNavSearchModeItemClick} list={list} />;
                break;
            case "edit":
                if (!this.props.selection) {throw new TypeError(this.props.view + " requires this.props.selection (" + this.props.type + ")");}
                
                header = <EditHeader />

                if (this.props.type === "chord") {
                    listArea = <ListArea title={this.props.radio.edit || "Extensions"} handleItemClick={this.props.onNavSearchItemClick} list={this.props.getChordNearbys(this.props.selection,this.props.radio.edit)} />;
                    radio = <EditChordRadio selectedValue={this.props.radio.edit} onUpdate={this.props.onRadioUpdate}/>;
                }else if (this.props.type === "scale") {
                    listArea = <ListArea title={this.props.radio.edit || "Alterations"} handleItemClick={this.props.onNavSearchModeItemClick} list={this.props.getScaleNearbys(this.props.selection, this.props.radio.edit)} />;
                    radio = <EditScaleRadio selectedValue={this.props.radio.edit} onUpdate={this.props.onRadioUpdate} />;
                } else  {throw new Error("edit must be chord or scale")};

                
                
                
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
            {toggle}
        </>
    }
}









class SettingsPane extends Component{

    constructor(props) {
        super(props);
    }

    render() {
        let listArea;
        let tuning;
        let header;
        let radio;

        

        //                                           //so switches from "Tunings" with "textEnter" to "Instruments" will still act as "navsearch"
        if (this.props.view === "navsearch" || (this.props.view === "textEnter" && this.props.radioValue==="Instruments")) {
            tuning = (this.props.radioValue === "Tunings" || !this.props.radioValue) ? true : false;
            header = <NavSearchHeader toSearchView={this.props.toTuningTextInputView} tuning={tuning} focus={"settings"}/>;
            radio = <SettingsRadio instrument={this.props.instrumentName} selectedValue={this.props.radioValue} onUpdate={this.props.onRadioUpdate}/>;

            if (this.props.radioValue === "Tunings" || !this.props.radioValue) {
                listArea = <ListArea handleItemClick={this.props.onTuningNavSearchItemClick} title={"Tunings"} list={this.props.getTunings("Guitar")}></ListArea>;
            } else { // "Instruments"
                listArea = <ListArea handleItemClick={this.props.onInstrumentNavSearchItemClick} title={"Instruments"} list={this.props.getInstruments()}></ListArea>;
            }

        } else { // "textEnter" and "Tunings"
            const isValidTextTuning = this.props.isValidTextTuning(this.props.tuningText);
            const rightIconClick= isValidTextTuning ? this.props.selectTextTuning : null;
                    
            header = <TextEnterHeader textValue={this.props.textValue} onTextEnterKeyUp={this.props.onTextEnterKeyUp} rightIconClick={rightIconClick} isValidText={isValidTextTuning} onChange={this.props.onTuningTextChange} placeholder={"E,A,D,G,B,E etc"} toNavView={this.props.toNavView} />;
            radio = <SettingsRadio instrument={this.props.instrumentName} selectedValue={this.props.radioValue} onUpdate={this.props.onRadioUpdate}/>;

        }


        

        


        return <>
            {header}
            {listArea}
            {radio}
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