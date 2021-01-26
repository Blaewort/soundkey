import React, {Component} from 'react';
import './styles.css'

import Header from './header/index';
import Footer from './footer/index';
import SelectedObject from './selectedObject/index';
import NoteNav from './noteNav/index';
import ListArea from './listArea/index';
import ChordTypeRadio from './radio/ChordType';
import ScaleTypeRadio from './radio/ScaleType';

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
                // The toggle is visible when the focus is scale or chord and the other is not null
                scale: true,
                chord: true,
            },
            radio: {
                settings: "tuning" //this would just default on mounting
            },
            focus: "chord", // "chord", "scale", "settings", null
            view: {
                scale: "selected", // "selected", "search", "Navearch"
                chord: "selected", // navsearch is the list of modes that link to [navmode] 
                settings: "navsearch",
            }
        }

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



    render() {
        let pane;

        switch(this.state.focus) {
            case "chord":
                pane = <ChordScalePane toEditView={this.toChordEditView} toNavView={this.toChordNavSearchView} toSearchView={this.toChordSearchView} view={this.state.view.chord} selection={this.state.chord} onDeselect={this.onChordDeselect} type="chord" />
                break;
            case "scale":
                pane = <ChordScalePane toEditView={this.toScaleEditView} toNavView={this.toScaleNavSearchView} toSearchView={this.toScaleSearchView} view={this.state.view.scale} selection={this.state.scale} onDeselect={this.onScaleDeselect} type="scale" />
                break;
            case "settings":
                pane = <SettingsPane type="settings" view={this.state.view.settings} />
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
                    header = <Header engaged={true} userText={true} placeholder={placeholder} leftIcon={"stream"} rightIcon={"search"}/>;
                } else {
                    header = <Header engaged={true} userText={false} placeholder={placeholder} leftIconClick={this.props.toNavView} leftIcon={"stream"} onRightIconClick={this.props.toSearchView} rightIcon={"search"}/>;
                    selectedObject = <SelectedObject onEditRequest={this.props.toEditView} onDeselect={this.props.onDeselect} label={this.props.selection.name}/>;
                }
                break;
            case "search":
                header = <Header engaged={true} userText={true} placeholder={placeholder} leftIconClick={this.props.toNavView} leftIcon={"stream"} rightIcon={"search"}/>;
                break;
            case "navsearch":
                header = <Header engaged={true} userText={false} placeholder={placeholder} onRightIconClick={this.props.toSearchView} rightIcon={"search"}/>;
                noteNav = <NoteNav/ >;
                listArea = <ListArea />;
                radio = this.props.type === "chord" ? <ChordTypeRadio /> : <ScaleTypeRadio />
                break;
            case "navsearchmode":
                if (this.props.type === "chord") {throw new TypeError("props.type 'chord' has no 'navsearchmode'");}
                break;
            case "edit":
                if (!this.props.selection) {throw new TypeError(this.props.view + " requires this.props.selection (" + this.props.type + ")");}
                header = <>TODO: EDIT</>
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

        const header = <Header engaged={true} userText={visibleText} rightIcon={rightIcon} placeholder="" />;

        return <>
            {header}
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