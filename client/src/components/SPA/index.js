import React, {Component} from 'react';
import './styles.css'

import ChordScaleController from './Controller/ChordScale/index';
import InstrumentController from './Controller/Instrument/index';
import EmptyController from './Controller/Empty/index';
import ChordTypeRadio from './radio/ChordType'; //need these radios for their defaultValues
import ScaleTypeRadio from './radio/ScaleType';
import EditChordRadio from './radio/EditChord';
import EditScaleRadio from './radio/EditScale';
import SettingsRadio from './radio/Settings';

import ListStateManager from './StateManager/ListStateManager';

import { 
    fapi_getScaleGroups,
    fapi_getScales, 
    fapi_getScalesFromModeName, 
    fapi_getChords,
    fapi_getChordExtensions,
    fapi_getChordAlterations, 
    fapi_getChordAppendments,
    fapi_getChordDeductions,
    fapi_getChordRotations,
    fapi_getScaleAlterations,
    fapi_getScaleAppendments,
    fapi_getScaleDeductions,
    fapi_getScaleRotations,
    fapi_getScaleFromUserString,
    fapi_getChordNearbys,
    fapi_getScaleNearbys,
    fapi_getTunings,
    fapi_getInstruments,
    fapi_isValidTextTuning,
    fapi_getChordsFromUserString,
    fapi_getScalesFromUserString,
    fapi_getAllTonewood,
    fapi_getOrientations,
    fapi_getAllPianoOctaves,
}  from '../../services/api/index';


/* if this code doesnt work correctly, it means the media queries when we start running out of height wont work properly, and this would be the biggest issue in landscape mode
    on smaller/mobile devices */
function getLandScapeClassName({base, focus, view, navSearchGets, textSearchGets, selection, radio, instrument}) {
    if (typeof myVar === "string") {throw new TypeError("'base' must be of type 'string'");}

    let classString = base.concat(" ");
    if (listIsVisible(view, focus, navSearchGets, textSearchGets, radio, selection, instrument)) {classString = classString.concat("with-list "); }
    if (radioIsVisible(view, focus)) {classString = classString.concat("with-radio ");}
    if (notenavIsVisible(view, focus)) {classString = classString.concat("with-notenav ")}
    if (toggleIsVisible(view, focus, selection, radio)) {classString = classString.concat("with-toggle ")}

    return classString;
}

function toggleIsVisible(view, focus, selection, radio) {
    if (focus === "settings") { return InstrumentController.toggleIsVisible(); }
    return ChordScaleController.toggleIsVisible(view[focus], selection, focus, radio);
}

function notenavIsVisible(view, focus) {
    if (focus === "settings") {return InstrumentController.notenavIsVisible();}
    return ChordScaleController.notenavIsVisible(view[focus]);
}

function radioIsVisible(view, focus) {
    if (focus === "settings") { return InstrumentController.radioIsVisible(); }
    return ChordScaleController.radioIsVisible(view[focus]);
}

function listIsVisible(view, focus, navSearchGets, textSearchGets, radio, selection, instrument) {
    if (focus === "settings") { return InstrumentController.listIsVisible(view[focus], radio.settings, instrument); }
    return ChordScaleController.listIsVisible(view[focus], navSearchGets, textSearchGets, selection)
}





class SPA extends Component{

    /* DEBUG */
    componentDidUpdate(prevProps, prevState) {
        console.log("UPDATE SPA__________________________________________!");
        Object.entries(this.props).forEach(([key, val]) =>
          prevProps[key] !== val && console.log(`Prop '${key}' changed`)
        );
        if (this.state) {
          Object.entries(this.state).forEach(([key, val]) =>
            prevState[key] !== val && console.log(`State '${key}' changed`)
          );
          console.log(prevState.noteSelect);
          console.log("VS");
          console.log(this.state.noteSelect);
        }
    }

    constructor(props) {
        super(props);
        this.state = {
             chord: {
                rootNote: {
                    name: "E",
                    value: 7,
                },
                name: "E Minor",
                symbol: "Em",
                category: "Triad",
                notes: [{label: "E", value: 7},{label: "G", value: 11}, {label: "B", value: 2}],
                triadBase: "Minor"
            },
            chord: {
                rootNote: {
                    name: "E",
                    value: 7,
                },
                name: "E Minor Seven",
                symbol: "Em7",
                category: "Seven",
                notes: [{label: "E", value: 7},{label: "G", value: 11}, {label: "B", value: 2}, {label: "D", value: 5}],
                triadBase: "Minor"
            },
            chord: {
                rootNote: {
                    name: "E",
                    value: 7,
                },
                name: "E Major",
                symbol: "E",
                category: "Triad",
                notes: [{label: "E", value: 7},{label: "G#", value: 12}, {label: "B", value: 2}],
                triadBase: "Major"
            },
            chord: {
                rootNote: {
                    name: "B",
                    value: 2,
                },
                name: "B Major", 
                symbol: "B",
                category: "Triad",
                notes: [{label: "B", value: 2},{label: "D#", value: 6}, {label: "F#", value: 9}],
                triadBase: "Major"
            },
            chord: {
                rootNote: {
                    name: "B",
                    value: 2,
                },
                name: "B Minor",
                symbol: "Bm",
                category: "Triad",
                notes: [{label: "B", value: 2},{label: "D", value: 5}, {label: "F#", value: 9}],
                triadBase: "Minor"
            },
            /*chord: {
                rootNote: {
                    name: "B",
                    value: 2,
                },
                name: "B Suspended Two",
                symbol: "B",
                category: "Triad",
                notes: [{label: "B", value: 2},{label: "C#", value: 4}, {label: "F#", value: 9}],
                triadBase: "Suspended Two" // need this for extensions to work properly
            },*/
            /* chord: {
                root: "E",
                name: "E Diminished",
                symbol: "Edim",
                category: "Triad",
                notes: [{label: "E", value: 7},{label: "G", value: 10}, {label: "A#", value: 1}],
                triadBase: "Diminished"
            },*/
            
            /*chord: {
                root: "E",
                name: "E Major",
                symbol: "E",
                category: "Triad",
                notes: [{label: "E", value: 7},{label: "G#", value: 11}, {label: "B", value: 2}],
                triadBase: "Major"
            },*/
            /*chord: {
                root: "E",
                name: "E Major Seven",
                symbol: "Emaj7",
                category: "Seven",
                notes: [{label: "E", value: 7},{label: "G#", value: 11}, {label: "B", value: 2}, {label: "D#", value: 6}],
                triadBase: "Major"
            },*/
            /*chord: {
                root: "A",
                name: "A Minor",
                symbol: "Am",
                category: "Triad",
                notes: [{label: "A", value: 0},{label: "C", value: 3}, {label: "E", value: 7}],
                triadBase: "Minor"
            },*/
            scale: {
                root: "E",
                /*name: "E Lydian",
                 notes: [
                    {label: "E", value: 7},
                    {label: "F#", value: 9}, 
                    {label: "G#", value: 11}, 
                    {label: "A#", value: 1}, 
                    {label: "B", value: 2}, 
                    {label: "C#", value: 4}, 
                    {label: "D#", value: 6}
                ],*/
                /*name: "A Dorian",
                notes: [
                    {label: "A", value: 0},
                    {label: "B", value: 2}, 
                    {label: "C", value: 3}, 
                    {label: "D", value: 5}, 
                    {label: "E", value: 7}, 
                    {label: "F#", value: 9}, 
                    {label: "G", value: 10}
                ]*/
                name: "E Dorian",
                notes: [
                    {label: "E", value: 7},
                    {label: "F#", value: 9}, 
                    {label: "G", value: 10}, 
                    {label: "A", value: 0}, 
                    {label: "B", value: 2}, 
                    {label: "C#", value: 4}, 
                    {label: "D", value: 5}
                ],
                
            },
            scaleGroupNavSelection: {
                id: 0,
                name: "Diatonic"
            },
            toggle: {
                // The toggle is visible when the focus is scale or chord and the other is not null (calculate it)
                scale: true,
                chord: true,
            },
            noteSelect: { 
                chord: {
                    value: "2",
                    label: "B",
                    customListIsOpen: false,
                },
                scale: {
                    value: "7",
                    label: "E",
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
                    text: null,
                },
                scale: {
                    edit: null,
                    text: null,
                    navModes: null, //list of actual scales
                    navGroups: null // list of scale groups
                },
                modal: {
                    chord: true, //I'd like the low-heigh modals to be on by default on website entry. Even though you can't
                    scale: true, //    use some of the controls with modal on (theoretically?), the defaults are user friendly 
                    settings: true,
                },
                //TODO: Add settings
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
                pianoOctaves: 2,
                tonewood: "Rosewood",
                orientation: "Right-Handed"
            },
        };

        const methods = [
            "onFooterUpdate",
            "onChordDeselect",
            "onScaleDeselect",
            "toScaleSearchView",
            "toChordSearchView",
            "toChordNavSearchView", //data done
            "toScaleNavSearchView",
            "toChordEditView",
            "toScaleEditView",
            "toModeNavSearchView",
            "handleCustomClickOutsideNoteNav",
            "handleCustomNoteNavSelectClick",
            "onNoteSelectionUpdate", //done for chords
            "onRadioUpdate",  //done only for chord update. i think ideal solution
            "onNavSearchModeItemClick",
            "onNavSearchChordItemClick",
            "onNavSearchScaleItemClick",
            // these two might be redundant to the above 2
            "onSearchChordItemClick",
            "onSearchScaleItemClick",
            "toTuningTextInputView",
            "toSettingsNavView",
            "onTuningTextChange",
            "selectTextTuningButtonClick",
            "onScaleSearchTextChange",
            "onChordSearchTextChange",
            "handleToggleClick",
            "onTuningNavSearchItemClick",
            "onInstrumentNavSearchItemClick",
            "onTonewoodNavSearchItemClick",
            "onOrientationItemClick",
            "onOctaveItemClick",
            "onListModalExitClick",
            "openListModal",
            "onTextEnterKeyUp",
            "updateNavSearchChordList",
            "updateEditedChordList"
        ];

        methods.forEach((method) => {
            this[method] = this[method].bind(this);
        });
          
    }

