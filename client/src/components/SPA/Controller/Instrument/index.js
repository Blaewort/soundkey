import React, {Component} from 'react';

import NavSearchHeader from '../../header/navsearch';
import TextEnterHeader from '../../header/textEnter';
import Footer from '../../footer/index';
import ListArea from '../../listArea/index';
import VisualInstrument from '../../../../scenes/visualizer/index';
import SettingsRadio from '../../radio/Settings';

class InstrumentController extends Component{

    constructor(props) {
        super(props);

        this.getNavSearchContents = this.getNavSearchContents.bind(this);
        this.getTuningTextEnterContents = this.getTuningTextEnterContents.bind(this);
    }

    getNavSearchContents() {
        let header;
        let listArea;
        let visualInstrument;
        let radio;
        let footer;

        const tuning = (this.props.radioValue === "Tunings" || !this.props.radioValue) ? true : false;
        header = <NavSearchHeader toSearchView={this.props.tuning.toTextInputView} tuning={tuning} focus={"settings"}/>;
        visualInstrument = <VisualInstrument instrument={this.props.visualizer.instrument} selectedNotes={this.props.visualizer.selectedNotes}/>;
        radio = <SettingsRadio instrument={this.props.instrument.name} selectedValue={this.props.radioValue} onUpdate={this.props.onRadioUpdate}/>;

        if (this.props.radioValue === "Tunings" || !this.props.radioValue) {

            const itemClick = this.props.search.nav.onTuningItemClick;
            const list = this.props.tuning.getTunings(this.props.visualizer.instrument.name);
            listArea = <ListArea modal={this.props.search.listModal} handleItemClick={itemClick} title={"Tunings"} list={list}></ListArea>;

        } else if (this.props.radioValue === "Instruments") { // "Instruments"

            const itemClick = this.props.search.nav.onInstrumentItemClick;
            const list = this.props.instrument.getAll();
            listArea = <ListArea modal={this.props.search.listModal} handleItemClick={itemClick} title={"Instruments"} list={list}></ListArea>;

        } else if (this.props.radioValue === "Tonewood") {
            const itemClick = this.props.search.nav.onTonewoodItemClick;
            const list = this.props.instrument.getAllTonewood();
            listArea = <ListArea modal={this.props.search.listModal} handleItemClick={itemClick} title={"Tonewood"} list={list}></ListArea>;
        }

        else if (this.props.radioValue === "Orientation") {
            const itemClick = this.props.search.nav.onOrientationItemClick;
            const list = this.props.instrument.getOrientations();
            listArea = <ListArea modal={this.props.search.listModal} handleItemClick={itemClick} title={"Orientation"} list={list}></ListArea>;
        }

        footer = <Footer onUpdate={this.props.footer.onUpdate} selectedValue={this.props.footer.selectedValue} />;


        return <>
            <div class="top-controls">
                {header}
                {listArea}
            </div>
            {visualInstrument}
            <div class="bottom-controls">
                {radio}
                {footer}
            </div>
        </>
    }

    getTuningTextEnterContents() {
        let header;
        let visualInstrument;
        let radio;
        let footer;

        const isValidTextTuning = this.props.tuning.isValidTextTuning(this.props.tuning.textInput);
        const rightIconClick = isValidTextTuning ? this.props.search.nav.selectTextTuning : null;
        const textInput = this.props.search.text.input;       
        const onKeyUp = this.props.search.text.onEnterKeyUp;
        const onChange = this.props.tuning.onTextChange;
        const toNavView = this.props.toNavView;
        const placeholder = this.props.instrument.name === "Guitar" ? "EADGBE etc" : "EADG etc";
        header = <TextEnterHeader textValue={textInput} onTextEnterKeyUp={onKeyUp} rightIconClick={rightIconClick} isValidText={isValidTextTuning} onChange={onChange} placeholder={placeholder} toNavView={toNavView} />;
        
        radio = <SettingsRadio instrument={this.props.instrument.name} selectedValue={this.props.radioValue} onUpdate={this.props.onRadioUpdate}/>;
        visualInstrument = <VisualInstrument instrument={this.props.visualizer.instrument} selectedNotes={this.props.visualizer.selectedNotes}/>;
        footer = <Footer onUpdate={this.props.footer.onUpdate} selectedValue={this.props.footer.selectedValue} />;

        return <>
            <div class="top-controls">
                {header}
            </div>
            {visualInstrument}
            <div class="bottom-controls">
                {radio}
                {footer}
            </div>
        </>
    }

    render() {
        let contents;
        
        //so switches from "Tunings" with "textEnter" to "Instruments" will still act as "navsearch"
        if (this.props.view === "navsearch" || (this.props.view === "textEnter" && !radioIsSetToTunings(this.props.radioValue, this.props.visualizer.instrument))) {
            contents = this.getNavSearchContents()
        } else { contents = this.getTuningTextEnterContents() } /* view="textEnter" and radioValue="Tunings"*/

        return <>
            {contents}
        </>
    }
}

InstrumentController.toggleIsVisible = function toggleIsVisible() {
    // we never have a toggle in settings
    return false; 
}

InstrumentController.notenavIsVisible = function notenavIsVisible() {
    // never a notenav in settings
    return false; 
}

InstrumentController.radioIsVisible = function radioIsVisible() {
    // always a radio in settings
    return true;
}

InstrumentController.listIsVisible = function listIsVisible(view, radio, instrument) {

    switch(view) {
        case "textEnter":
            return !radioIsSetToTunings(radio, instrument);
            // since we dont currently update textEnter back to Navsearch, there is a situation where view is 'textEnter' but radio isnt on tunings, aka the only option with textEnter
        case "navsearch":
            return true;
            // navsearch in settings always has a list and is the only other currently available view.settings option
        default:
            return false;
    }
}

function radioIsSetToTunings(radio, instrument) {
    if (radio === "Tunings") {return true;}
    if (radio === null && instrument.name === "Guitar") {return true;}
    /* when we add support for bass, need to duplicate that last check and change instrument.name to "Bass Guitar" */
    return false;
}



export default InstrumentController;