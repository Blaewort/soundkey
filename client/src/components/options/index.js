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
import GuitarFretboard from '../../scenes/visualizer/guitarFretboard/index';

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
            focus: "chord", // "chord", "scale", "settings", null ---this is with regard to all the controls
            visualizerFocus: "chord", //"chord, "scale"  --this is what the visual instrument is set to
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
        this.setState((state, props) => {
          const sameValue = (state.focus === newValue);
          const visFocusIsChordOrScale = (newValue === "chord" || newValue === "scale");
          return {
              ...state, //copy it
            //Deselect and unengage if same, if not make clicked option the selection and set to engaged
            focus: sameValue ? null : newValue,
            //if 'chord' or 'scale' let it update, otherwise keep the old value, visfocus can only be chord or scale
            visualizerFocus: visFocusIsChordOrScale ? newValue: state.visualizerFocus
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

    toChordNavSearchView(state) {
        const fetchChords = async (state) => {
            const radioValue = state.radio.chord.nav ? state.radio.chord.nav : ChordTypeRadio.defaultValue;
 
            let chords;
            try {
                chords = await fapi_getChords(parseInt(state.noteSelect.chord.value), radioValue, state.scale);
            }
            catch(err){
                console.log(err);
                console.log("badddddd");
                return;
            }
            chords = JSON.parse(chords);
            console.log(chords);
            if(Array.isArray(chords)){
                chords = chords.map(chord => {
                    console.log(chord);
                    return {   
                        "label": chord.name,
                        "object": chord
                    };
                });
                this.setState((state, props) => {
                    //TODO? Do we want to honor prior list state (if any) or keep user snapped to the current chord selection?
                    // We currently honor prior list state as it's easier
 
                    // adding static property defaultValue to radios
 
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
                                nav: chords,
                            }
                        }
                    }
                });
       }}
       return fetchChords(this.state);
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

        let toggle;
        let search;
        let viewSwitch;
        let radio;
        let selection;
        let visualizer;

        //this.state.focus refers to whether the musicViewManager (visualInstrumentManager)? is in chord, scale, settings, or null state
        //NOT whether the visualizer is focused on a single chord or scale
        switch(this.state.focus) {
            case "chord":
                toggle = {
                    onClick: this.handleToggleClick, //is using 'this' okay
                    value: this.state.toggle.chord,
                };
                search = {
                    text: {
                        get: fapi_getChordsFromUserString,
                        input: this.state.textInput.chord,
                        onChange: this.onChordSearchTextChange,
                        onItemClick: this.onSearchChordItemClick,
                    },
                    nav: {
                        chordList: this.state.list.chord.nav,
                        onItemClick: this.onNavSearchChordItemClick,
                    },
                    noteSelect: {
                        handleClickOutside: this.handleCustomClickOutsideNoteNav,
                        onUpdate: this.onNoteSelectionUpdate,
                        handleCustomClick: this.handleCustomNoteNavSelectClick,
                        note: this.state.noteSelect.chord
                    }
                };
                viewSwitch = {
                    toEdit: this.toChordEditView,
                    toNav: this.toChordNavSearchView,
                    toSearch: this.toChordSearchView,
                };
     
                radio = this.state.radio.chord;
                radio.onUpdate = this.onRadioUpdate;

                selection = {
                    primary: this.state.chord,
                    secondary: this.state.scale,
                    onDeselect: this.onChordDeselect,
                    getNearbys: fapi_getChordNearbys,
                };

                //add visual for fretboard,piano
                let notes = [];
                if (this.state.chord && Array.isArray(this.state.chord.notes)) {
                    notes = this.state.chord.notes;
                }

                visualizer = {
                    selectedNotes: notes.map((note) => note.label), //str like "E"
                    instrument: this.state.instrument, //obj with .name (str) and tuning (str like "EADGBE")
                };
                pane = <ChordScalePane visualizer={visualizer} toggle={toggle} search={search} view={this.state.view.chord} viewSwitch={viewSwitch} radio={radio} selection={selection} type="chord" />

                
                
                
                //pane = <ChordScalePane toggle={toggle} search={search} view={this.state.view.chord} viewSwitch={viewSwitch} radio={radio} selection={selection} type="chord" />
                break;
            case "scale":
                toggle = {
                    onClick: this.handleToggleClick, //is using 'this' okay
                    value: this.state.toggle.scale,
                };
                search = {
                    text: {
                        get: fapi_getScalesFromUserString,
                        input: this.state.textInput.scale,
                        onChange: this.onScaleSearchTextChange,
                        onItemClick: this.onSearchScaleItemClick,
                    },
                    nav: {
                        //scaleList: this.state.list.scale.nav, //why doesnt scale need this but chord does
                        onScaleItemClick: this.onNavSearchScaleItemClick,
                        onModeItemClick: this.onNavSearchModeItemClick,
                        mode: this.state.view.scaleNavSearchMode
                    },
                    noteSelect: {
                        handleClickOutside: this.handleCustomClickOutsideNoteNav,
                        onUpdate: this.onNoteSelectionUpdate,
                        handleCustomClick: this.handleCustomNoteNavSelectClick,
                        note: this.state.noteSelect.scale
                    }
                };
                viewSwitch = {
                    toEdit: this.toScaleEditView,
                    toNav: this.toScaleNavSearchView,
                    toSearch: this.toScaleSearchView,
                };

                radio = this.state.radio.scale;
                radio.onUpdate = this.onRadioUpdate;
              
                selection = {
                    primary: this.state.scale,
                    secondary: this.state.chord,
                    onDeselect: this.onScaleDeselect,
                    getNearbys: fapi_getScaleNearbys,
                };
                let modes = {
                    getScalesFromModeName: fapi_getScalesFromModeName,
                    get: fapi_getModes,
                };

               

                //add visual for fretboard,piano
                let notess = [];
                if (this.state.scale && Array.isArray(this.state.scale.notes)) {
                    notess = this.state.scale.notes;
                }
                visualizer = {
                    selectedNotes: notess.map((note) => note.label), //str like "E"
                    instrument: this.state.instrument, //obj with .name (str) and tuning (str like "EADGBE")
                };
                pane = <ChordScalePane  visualizer={visualizer} modes={modes} view={this.state.view.scale} toggle={toggle} search={search} viewSwitch={viewSwitch} radio={radio} selection={selection} type="scale" />

                
               

                
                //pane = <ChordScalePane  modes={modes} view={this.state.view.scale} toggle={toggle} search={search} viewSwitch={viewSwitch} radio={radio} selection={selection} type="scale" />
                break;
            case "settings":
                search = {
                    text: {
                        input: this.state.textInput.settings,
                        onEnterKeyUp: this.onTextEnterKeyUp,
                    },
                    nav: {
                        onInstrumentItemClick: this.onInstrumentNavSearchItemClick,
                        onTuningItemClick: this.onTuningNavSearchItemClick,
                        selectTextTuning: this.selectTextTuningButtonClick,
                    },
                };

                let tuning = {
                    textInput: this.state.textInput.settings,
                    isValidTextTuning: fapi_isValidTextTuning,
                    onTextChange: this.onTuningTextChange,
                    toTextInputView: this.toTuningTextInputView,
                    getTunings: fapi_getTunings,
                };
                
                radio = this.state.radio.settings;
                let onRadioUpdate = this.onRadioUpdate;
              
                let instruments = {
                    name: this.state.instrument.name,
                    getAll: fapi_getInstruments
                };

                //add visual for fretboard,piano
                let notesss = [];
                if (this.state[this.state.visualizerFocus] && Array.isArray(this.state[this.state.visualizerFocus].notes)) {
                    notesss = this.state[this.state.visualizerFocus].notes;
                }
                visualizer = {
                    selectedNotes: notesss.map((note) => note.label), //str like "E"
                    instrument: this.state.instrument, //obj with .name (str) and tuning (str like "EADGBE")
                };

                pane = <SettingsPane visualizer={visualizer} instrument={instruments} search={search} tuning={tuning} radioValue={this.state.radio.settings} onRadioUpdate={this.onRadioUpdate} type="settings" toNavView={this.toSettingsNavView} view={this.state.view.settings} />
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
        let visualInstrument;

        const limitByOther = this.props.toggle.value === true ? this.props.otherSelection : null;
        const searchGets = this.props.search.text.get(this.props.search.text.input, limitByOther);
        const toggleRequired = this.props.selection.secondary;



        
  

        switch(this.props.view) {

            case "selected":
                if(!this.props.selection.primary) {

                    // act like search if there's no primary selection
                    const headerText = this.props.search.text.input;
                    const onTextChange = this.props.search.text.onChange;
                    const toNavView = this.props.viewSwitch.toNav;
                    header = <SearchHeader textValue={headerText} onChange={onTextChange} placeholder={placeholder} toNavView={toNavView} />;

                    if (this.props.visualizer.instrument.name === "Guitar") {
                        visualInstrument = <GuitarFretboard tuningNotes={this.props.visualizer.instrument.tuning} selectedNotes={this.props.visualizer.selectedNotes} />;
                    }

                    if (searchGets) {
                        const listItemClick = this.props.search.text.onItemClick;
                        listArea = <ListArea handleItemClick={listItemClick} list={searchGets} title={this.props.type === "chord" ? "Chords" : "Scales"} />
                    }

                    if (toggleRequired) {
                        toggle = <Toggle handleClick={this.props.toggle.onClick} checked={this.props.toggle.value} title={"Match Scale"} />;
                    }

                } else {

                    header = <SelectedObjectHeader toNavView={this.props.viewSwitch.toNav} toSearchView={this.props.viewSwitch.toSearch} /> ;

                    
                    if (this.props.visualizer.instrument.name === "Guitar") {
                        visualInstrument = <GuitarFretboard tuningNotes={this.props.visualizer.instrument.tuning} selectedNotes={this.props.visualizer.selectedNotes} />;
                    }
                   

                    const toEdit = this.props.viewSwitch.toEdit;
                    const onDeselect = this.props.selection.onDeselect;
                    const label = this.props.selection.primary.name;
                    selectedObject = <SelectedObject onEditRequest={toEdit} onDeselect={onDeselect} label={label}/>;

                }
                break;
            case "search":

                const headerText = this.props.search.text.input;
                const onChange = this.props.search.text.onChange;
                const toNavView = this.props.viewSwitch.toNav;
                header = <SearchHeader textValue={headerText} onChange={onChange} placeholder={placeholder} toNavView={toNavView} />;

                if (this.props.visualizer.instrument.name === "Guitar") {
                    visualInstrument = <GuitarFretboard tuningNotes={this.props.visualizer.instrument.tuning} selectedNotes={this.props.visualizer.selectedNotes} />;
                }

                if (searchGets) {
                    const listItemClick = this.props.search.text.onItemClick;
                    listArea = <ListArea handleItemClick={listItemClick} list={searchGets} title={this.props.type === "chord" ? "Chords" : "Scales"} />
                }

                if (toggleRequired) {
                    toggle = <Toggle handleClick={this.props.toggle.onClick} checked={this.props.toggle.value} title={"Match Scale"} />;
                }

                break;

            case "navsearch":

                if (this.props.type !== "chord" && this.props.type !== "scale") {throw new Error("navsearch must be chord or scale")};

                if (this.props.type === "chord") {

                    //this.props.getChords(this.props.noteSelect.value, this.props.radio.nav, limitByOther);
                    header = <NavSearchHeader toSearchView={this.props.viewSwitch.toSearch} focus={this.props.type}/>

                    if (this.props.visualizer.instrument.name === "Guitar") {
                        visualInstrument = <GuitarFretboard tuningNotes={this.props.visualizer.instrument.tuning} selectedNotes={this.props.visualizer.selectedNotes} />;
                    }

                    const noteNavValue = this.props.search.noteSelect.note.value;
                    const noteNavLabel = this.props.search.noteSelect.note.label;
                    const outsideClick = this.props.search.noteSelect.handleClickOutside;
                    const onNoteUpdate = this.props.search.noteSelect.onUpdate;
                    const customSelectClick = this.props.search.noteSelect.handleCustomClick;
                    const customListIsOpen = this.props.search.noteSelect.customListIsOpen;
                    noteNav = <NoteNav value={noteNavValue} label={noteNavLabel} handleClickOutside={outsideClick} onNoteUpdate={onNoteUpdate} handleCustomSelectClick={customSelectClick} customListIsOpen={customListIsOpen} name={this.props.type} />;
                    

                    const list = this.props.search.navChordList;
                    const listItemClick =this.props.search.nav.onItemClick;
                    listArea = <ListArea title={this.props.radio.nav || "Triad"}  handleItemClick={listItemClick} list={list/*this.props.list*/} />;

                    const radioValue = this.props.radio.nav;
                    const onUpdate = this.props.radio.onUpdate;
                    radio = this.props.type === "chord" ? <ChordTypeRadio selectedValue={radioValue} onUpdate={onUpdate} /> : <ScaleTypeRadio selectedValue={radioValue} onUpdate={onUpdate}/>;
                    
                    if (toggleRequired) {
                        toggle = <Toggle handleClick={this.props.toggle.onClick} checked={this.props.toggle.value} title={"Match Scale"} />;
                    }

                } else if (this.props.type === "scale") {

                    // need to make it a mode list that links to other lists
                    header = <NavSearchHeader toSearchView={this.props.viewSwitch.toSearch} focus={this.props.type}/>;

                    const noteNavValue = this.props.search.noteSelect.note.value;
                    const noteNavLabel = this.props.search.noteSelect.note.label;
                    const outsideClick = this.props.search.noteSelect.handleClickOutside;
                    const onNoteUpdate = this.props.search.noteSelect.onUpdate;
                    const customSelectClick = this.props.search.noteSelect.handleCustomClick;
                    const customListIsOpen = this.props.search.noteSelect.customListIsOpen;
                    noteNav = <NoteNav value={noteNavValue} label={noteNavLabel} handleClickOutside={outsideClick} onNoteUpdate={onNoteUpdate} handleCustomSelectClick={customSelectClick} customListIsOpen={customListIsOpen} name={this.props.type} />;
                    
                    if (this.props.visualizer.instrument.name === "Guitar") {
                        visualInstrument = <GuitarFretboard tuningNotes={this.props.visualizer.instrument.tuning} selectedNotes={this.props.visualizer.selectedNotes} />;
                    }

                    const list = this.props.modes.get(this.props.search.noteSelect.note.value, this.props.radio.nav, limitByOther);
                    const itemClick = this.props.search.nav.onItemClick;
                    listArea = <ListArea title={"Scale Groups"} handleItemClick={itemClick} list={list} />;

                    const radioValue = this.props.radio.nav;
                    const onUpdate = this.props.radio.onUpdate;
                    radio = this.props.type === "chord" ? <ChordTypeRadio selectedValue={radioValue} onUpdate={onUpdate} /> : <ScaleTypeRadio selectedValue={radioValue} onUpdate={onUpdate}/>;
                    
                    if (toggleRequired) {
                        toggle = <Toggle handleClick={this.props.toggle.onClick} checked={this.props.toggle.value} title={"Match Chord"}/>;
                    }

                }
                
                break;
            case "navsearchmode":

                if (this.props.type === "chord") {throw new TypeError("props.type 'chord' has no 'navsearchmode'");}

                header = <NavSearchHeader toSearchView={this.props.viewSwitch.toSearch} focus={this.props.type}/>;

                const noteNavValue = this.props.search.noteSelect.note.value;
                const noteNavLabel = this.props.search.noteSelect.note.label;
                const outsideClick = this.props.search.noteSelect.handleClickOutside;
                const onNoteUpdate = this.props.search.noteSelect.onUpdate;
                const customSelectClick = this.props.search.noteSelect.handleCustomClick;
                const customListIsOpen = this.props.search.noteSelect.customListIsOpen;
                noteNav = <NoteNav value={noteNavValue} label={noteNavLabel} handleClickOutside={outsideClick} onNoteUpdate={onNoteUpdate} handleCustomSelectClick={customSelectClick} customListIsOpen={customListIsOpen} name={this.props.type} />;
                
                if (this.props.visualizer.instrument.name === "Guitar") {
                    visualInstrument = <GuitarFretboard tuningNotes={this.props.visualizer.instrument.tuning} selectedNotes={this.props.visualizer.selectedNotes} />;
                }

                const list = this.props.modes.getScalesFromModeName(this.props.search.noteSelect.note.value, this.props.nav.mode, limitByOther);
                const itemClick = this.props.search.nav.onItemClick;
                listArea = <ListArea title={this.props.nav.mode + " Modes"} handleItemClick={itemClick} list={list} />;

                break;   
            case "edit":

                if (!this.props.selection) {throw new TypeError(this.props.view + " requires this.props.selection (" + this.props.type + ")");}
                if (this.props.type !== "chord" && this.props.type !== "scale") {throw new Error("edit must be chord or scale")};

                header = <EditHeader />

                if (this.props.visualizer.instrument.name === "Guitar") {
                    visualInstrument = <GuitarFretboard tuningNotes={this.props.visualizer.instrument.tuning} selectedNotes={this.props.visualizer.selectedNotes} />;
                }

                if (this.props.type === "chord") {

                    const title = this.props.radio.edit;
                    const itemClick = this.props.search.nav.onItemClick;
                    const list = this.props.selection.getNearbys(this.props.selection.primary,this.props.radio.edit);
                    listArea = <ListArea title={ title || "Extensions"} handleItemClick={itemClick} list={list} />;

                    radio = <EditChordRadio selectedValue={this.props.radio.edit} onUpdate={this.props.radio.onUpdate}/>;

                }else if (this.props.type === "scale") {

                    const title = this.props.radio.edit;
                    const itemClick = this.props.search.nav.onModeItemClick;
                    const list = this.props.selection.getNearbys(this.props.selection.primary, this.props.radio.edit);
                    listArea = <ListArea title={ title || "Alterations"} handleItemClick={itemClick} list={list} />;

                    radio = <EditScaleRadio selectedValue={this.props.radio.edit} onUpdate={this.props.radio.onUpdate} />;

                }

                break;
            default:
                throw new TypeError("this.props.view (" + this.props.view +  " ) is not valid");
        }

        return <>
            {header}
            {visualInstrument}
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
        let visualInstrument;

        

        //                                           //so switches from "Tunings" with "textEnter" to "Instruments" will still act as "navsearch"
        if (this.props.view === "navsearch" || (this.props.view === "textEnter" && this.props.radioValue==="Instruments")) {
            
            tuning = (this.props.radioValue === "Tunings" || !this.props.radioValue) ? true : false;
            header = <NavSearchHeader toSearchView={this.props.tuning.toTextInputView} tuning={tuning} focus={"settings"}/>;

            if (this.props.visualizer.instrument.name === "Guitar") {
                visualInstrument = <GuitarFretboard tuningNotes={this.props.visualizer.instrument.tuning} selectedNotes={this.props.visualizer.selectedNotes} />;
            }

            radio = <SettingsRadio instrument={this.props.instrument.name} selectedValue={this.props.radioValue} onUpdate={this.props.onRadioUpdate}/>;

            if (this.props.radioValue === "Tunings" || !this.props.radioValue) {

                const itemClick = this.props.search.nav.onTuningItemClick;
                const list = this.props.tuning.getTunings("Guitar");
                listArea = <ListArea handleItemClick={itemClick} title={"Tunings"} list={list}></ListArea>;

            } else { // "Instruments"

                const itemClick = this.props.search.nav.onInstrumentItemClick;
                const list = this.props.instrument.getAll();
                listArea = <ListArea handleItemClick={itemClick} title={"Instruments"} list={list}></ListArea>;

            }

        } else { // "textEnter" and "Tunings"

            const isValidTextTuning = this.props.tuning.isValidTextTuning(this.props.tuning.textInput);
            const rightIconClick = isValidTextTuning ? this.props.search.nav.selectTextTuning : null;
            const textInput = this.props.search.text.input;       
            const onKeyUp = this.props.search.text.onEnterKeyUp;
            const onChange = this.props.tuning.onTextChange;
            const toNavView = this.props.toNavView;
            header = <TextEnterHeader textValue={textInput} onTextEnterKeyUp={onKeyUp} rightIconClick={rightIconClick} isValidText={isValidTextTuning} onChange={onChange} placeholder={"E,A,D,G,B,E etc"} toNavView={toNavView} />;
            
            radio = <SettingsRadio instrument={this.props.instrument.name} selectedValue={this.props.radioValue} onUpdate={this.props.onRadioUpdate}/>;

        }


        

        


        return <>
            {header}
            {visualInstrument}
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