    onFooterUpdate(newValue) {   
        this.setState((state, props) => {
          const sameValue = (state.focus === newValue);
          const visFocusIsChordOrScale = (newValue === "chord" || newValue === "scale");

        //if (sameValue && visFocusIsChordOrScale) {//keep focus value and set view to "selected"}
        //if (sameValue && !visFocusIsChordOrScale) {// set focus to null}
        //if !sameValue {// set focus to newValue}

        //todo: refactor divergent returns
        
        let newFocus;

        if (sameValue) {
            // if sameValue && visFocusIsChordOrScale, keep focus value, otherwise !visFocusIsChordOrScale so set to null
            newFocus =  visFocusIsChordOrScale ? state.focus : null;

            if (state.focus === "scale" && (!state.primary && state.view.scale === "search"))  {
                return {
                    ...state, //copy it
                  focus: newFocus,
                  //if 'chord' or 'scale' let it update, otherwise keep the old value, visfocus can only be chord or scale
                  visualizerFocus: visFocusIsChordOrScale ? newValue: state.visualizerFocus,
                  view: {
                      ...state.view,
                      [state.focus]: (sameValue && visFocusIsChordOrScale) ? "selected" : state.view[state.focus],
                  }
                }
            }

            if (state.focus === "scale" && (state.view.scale === "search" || state.view.scale === "navsearchmode")) {


                // nullify appropriate list so list will be empty so ListArea will render a spinning loader until data is fetched
                // TODO later maybe we should check to see if params changed so we dont needlessly get the same data as before?
                const nullifiedList = ListStateManager.getNullifiedListState(state); 

                if (nullifiedList) {
                    return {
                        ...state, //copy it
                      focus: newFocus,
                      //if 'chord' or 'scale' let it update, otherwise keep the old value, visfocus can only be chord or scale
                      visualizerFocus: visFocusIsChordOrScale ? newValue: state.visualizerFocus,
                      view: {
                          ...state.view,
                          [state.focus]: (sameValue && visFocusIsChordOrScale) ? "navsearch" : state.view[state.focus],
                      },
                      list: { // clear the list so the loading icon will appear
                          ...state.list,
                          [state.focus]: {
                              ...state.list[state.focus],
                              navGroups: null
                          }
                      }
                    }
                }
            
                // else no nullify
                return {
                    ...state, //copy it
                  focus: newFocus,
                  //if 'chord' or 'scale' let it update, otherwise keep the old value, visfocus can only be chord or scale
                  visualizerFocus: visFocusIsChordOrScale ? newValue: state.visualizerFocus,
                  view: {
                      ...state.view,
                      [state.focus]: (sameValue && visFocusIsChordOrScale) ? "navsearch" : state.view[state.focus],
                  }
                }
            }
        } else {
            // not sameValue, so we need to update
            newFocus = newValue;
        }

          return {
              ...state, //copy it
            focus: newFocus,
            //if 'chord' or 'scale' let it update, otherwise keep the old value, visfocus can only be chord or scale
            visualizerFocus: visFocusIsChordOrScale ? newValue: state.visualizerFocus,
            view: {
                ...state.view,
                [state.focus]: (sameValue && visFocusIsChordOrScale) ? "selected" : state.view[state.focus],
            }
          }
        }, async () => {

            if (this.state.focus === "scale") {
                switch(this.state.view.scale) {
                    case "navsearch":
                        this.updateNavSearchScaleGroupList();
                        break;
                    case "navsearchmode":
                        this.updateNavSearchScaleList();
                        break;
                }
            }
        });
    }

    onChordDeselect() {
        this.setState((state, props) => {
            return {
                ...state,
                chord: null
            }
        }, async () => {
            if (this.state.view.chord === "selected") {
                //on deselect scale view we go to text search so need to update it
                this.updateChordTextSearchList();
            }
        });
    }

    onScaleDeselect() {
        this.setState((state, props) => {
            return {
                ...state,
                scale: null
            }
        }, async () => {
            if (this.state.view.scale === "selected") {
                //on deselect scale view we go to text search so need to update it
                this.updateScaleTextSearchList();
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
        }, async () => {
            this.updateScaleTextSearchList();
        });
    }

    async toChordNavSearchView() {
        // Update state of view first
        this.setState((state, props) => {
            return {
                ...state,
                view: {
                    ...state.view,
                    chord: "navsearch",
                },
                list: { // clear the list so the loading icon will appear
                    ...state.list,
                    [state.focus]: {
                        ...state.list[state.focus],
                        nav: null
                    }
                }
            }
        },
        async () => {
            // THEN Fetch the new list in the nav only after state is updated
            this.updateNavSearchChordList();
        });
    }

    toScaleNavSearchView() {
        this.setState((state, props) => {
            return {
                ...state,
                view: {
                    ...state.view,
                    scale: "navsearch"
                },
                list: { // clear the list so the loading icon will appear
                    ...state.list,
                    [state.focus]: {
                        ...state.list[state.focus],
                        navGroups: null
                    }
                }
            }
        }, async () => {
            this.updateNavSearchScaleGroupList();
        });
    }

    updateNavSearchGroupList() {
        // fetch scale groups and put them in the this.list.scale.navgroup list
    }

    toModeNavSearchView(mode) {
        this.setState((state, props) => {
            return {
                ...state,
                view: {
                    ...state.view,
                    scale: "navsearchmode"
                },
                list: { // clear the list so the loading icon will appear
                    ...state.list,
                    [state.focus]: {
                        ...state.list[state.focus],
                        navModes: null
                    }
                }
            }
        }, async () => {
            this.updateNavSearchScaleList();
        });
    }

    async updateNavSearchScaleList() {
        // fetch scales and put them in this.list.scale.nav list
        console.log("inside updateNavSearchScaleList");
        

        let newList;
        try{
            newList = await this.fetchBasicScaleList();
        }

        catch(err){
            console.log(err);
            console.log("bad scale fetch");
            return;
        }
        if (newList) {
            this.setState((state) => ({
                list: {
                    ...state.list,
                    [state.focus]: {
                        ...state.list[state.focus],
                        navModes: newList,
                    },
                },
            }));
        }
    }

    async fetchBasicScaleList() {
        console.log("inside fetchBasicScaleList");
        const state = this.state;

        // objectLimiter is selected scale
        const objectLimiter = state.chord && state.toggle.scale ? state.chord : null;
        const groupID = state.scaleGroupNavSelection?.id;

        try {
            let response;
            console.log("inside fetchBasicScaleList");
            response = await fapi_getScales(parseInt(state.noteSelect.scale.value), objectLimiter, groupID);

            let newList = response;

            if (Array.isArray(newList)) {
                return newList.map((obj) => ({
                    label: obj.name,
                    object: obj,
                }));
            }
        } catch (err) {
            console.error("Error fetching new list:", err);
        }
        
        return null;
    }

    async updateNavSearchScaleGroupList() {
        // get a list of scale groups like (for 7 notes) Diatonic, Melodic Minor, Neapolitan Major, Neapolitan Minor, Harmonic Minor, Harmonic Major, etc
        console.log("inside updateNavSearchScaleGroupList");
        

        let newList;
        try{
            newList = await this.fetchScaleGroupList();
        }

        catch(err){
            console.log(err);
            console.log("bad scale fetch");
            return;
        }
        if (newList) {
            this.setState((state) => ({
                list: {
                    ...state.list,
                    [state.focus]: {
                        ...state.list[state.focus],
                        navGroups: newList,
                    },
                },
            }));
        }
    }

    async fetchScaleGroupList() {
        console.log("inside fetchAScaleGroupList");
        const state = this.state;
        const scaleCountType = state.radio.scale.nav || ScaleTypeRadio.defaultValue;

        // objectLimiter is selected scale
        const objectLimiter = state.chord && state.toggle.scale ? state.chord : null;

        try {
            let response;
            console.log("inside fetchScaleGroupList");
            response = await fapi_getScaleGroups(parseInt(state.noteSelect.scale.value), objectLimiter, scaleCountType);

            let newList = response;

            if (Array.isArray(newList)) {
                return newList.map((obj) => ({
                    label: obj.name,
                    object: obj,
                }));
            }
        } catch (err) {
            console.error("Error fetching new list:", err);
        }
        
        return null;


    }

    toChordEditView() {
        this.setState((state, props) => {
            return {
                ...state,
                view: {
                    ...state.view,
                    chord: "edit"
                },
                list: { // clear the list so the loading icon will appear
                    ...state.list,
                    [state.focus]: {
                        ...state.list[state.focus],
                        edit: null
                    }
                }
            }
        },
        async () => {
            this.updateEditedChordList();
        });
    }

    toScaleEditView() {
        this.setState((state, props) => {
            return {
                ...state,
                view: {
                    ...state.view,
                    scale: "edit"
                },
                list: { // clear the list so the loading icon will appear
                    ...state.list,
                    [state.focus]: {
                        ...state.list[state.focus],
                        edit: null
                    }
                }
            }
        }, async () =>  {
            this.updateEditedScaleList();
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

        //check if what we are about to change is same

        


        this.setState((state, props) => {
            const whichObj = state.noteSelect[which];

            if (whichObj.customListIsOpen === false) {
                return null;  // No state change
            } // there was a huge bug where not doing this check cause react to think it updated when it didn't

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
            
            const nullifiedList = ListStateManager.getNullifiedListState(state);

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
                list: nullifiedList || state.list
            };
        },
        async () => {
            // fetch only after updated
            switch(this.state.focus) {
                case "chord":
                    this.updateNavSearchChordList();
                    break;
                case "scale":
                    // not yet supported
                    if (this.state.view.scale === "navsearchmode") {
                        this.updateNavSearchScaleList();
                    } else if (this.state.view.scale === "navsearch"){
                        this.updateNavSearchScaleGroupList();
                    } else {throw new Error("this.state.view.scale is impossible value");}
                    break;
                default:
                    throw Error("onNoteSelectionUpdate should be called only when this.state.focus is 'chord' or 'scale'. Instead got :" + this.state.focus);
                    break;
            }
        });
    }

    async onRadioUpdate(updated, name) {
        let which;
    
        if (name.includes("Type")) {
            which = "nav";
        } else if (name.includes("Edit")) {
            which = "edit";
        } else if (name === "Settings") {
            which = "settings";
        }

  
    
        // Update state first with the updated radio value
        this.setState((state) => {
                // FIRST update the radio state
                const radioFocus = state.radio[state.focus];

                // nullify appropriate list so list will be empty so ListArea will render a spinning loader until data is fetched
                // TODO later maybe we should check to see if params changed so we dont needlessly get the same data as before?
                

                if (which !== "settings") { //chord or scale view
                        const nullifiedList = ListStateManager.getNullifiedListState(state);

                        console.log("returning nullified list");
                        console.log(nullifiedList);
                        return {
                            ...state,
                            radio: {
                                ...state.radio,
                                [state.focus]: {
                                    ...radioFocus,
                                    [which]: updated,
                                },
                            },
                            list: nullifiedList || state.list
                        };
                }
                else if (which === "settings") {
                    return {
                        ...state,
                        radio: {
                            ...state.radio,
                            [state.focus]: updated
                        }
                    };
                }
            },
            async () => {
                // THEN Fetch the new list in the nav only after state is updated

                if (this.state.focus === "chord") {
                    this.chordRadioDataUpdate();
                } else if(this.state.focus === "scale") {
                    this.scaleRadioDataUpdate();
                }

                // settings doesnt fetch data from the Database (at least yet. Biggest thing is tunings which we could hardcode until the list grows large)
            }
        );
    }
    
    async chordRadioDataUpdate() {
        switch(this.state.view.chord){
            case "navsearch":
                this.updateNavSearchChordList();
                break;
            case "edit":
                this.updateEditedChordList();
                break;
            default:
                throw new Error("chordRadioUpdate called when we are not in this.state.view.chord of 'navsearch' or 'edit' but rather: " + this.state.view.chord);
                break;
        }
    }

    async scaleRadioDataUpdate() {
        switch(this.state.view.scale) {
            case "navsearch": // looking at a list of scale groups like 'Diatonic', 'Melodic Minor' which has a radio
                this.updateNavSearchScaleGroupList(); // update scale group list based on radio selection (number of notes)
                break;
            case "edit":
                this.updateEditedScaleList();
                break;
            default:
                throw new Error("scaleRadioUpdate called when not in this.state.view.scale of 'navsearch' or 'edit' but rather: " + this.state.view.scale);
        }
    }

    async updateEditedScaleList() {
        console.log("inside updateEditedScaleList");
        const radioValue = this.state.radio.scale.edit || EditScaleRadio.defaultValue;
        const whichFetch = {
            "Alterations": "fetchAlteredScaleList",
            "Added Tones": "fetchAppendedScaleList",
            "Removed Tones": "fetchDeductedScaleList",
            "Rotations": "fetchRotatedScaleList"
        }[radioValue] || "not a supported radioValue for updatedEditedScaleList";

        console.log(whichFetch);
        console.log("whichFetch^");

        let newList;
        try{
            newList = await this[whichFetch]();
        }

        catch(err){
            console.log(err);
            console.log("bad chord fetch");
            return;
        }
        if (newList) {
            this.setState((state) => ({
                list: {
                    ...state.list,
                    [state.focus]: {
                        ...state.list[state.focus],
                        edit: newList,
                    },
                },
            }));
        }
    }

    async updateScaleTextSearchList() {
        console.log("inside updateScaleTextSearchList");

        let newList;
        try{
            newList = await this.fetchScaleTextSearchList();
        }

        catch(err){
            console.log(err);
            console.log("bad chord fetch");
            return;
        }
        if (newList) {
            this.setState((state) => ({
                list: {
                    ...state.list,
                    [state.focus]: {
                        ...state.list[state.focus],
                        text: newList,
                    },
                },
            }));
        }
    }

    async updateEditedChordList() {
        console.log("inside updateEditedChordList");
        const radioValue = this.state.radio.chord.edit || EditChordRadio.defaultValue;
        const whichFetch = {
            "Extensions": "fetchExtendedChordList",
            "Alterations": "fetchAlteredChordList",
            "Added Tones": "fetchAppendedChordList",
            "Removed Tones": "fetchDeductedChordList",
            "Rotations": "fetchRotatedChordList",
        }[radioValue] || "not a supported radioValue for updatedEditedChordList";

        console.log(whichFetch);
        console.log("whichFetch^");

        let newList;
        try{
            newList = await this[whichFetch]();
        }

        catch(err){
            console.log(err);
            console.log("bad chord fetch");
            return;
        }
        if (newList) {
            this.setState((state) => ({
                list: {
                    ...state.list,
                    [state.focus]: {
                        ...state.list[state.focus],
                        edit: newList,
                    },
                },
            }));
        }
    }

    async updateNavSearchChordList() {
        let newList;
        try{
            newList = await this.fetchBasicChordList();
        }

        catch(err){
            console.log(err);
            console.log("bad chord fetch");
            return;
        }
        if (newList) {
            this.setState((state) => ({
                list: {
                    ...state.list,
                    [state.focus]: {
                        ...state.list[state.focus],
                        nav: newList,
                    },

                },
            }));
        }
    }
    
    //fetch basic chord list from the database 
    // (NOT edited chords like Extensions, Alterations, Added Tones, Removed Tones). 
    // make a new function for that e.g. fetchChordExtensions, fetchChordAlterations, fetchRemovedToneChords, fetchAddedToneChords
    // or maybe if lucky can make one func called fetchEditedChords
    fetchBasicChordList = async () => {
        const state = this.state;
        const radioValue = state.radio.chord?.nav || ChordTypeRadio.defaultValue; //optional chaining is wild

        //only for chord or scale, never settings, but then again we dont need to DB call for settings atm
        const other = state.focus === "chord" ? state.scale : state.chord; 
        const objectLimiter = state.toggle[state.focus] ? other : null; 

        try {
            let response = await fapi_getChords(parseInt(state.noteSelect.chord.value), radioValue, objectLimiter);
            let newList = JSON.parse(response);

            if (Array.isArray(newList)) {
                return newList.map((obj) => ({
                    label: obj.name,
                    object: obj,
                }));
            }
        } catch (err) {
            console.error("Error fetching new list:", err);
        }

        return null;
    };

    fetchExtendedChordList = async () => {
        console.log("inside fetchExtendedChordList");
        const state = this.state;

        //alterations dont have toggle support...yet? nto having it seems like an oversight but lets see what the data looks like in app first
        //const other = state.focus === "chord" ? state.scale : state.chord; 
        //const objectLimiter = state.toggle[state.focus] ? other : null; 
    
        const scaleToLimitBy = (state.scale && state.toggle.chord) ? state.scale : null;
        try {
            // let response = await fapi_getChordExtensions(parseInt(state.noteSelect.chord.value), state.chord.category, state.chord, scaleToLimitBy);
            let response = await fapi_getChordExtensions(parseInt(state.chord.rootNote.value), state.chord.category, state.chord, scaleToLimitBy, state.chord.triadBase);
            let newList = JSON.parse(response);

            if (Array.isArray(newList)) {
                return newList.map((obj) => ({
                    label: obj.name,
                    object: obj,
                }));
            }
        } catch (err) {
            console.error("Error fetching new list:", err);
        }
        
        return null;
    };

    
    fetchAlteredChordList = async () => {
        console.log("inside fetchAlteredChordList");
        const state = this.state;

        const baseChord = state[state.focus];
        const scaleToLimitBy = (state.scale && state.toggle.chord) ? state.scale : null;

        try {
            let response;
            console.log("inside fetchAlteredChordList if (state.focus === 'chord')");
            response = await fapi_getChordAlterations(parseInt(state.noteSelect.chord.value), baseChord, scaleToLimitBy);

            let newList = JSON.parse(response);

            if (Array.isArray(newList)) {
                return newList.map((obj) => ({
                    label: obj.name,
                    object: obj,
                }));
            }
        } catch (err) {
            console.error("Error fetching new list:", err);
        }
        
        return null;
    };

    fetchAppendedChordList = async () => {
        console.log("inside fetchAppendedChordList");
        const state = this.state;

        const baseChord = state[state.focus];
        const scaleToLimitBy = (state.scale && state.toggle.chord) ? state.scale : null;

        try {
            let response;
            console.log("inside fetchAppendedChordList if (state.focus === 'chord')");
            response = await fapi_getChordAppendments(parseInt(state.noteSelect.chord.value), baseChord, scaleToLimitBy);

            let newList = JSON.parse(response);

            if (Array.isArray(newList)) {
                return newList.map((obj) => ({
                    label: obj.name,
                    object: obj,
                }));
            }
        } catch (err) {
            console.error("Error fetching new list:", err);
        }
        
        return null;
    };

    fetchDeductedChordList = async () => {
        console.log("inside fetchDeductedChordList");
        const state = this.state;

        const baseChord = state[state.focus];
        const scaleToLimitBy = (state.scale && state.toggle.chord) ? state.scale : null;

        try {
            let response;
            console.log("inside fetchDeductedChordList if (state.focus === 'chord')");
            response = await fapi_getChordDeductions(parseInt(state.noteSelect.chord.value), baseChord, scaleToLimitBy);

            let newList = JSON.parse(response);

            if (Array.isArray(newList)) {
                return newList.map((obj) => ({
                    label: obj.name,
                    object: obj,
                }));
            }
        } catch (err) {
            console.error("Error fetching new list:", err);
        }
        
        return null;
    };

    fetchRotatedChordList = async () => {
        console.log("inside fetchRotatedChordList");
        const state = this.state;

        try {
            let response;
            console.log("inside fetchRotatedChordList if (state.focus === 'chord')");
            response = await fapi_getChordRotations(parseInt(state.noteSelect.chord.value), state.chord);

            let newList = JSON.parse(response);

            if (Array.isArray(newList)) {
                return newList.map((obj) => ({
                    label: obj.name,
                    object: obj,
                }));
            }
        } catch (err) {
            console.error("Error fetching new list:", err);
        }
        
        return null;
    };

    fetchRotatedScaleList = async () => {
        console.log("inside fetchRotatedScaleList");
        const state = this.state;

        try {
            let response;
            console.log("inside fetchRotatedScaleList if (state.focus === 'scale')");
            response = await fapi_getScaleRotations(parseInt(state.noteSelect.scale.value), state.scale);

            let newList = JSON.parse(response);

            if (Array.isArray(newList)) {
                return newList.map((obj) => ({
                    label: obj.name,
                    object: obj,
                }));
            }
        } catch (err) {
            console.error("Error fetching new list:", err);
        }
        
        return null;
    };

    fetchAlteredScaleList = async () => {
        console.log("inside fetchAlteredScaleList");
        const state = this.state;

        const chordToLimitBy = state.chord && state.toggle.scale ? state.chord : null;

        try {
            let response;
            console.log("inside fetchAlteredScaleList");
            response = await fapi_getScaleAlterations(parseInt(state.noteSelect.scale.value), state.scale, chordToLimitBy);

            //let newList = JSON.parse(response);
            let newList = response;

            if (Array.isArray(newList)) {
                return newList.map((obj) => ({
                    label: obj.name,
                    object: obj,
                }));
            }
        } catch (err) {
            console.log(err);
            console.error("Error fetching new list:", err);
        }
        
        return null;
    }

    fetchScaleTextSearchList = async () => {
        console.log("inside fetchScaleTextSearchList");
        const state = this.state;

        // objectLimiter is selected chord, if any
        const objectLimiter = state.toggle.scale && state.chord ? state.chord : null;

        const userString = state.textInput[state.focus];

        try {
            let response;
            console.log("inside fetchScaleTextSearchList try");
            response = await fapi_getScaleFromUserString(userString, state.scale, objectLimiter);

            //let newList = JSON.parse(response);
            let newList = response;

            if (Array.isArray(newList)) {
                return newList.map((obj) => ({
                    label: obj.name,
                    object: obj,
                }));
            }
        } catch (err) {
            console.error("Error fetching new list:", err);
        }
        
        return null;
    }

    
    fetchAppendedScaleList = async () => {
        console.log("inside fetchAppendedScaleList");
        const state = this.state;

        const chordToLimitBy = state.chord && state.toggle.scale ? state.chord : null;

        try {
            let response;
            console.log("inside fetchAppendedScaleList try");
            response = await fapi_getScaleAppendments(parseInt(state.noteSelect.scale.value), state.scale, chordToLimitBy);

            //let newList = JSON.parse(response);
            let newList = response;

            if (Array.isArray(newList)) {
                return newList.map((obj) => ({
                    label: obj.name,
                    object: obj,
                }));
            }
        } catch (err) {
            console.error("Error fetching new list:", err);
        }
        
        return null;
    }

    fetchDeductedScaleList = async () => {
        console.log("inside fetchDeductedScaleList");
        const state = this.state;

        const chordToLimitBy = state.chord && state.toggle.scale ? state.chord : null;

        try {
            let response;
            console.log("inside fetchDeductedScaleList");
            response = await fapi_getScaleDeductions(parseInt(state.noteSelect.scale.value), state.scale, chordToLimitBy);

            //let newList = JSON.parse(response);
            let newList = response;

            if (Array.isArray(newList)) {
                return newList.map((obj) => ({
                    label: obj.name,
                    object: obj,
                }));
            }
        } catch (err) {
            console.error("Error fetching new list:", err);
        }
        
        return null;
    }

    //nav search stuff
    // this is the SCALE GROUP item click "Diatonic", "Melodic", etc
    onNavSearchScaleItemClick(e, item) {
        // click from a scale navsearch menu (list of modes)
        // should open menu for mode where items are scales to select

        console.log("shoooooooooooooooooooooooooooooooooooooooooooooooooooo");
        console.log(item);
      
        
        this.setState((state, props) => {
            if (state.scaleGroupNavSelection.id === item.object.id) {return null;}

            // nullify appropriate list so list will be empty so ListArea will render a spinning loader until data is fetched
            // TODO later maybe we should check to see if params changed so we dont needlessly get the same data as before?
            const nullifiedList = ListStateManager.getNullifiedListState(state, "in_nav_groups_but_clear_nav_modes");

            return {
                ...state,
                scaleGroupNavSelection: {
                    id: item.object.id,
                    name: item.object.name
                },
                // update view to scales in this scale group
                view: {
                    ...state.view,
                    scale: "navsearchmode"
                },
                list: nullifiedList || state.list
            };
            
        }, () => {
            this.updateNavSearchScaleList();
        });

    }

    updateStateWithNewChordSelection(item, state, extraUpdates = {}) {
        const chord = item.object;
        return {
            ...state,
            chord: chord,
            view: {
                ...state.view,
                chord: "selected"
            },
            ...extraUpdates
        };
    }

    onNavSearchChordItemClick(e, item) {
        // click chord item to select

        //convert from {label: ddd} to {item.name}
        //const newItem = {name: item.name};
        console.log("onNavSearchChordItemClick");
        console.log(item);
        
        this.setState((state, props) => {
            const chord = item.object;

            const noteSelect = {
                ...state.noteSelect,
                chord: {
                    ...state.noteSelect.chord,
                    label: chord.rootNote.name,
                    value: chord.rootNote.value.toString()
                }
            };

            const radio = {
                ...state.radio,
                chord: {
                    ...state.radio.chord,
                    nav: chord.category
                }
            };

            const currentChordTypeRadioValue = state.radio.chord.nav || ChordTypeRadio.defaultValue;
            const setChordTypeRadioToChordSelection = ChordTypeRadio.isValidValue(chord.category) && (currentChordTypeRadioValue !== chord.category);
            const setNoteSelectToChordSelection = this.state.noteSelect.chord.value !== chord.rootNote.value.toString();

            if (setChordTypeRadioToChordSelection && setNoteSelectToChordSelection) {
                console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!LYGGES");

                return this.updateStateWithNewChordSelection(item, state, {
                    noteSelect: noteSelect,
                    radio: radio
                });

            } else if (setChordTypeRadioToChordSelection) {
                console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!LYGGES?>>>>>>>>>>>>>>>");

                return this.updateStateWithNewChordSelection(item, state, {
                    radio: radio
                });

            } else if (setNoteSelectToChordSelection) {
                console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!LYGGES????????????????");

                return this.updateStateWithNewChordSelection(item, state, {
                    noteSelect: noteSelect
                });
            }
            

            // else
            console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!LYGGES-------------------------");
            return this.updateStateWithNewChordSelection(item, state);
        });
    }

    onNavSearchModeItemClick(e, item) {
        // click scale item to select
        console.log("onNavSearchModeItemClick");
        console.log(item.object);
        console.log(item.object.group_id);
        console.log(item.object.group_name);

        this.setState((state, props) => {

            const scale = item.object;

            const noteSelect = {
                ...state.noteSelect,
                scale: {
                    ...state.noteSelect.scale,
                    label: scale.rootNote.name,
                    value: scale.rootNote.value.toString()
                }
            };

            const nextRadioValue = ScaleTypeRadio.getOptionValueFromScaleLength(scale.notes.length);
            const radio = {
                ...state.radio,
                scale: {
                    ...state.radio.scale,
                    nav: nextRadioValue
                }
            };

            const currentScaleTypeRadioValue = state.radio.scale.nav || ScaleTypeRadio.defaultValue;
           
            
            const setScaleTypeRadioToScaleSelection = nextRadioValue !== currentScaleTypeRadioValue;
            const setNoteSelectToScaleSelection = state.noteSelect.scale.value !== scale.rootNote.value.toString();


            if (setScaleTypeRadioToScaleSelection && setNoteSelectToScaleSelection) {
                return this.updateStateWithNewScaleSelection(item, state, {
                    noteSelect: noteSelect,
                    radio: radio
                });
            } else if (setScaleTypeRadioToScaleSelection) {
                return this.updateStateWithNewScaleSelection(item, state, {
                    radio: radio
                });
            } else if (setNoteSelectToScaleSelection) {
                return this.updateStateWithNewScaleSelection(item, state, {
                    noteSelect: noteSelect
                });
            }
            //else
            return this.updateStateWithNewScaleSelection(item, state);
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
        //update textInput state
        this.setState((state, props) => {
            return {
                ...state,
                textInput: {
                    ...state.textInput,
                    chord: evt,
                },
                /*list: { // clear the list so the loading icon will appear // commented this out there was something weird plus what does it matter really
                    ...state.list,
                    [state.focus]: {
                        ...state.list[state.focus],
                        text: null
                    }
                }*/
            };
        }, //fetch chord list data
        async () => {
            this.updateChordTextSearchList();
        });
    }

    async updateChordTextSearchList() {
        let chord = await fapi_getChordsFromUserString(this.state.textInput.chord);
        let newList = [];

        if (chord && chord.name) {
            newList.push({
                label: chord.name,
                object: chord
            });
        }

        this.setState((state) => ({
            ...state,
            list: {
                ...state.list,
                chord: {
                    ...state.list.chord,
                    text: newList,
                }
            },
        }));
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
                list: { // clear the list so the loading icon will appear
                    ...state.list,
                    [state.focus]: {
                        ...state.list[state.focus],
                        text: null
                    }
                }
            };
        }, async () => {
            this.updateScaleTextSearchList();
        });
    }

    updateStateWithNewScaleSelection(item, state, extraUpdates = {}) {
        const scale = item.object;
        return {
            ...state,
            scale: scale,
            view: {
                ...state.view,
                scale: "selected"
                
            },
            scaleGroupNavSelection: {
                id: scale.groupID,
                name: scale.groupName
            },
            ...extraUpdates
        };
    }

    onSearchScaleItemClick(e, item) {
        // click from a scale navsearch menu (list of modes)
        // should open menu for mode where items are scales to select
        console.log("onSearchScaleItemClick");
        console.log(item);
      
        
        this.setState((state, props) => {
            
            const scale = item.object;

            const textInput = {
                //reset text input state
                ...state.textInput,
                scale: ""
            };

            const noteSelect = {
                ...state.noteSelect,
                scale: {
                    ...state.noteSelect.scale,
                    label: scale.rootNote.name,
                    value: scale.rootNote.value.toString()
                }
            };

            const nextRadioValue = ScaleTypeRadio.getOptionValueFromScaleLength(scale.notes.length);
            const radio = {
                ...state.radio,
                scale: {
                    ...state.radio.scale,
                    nav: nextRadioValue
                }
            };

            const currentScaleTypeRadioValue = state.radio.scale.nav || ScaleTypeRadio.defaultValue;
            const setScaleTypeRadioToScaleSelection = nextRadioValue !== currentScaleTypeRadioValue;
            const setNoteSelectToScaleSelection = state.noteSelect.scale.value !== scale.rootNote.value.toString();



            if (setScaleTypeRadioToScaleSelection && setNoteSelectToScaleSelection) {
                return this.updateStateWithNewScaleSelection(item, state, {
                    noteSelect: noteSelect,
                    radio: radio,
                    textInput: textInput
                });
            } else if (setScaleTypeRadioToScaleSelection) {
                return this.updateStateWithNewScaleSelection(item, state, {
                    radio: radio,
                    textInput: textInput
                });
            } else if (setNoteSelectToScaleSelection) {
                return this.updateStateWithNewScaleSelection(item, state, {
                    noteSelect: noteSelect,
                    textInput: textInput
                });
            }
            //else
            return this.updateStateWithNewScaleSelection(item, state, {textInput: textInput});



            /*return {
                ...state,
                scale: item.object,
                view: {
                    ...state.view,
                    scale: "selected"
                    
                },
                textInput: textInput
            };*/
        });

    }

    onSearchChordItemClick(e, item) {
        // click chord item to select

        //convert from {label: ddd} to {item.name}
        console.log("onSearchChordItemClick");
        console.log(item);

        //const newItem = {name: item.name};

        

        this.setState((state, props) => {
            const chord = item.object;

            const textInput= {
                //reset text input state
                ...state.textInput,
                chord: ""
            };

            const noteSelect = {
                ...state.noteSelect,
                chord: {
                    ...state.noteSelect.chord,
                    label: chord.rootNote.name,
                    value: chord.rootNote.value.toString()
                }
            };

            const radio = {
                ...state.radio,
                chord: {
                    ...state.radio.chord,
                    nav: chord.category
                }
            };

            const currentChordTypeRadioValue = state.radio.chord.nav || ChordTypeRadio.defaultValue;
            const setChordTypeRadioToChordSelection = ChordTypeRadio.isValidValue(chord.category) && (currentChordTypeRadioValue !== chord.category);
            const setNoteSelectToChordSelection = state.noteSelect.chord.value !== chord.rootNote.value.toString();

            if (setChordTypeRadioToChordSelection && setNoteSelectToChordSelection) {
                return this.updateStateWithNewChordSelection(item, state, {
                    noteSelect: noteSelect,
                    radio: radio,
                    textInput: textInput
                });

            } else if (setChordTypeRadioToChordSelection) {
                return this.updateStateWithNewChordSelection(item, state, {
                    radio: radio,
                    textInput: textInput
                });

            } else if (setNoteSelectToChordSelection) {
                return this.updateStateWithNewChordSelection(item, state, {
                    noteSelect: noteSelect,
                    textInput: textInput
                });
            }
            
            // else
            return this.updateStateWithNewChordSelection(item, state, {textInput: textInput});
        });







        /*this.setState((state, props) => {
            return {
                ...state,
                chord: item.object,
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
        });*/

    }

     /* delete this when options state is working */
     handleToggleClick(event) {
        this.setState((state, props) => {
            
            // nullify appropriate list so list will be empty so ListArea will render a spinning loader until data is fetched
            // TODO later maybe we should check to see if params changed so we dont needlessly get the same data as before?
            const nullifiedList = ListStateManager.getNullifiedListState(state);

            return {
                toggle: {
                    ...state.toggle,
                    [state.focus]: !state.toggle[state.focus]
                },
                list: nullifiedList || state.list
            };
        },
        async () => {
            if (this.state.focus === "chord") {
                this.chordToggleDataUpdate();
            } else if(this.state.focus === "scale") {
                this.scaleToggleDataUpdate();
            }
        });
    }

    async chordToggleDataUpdate() {
        switch(this.state.view.chord) {
            case "navsearch":
                this.updateNavSearchChordList();
                break;
            case "edit":
                // not yet supported
                this.updateEditedChordList();
                break;
            case "search":
                // there is no chord toggle on text search. Ignore
                break;
            default:
                 throw Error("Toggle only exists in 'navsearch' at the moment and your view.chord is wrong, it is: " + this.state.view.chord);
                break;
        }
    }

    async scaleToggleDataUpdate() {
        switch(this.state.view.scale) {
            case "navsearch":
                this.updateNavSearchScaleGroupList();
                break;
            case "navsearchmode":
                this.updateNavSearchScaleList();
                break;
            case "edit":
                this.updateEditedScaleList();
                break;
            case "search":
                this.updateScaleTextSearchList();
                break;
            case "selected":
                if (!this.state.scale) {
                    //we are then viewing textsearch contents, so update textsearch
                    this.updateScaleTextSearchList();
                }
                break;
            default:
                 throw Error("Toggle only exists in 'navsearch' at the moment and your view.scale is wrong, it is: " + this.state.view.scale);
                break;
        }
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
                focus: state.visualizerFocus, //want to snap back to whatever we were viewing. time in settings is done
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
                focus: state.visualizerFocus, //want to snap back to whatever we were viewing. time in settings is done
            };
        });
    }

    onTonewoodNavSearchItemClick(e, item) {
        this.setState((state, props) => {
            return {
                ...state,
                instrument: {
                    ...state.instrument,
                    tonewood: item.label
                },
                focus: state.visualizerFocus, //want to snap back to whatever we were viewing. time in settings is done
            };
        });
    }

    onOctaveItemClick(e, item) {
        this.setState((state, props) => {
            return {
                ...state,
                instrument: {
                    ...state.instrument,
                    pianoOctaves: Number(item.label)
                },
                focus: state.visualizerFocus, //want to snap back to whatever we were viewing. time in settings is done
            };
        });
    }

    onOrientationItemClick(e, item) {
        this.setState((state, props) => {
            return {
                ...state,
                instrument: {
                    ...state.instrument,
                    orientation: item.label
                },
                focus: state.visualizerFocus, //want to snap back to whatever we were viewing. time in settings is done
            };
        });
    }

    onListModalExitClick() {
        this.setState((state, props) => {
            return {
                ...state,
                list: {
                    ...state.list,
                    modal: {
                        ...state.list.modal,
                        [state.focus]: false
                    }
                }
            }
        });
    }

    openListModal() {
        this.setState((state, props) => {
            return {
                ...state,
                list: {
                    ...state.list,
                    modal: {
                        ...state.list.modal,
                        [state.focus]: true
                    }
                }
            }
        });
    }

    // when user presses enter in tuning text input, update tuning if it's valid
    onTextEnterKeyUp(e, component) {
        if (e.keyCode === 13) {
            //enter
            
        
            //update the tuning in state
            this.setState((state, props) => {

                // but if it's not valid, set the state to the same
                if (!fapi_isValidTextTuning(component.value, state.instrument.name)) {
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
                    focus: state.visualizerFocus
                };
            });
        }  
    }
 



    render() {

        let contents;

        console.log("this.state");
        console.log(this.state);

        let toggle;
        let search; 
        let viewSwitch;
        let radio;
        let selection;
        let visualizer;
        let footer;

        let landscapeClassName = "options ";
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
                        chordList: this.state.list.chord.text,
                    },
                    nav: {
                        chordList: this.state.list.chord.nav,
                        onItemClick: this.onNavSearchChordItemClick,
                        gets: true, //just for now using this to signify that the user has a list. later it will be something connected to a database call
                    },
                    noteSelect: {
                        handleClickOutside: this.handleCustomClickOutsideNoteNav,
                        onUpdate: this.onNoteSelectionUpdate,
                        handleCustomClick: this.handleCustomNoteNavSelectClick,
                        note: this.state.noteSelect.chord,
                        customListIsOpen: this.state.noteSelect.chord.customListIsOpen,
                    },
                    listModal: {
                        on: this.state.list.modal.chord,
                        open: this.openListModal,
                        onExitClick: this.onListModalExitClick, //a function that sets this listModal off when they press the X on the modal
                    },
                    edit: {
                        chordList: this.state.list.chord.edit
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

                footer = {
                    onUpdate: this.onFooterUpdate,
                    selectedValue: this.state.focus,
                };

                search.limitByOther = toggle.value === true ? selection.secondary : null;
                search.gets = (search.text.input !== null && search.text.input !== "") && search.text.get(search.text.input, search.limitByOther);

                // chord textSearchView doesnt care about the toggle because at least atm it seems more an incumberance on the user
                // rationale: if they are resorting to typing a chord symbol in, isn't it that they know what chord they want? 
                // why would they enter say Em7 if not to select an Em7 chord regardless of matching the selected scale?
                // this situation would be different if we were actually searching the DB for partial text matches, when
                // what we are actually doing is constructing a chord from chord symbol being typed, so there's either no result or there's one result

                //2nd check is because textsearch view is generated when we are in selected view but have no selected chord
                const isTextSearchView = this.state.view.chord === "search" || (this.state.view.chord === "selected" && !this.state.chord); 
                toggle.isRequired = selection.secondary && !isTextSearchView;

                landscapeClassName = getLandScapeClassName({
                    base: "options",
                    focus: this.state.focus,
                    view: this.state.view,
                    textSearchGets: search.gets,
                    selection: selection,
                    radio: this.state.radio,
                    navSearchGets: search.nav.gets,
                    instrument: this.state.instrument
                });

                //getToggle test
                /* const FUNCTIONAL_TOGGLE = ChordScaleController.getToggle(this.state.view[this.state.focus],selection,this.state.focus,this.state.radio, toggle.onClick,toggle.value);
                console.log("get a toggle?");
                console.log(FUNCTIONAL_TOGGLE);*/
                     
                //add visual for fretboard,piano
                let notes = [];
                if (this.state.chord && Array.isArray(this.state.chord.notes)) {
                    notes = this.state.chord.notes;
                }

                visualizer = {
                    selectedNotes: notes.map((note) => note.label), //str like "E"
                    instrument: this.state.instrument, //obj with .name (str) and tuning (str like "EADGBE" (guitar only)) and pianoOctaves (int (piano only)) quick+hacky I know
                };
                contents = <ChordScaleController footer={footer} visualizer={visualizer} toggle={toggle} search={search} view={this.state.view.chord} viewSwitch={viewSwitch} radio={radio} radioObj={this.state.radio} selection={selection} focus={this.state.focus} type="chord" />
                break;
            case "scale":

            console.log("SPA RERENDER");
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
                        scaleList: this.state.list.scale.text,
                    },
                    nav: {
                        //scaleList: this.state.list.scale.nav, //why doesnt scale need this but chord does
                        onScaleItemClick: this.onNavSearchScaleItemClick,
                        onModeItemClick: this.onNavSearchModeItemClick,
                        mode: this.state.view.scaleNavSearchMode,
                        gets: true, //just for now using this to signify that the user has a list. later it will be something connected to a database call
                        scaleList: this.state.list.scale.navModes,
                        scaleGroupList: this.state.list.scale.navGroups,
                    },
                    noteSelect: {
                        handleClickOutside: this.handleCustomClickOutsideNoteNav,
                        onUpdate: this.onNoteSelectionUpdate,
                        handleCustomClick: this.handleCustomNoteNavSelectClick,
                        note: this.state.noteSelect.scale,
                        customListIsOpen: this.state.noteSelect.scale.customListIsOpen,
                    },
                    listModal: {
                        on: this.state.list.modal.scale,
                        open: this.openListModal,
                        onExitClick: this.onListModalExitClick, //a function that sets this listModal off when they press the X on the modal
                    },
                    edit: {
                        scaleList: this.state.list.scale.edit
                    }
                };
                viewSwitch = {
                    toEdit: this.toScaleEditView,
                    toNav: this.toScaleNavSearchView,
                    toModeNav: this.toModeNavSearchView,
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
                    get: fapi_getScaleGroups,
                };

                footer = {
                    onUpdate: this.onFooterUpdate,
                    selectedValue: this.state.focus,
                };

                search.limitByOther = toggle.value === true ? selection.secondary : null;
                search.gets = (search.text.input !== null && search.text.input !== "") && search.text.get(search.text.input, search.limitByOther);
                toggle.isRequired = selection.secondary;

                landscapeClassName = getLandScapeClassName({
                    base: "options",
                    focus: this.state.focus,
                    view: this.state.view,
                    textSearchGets: search.gets,
                    selection: selection,
                    radio: this.state.radio,
                    navSearchGets: search.nav.gets,
                    instrument: this.state.instrument
                });

                //add visual for fretboard,piano
                let notess = [];
                if (this.state.scale && Array.isArray(this.state.scale.notes)) {
                    notess = this.state.scale.notes;
                }
                visualizer = {
                    selectedNotes: notess.map((note) => note.label), //str like "E", 
                    instrument: this.state.instrument, //obj with .name (str) and tuning (str like "EADGBE" (guitar only)) and pianoOctaves (int (piano only)) quick+hacky I know
                };

                contents = <ChordScaleController 
                    footer={footer}
                    visualizer={visualizer}
                    modes={modes}
                    view={this.state.view.scale}
                    toggle={toggle}
                    search={search}
                    viewSwitch={viewSwitch}
                    radio={radio}
                    radioObj={this.state.radio} //should switch to using this because chordScaleController looks at both chord/scale 
                    selection={selection}
                    focus={this.state.focus}
                    scaleGroupNavSelection={this.state.scaleGroupNavSelection}
                    type="scale" 
                />;
                
                break;
            case "settings":
                search = {
                    text: {
                        input: this.state.textInput.settings,
                        onEnterKeyUp: this.onTextEnterKeyUp,
                    },
                    nav: {
                        onInstrumentItemClick: this.onInstrumentNavSearchItemClick,
                        onTonewoodItemClick: this.onTonewoodNavSearchItemClick,
                        onOrientationItemClick: this.onOrientationItemClick,
                        onTuningItemClick: this.onTuningNavSearchItemClick,
                        selectTextTuning: this.selectTextTuningButtonClick,
                        onOctaveItemClick: this.onOctaveItemClick,
                    },
                    listModal: {
                        on: this.state.list.modal.settings,
                        open: this.openListModal,
                        onExitClick: this.onListModalExitClick, //a function that sets this listModal off when they press the X on the modal
                    }
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
                    getAll: fapi_getInstruments,
                    getAllTonewood: fapi_getAllTonewood,
                    getOrientations: fapi_getOrientations,
                    getAllPianoOctaves: fapi_getAllPianoOctaves,
                };

                footer = {
                    onUpdate: this.onFooterUpdate,
                    selectedValue: this.state.focus,
                };


                landscapeClassName = getLandScapeClassName({
                    base: "options",
                    focus: this.state.focus,
                    view: this.state.view,
                    list: true, //always a list in settings
                    toggle: false, //no toggle in settings
                    radio: this.state.radio,
                    instrument: this.state.instrument
                });


                //add visual for fretboard,piano
                let notesss = [];
                if (this.state[this.state.visualizerFocus] && Array.isArray(this.state[this.state.visualizerFocus].notes)) {
                    notesss = this.state[this.state.visualizerFocus].notes;
                }
                visualizer = {
                    selectedNotes: notesss.map((note) => note.label), //str like "E"
                    instrument: this.state.instrument, //obj with .name (str) and tuning (str like "EADGBE" (guitar only)) and pianoOctaves (int (piano only)) quick+hacky I know
                };

                contents = <InstrumentController footer={footer} visualizer={visualizer} instrument={instruments} search={search} tuning={tuning} radioValue={this.state.radio.settings} onRadioUpdate={this.onRadioUpdate} type="settings" toNavView={this.toSettingsNavView} view={this.state.view.settings} />
                break;
            case null:
                footer = {
                    onUpdate: this.onFooterUpdate,
                    selectedValue: this.state.focus,
                };
                contents = <EmptyController footer={footer} />;
                break;
            default:
                throw new Error("state.focus not a valid option");
        }
        return (
            <div className={landscapeClassName}>
                    {contents}
            </div>
        );
  }
}
  
export default SPA;


