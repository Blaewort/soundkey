import {Note } from 'chord-expressions';

//handle all api requests for the applicatiom

// returns a promise
async function postData(url = '', data = {}) {
    // Default options are marked with *
    return fetch(url, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json'
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
  }

// below is the data the UI knows how to read, not necessarily the format in db
// although this might be limited to the simple addition of a label attribute for item display in the UI

function fapi_getModes(root, type = "Heptatonic", chordToLimitBy) {
    type = type === null ? "Heptatonic": type;

    //noteValue would be 0-12 and we'd grab all chords with root note 0-12
    postData('http://localhost:5000/chordAPI/getModes/',
    {
        root: Note.fromValue(root).name,
        type: type,
        data: chordToLimitBy
    }
    ).then(response => {return response.json});

}

//let list = this.props.getScalesFromModeName(this.props.noteSelect.value, this.props.mode); blark
async function fapi_getScalesFromModeName(noteValue, mode = null, chordToLimitBy = null) {
    postData('http://localhost:5000/chordAPI/getScales/',
    {
        root: Note.fromValue(noteValue).name,
        mode: mode,
        data: chordToLimitBy
    }
    ).then(response => {return response.json});
}

async function getPentatonicModes(noteValue, chordToLimitBy = null) {
    return await fapi_getScalesFromModeName(noteValue,"pentatonic", chordToLimitBy);
}
async function getHexatonicModes(noteValue, chordToLimitBy = null) {
    return await fapi_getScalesFromModeName(noteValue,"hexatonic", chordToLimitBy);
}

async function getHeptatonicModes(noteValue, chordToLimitBy = null) {
    return await fapi_getScalesFromModeName(noteValue,"heptatonic", chordToLimitBy);
}
async function getOctatonicModes(noteValue, chordToLimitBy = null) {
    return await fapi_getScalesFromModeName(noteValue,"octatonic", chordToLimitBy);
}

function getDodecatonicModes(noteValue, chordToLimitBy = null) {
    return await fapi_getScalesFromModeName(noteValue,"dodecatonic", chordToLimitBy);
}

function fapi_getChords(noteValue, category = "Triads", scaleToLimitBy) {
    category = category === null ? "Triads": category;

    //noteValue would be 0-12 and we'd grab all chords with root note 0-12

    switch(category) {
        case "Triads":
            return getTriads(noteValue, scaleToLimitBy);
            break;
        case "Seventh Chords":
            return getSeventhChords(noteValue, scaleToLimitBy);
            break;
        case "Ninth Chords":
            return getNinthChords(noteValue, scaleToLimitBy);
            break;
        case "Eleventh Chords":
            return getEleventhChords(noteValue, scaleToLimitBy);
            break;
        case "Thirteenth Chords":
            return getThirteenthChords(noteValue, scaleToLimitBy);
            break;
        case "Sixth Chords":
            return getSixthChords(noteValue, scaleToLimitBy);
            break;
        default:
            throw new TypeError("bad chord type");
    }
}

function getTriads(rootValue, scaleToLimitBy) {
    rootValue = ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"][rootValue];

    const triads = [
        {
            label: "Major",
            symbol: rootValue,
            name: rootValue + " Major"
        },
        {
            label: "Minor",
            symbol: rootValue + "m",
            name: rootValue + " Minor"
        },
        {
            label: "Diminished",
            symbol: rootValue + "dim",
            name: rootValue + " Diminished"
        },
        {
            label: "Augmented",
            symbol: rootValue + "+",
            name: rootValue + " Augemented"
        },
        {
            label: "Suspended 2",
            symbol: rootValue + "sus2",
            name: rootValue + " Suspended Two"
        },
        {
            label: "Suspended 4",
            symbol: rootValue + "sus4",
            name: rootValue + " Suspended Four"
        },
    ];

    return triads;

}

function getSixthChords(rootValue, scaleToLimitBy) {
    rootValue = ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"][rootValue];

    const triads = [
        {
            label: "Six",
            symbol: rootValue + "6",
            name: rootValue + " Six"
        },
        {
            label: "Minor Six",
            symbol: rootValue + "m6",
            name: rootValue + " Minor Six"
        },
        {
            label: "Six Suspended Two",
            symbol: rootValue + "6sus2",
            name: rootValue + " Six Suspended Two"
        },
        {
            label: "Six Suspended Four",
            symbol: rootValue + "6sus4",
            name: rootValue + " Six Suspended Four"
        },
        {
            label: "Augmented Six",
            symbol: rootValue + "aug6",
            name: rootValue + " Augmented Six"
        },
    ];

    return triads;

}

function getSeventhChords(rootValue, scaleToLimitBy) {
    rootValue = ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"][rootValue];

    const triads = [
        {
            label: "Seven",
            symbol: rootValue + "7",
            name: rootValue + " Seven"
        },
        {
            label: "Minor Seven",
            symbol: rootValue + "m7",
            name: rootValue + " Minor Seven"
        },
        {
            label: "Diminished Seven",
            symbol: rootValue + "dim7",
            name: rootValue + " Diminished Seven"
        },
        {
            label: "Half-Diminished Seven",
            symbol: rootValue + "ø7",
            name: rootValue + " Half-Diminished Seven"
        },
        {
            label: "Diminished Major Seven",
            symbol: rootValue + "dim-maj7",
            name: rootValue + " Diminished Major Seven"
        },
        {
            label: "Seven Suspended Two",
            symbol: rootValue + "7sus2",
            name: rootValue + " Seven Suspended Two"
        },
        {
            label: "Seven Suspended Four",
            symbol: rootValue + "7sus4",
            name: rootValue + " Seven Suspended Four"
        },
        {
            label: "Augmented Seven",
            symbol: rootValue + "aug7",
            name: rootValue + " Augmented Seven"
        },
    ];

    return triads;

}

function getNinthChords(rootValue, scaleToLimitBy) {
    rootValue = ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"][rootValue];

    const triads = [
        {
            label: "Ninth",
            symbol: rootValue + "9",
            name: rootValue + " Nine"
        },
        {
            label: "Minor Nine",
            symbol: rootValue + "m9",
            name: rootValue + " Minor Nine"
        },
        {
            label: "Diminished Nine",
            symbol: rootValue + "dim9",
            name: rootValue + " Diminished Nine"
        },
        {
            label: "Half-Diminished Nine",
            symbol: rootValue + "ø9",
            name: rootValue + " Half-Diminished Nine"
        },
        {
            label: "Diminished Major Nine",
            symbol: rootValue + "dim-maj9",
            name: rootValue + " Diminished Major Nine"
        },
        {
            label: "Nine Suspended Two",
            symbol: rootValue + "9sus2",
            name: rootValue + " Nine Suspended Two"
        },
        {
            label: "Nine Suspended Four",
            symbol: rootValue + "9sus4",
            name: rootValue + " Nine Suspended Four"
        },
        {
            label: "Augmented Nine",
            symbol: rootValue + "aug9",
            name: rootValue + " Augmented Nine"
        },
    ];

    return triads;

}

function getEleventhChords(rootValue, scaleToLimitBy) {
    rootValue = ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"][rootValue];

    const triads = [
        {
            label: "Eleven",
            symbol: rootValue + "11",
            name: rootValue + " Eleven"
        },
        {
            label: "Minor Eleven",
            symbol: rootValue + "m11",
            name: rootValue + " Minor Eleven"
        },
        {
            label: "Diminished Eleven",
            symbol: rootValue + "dim11",
            name: rootValue + " Diminished Eleven"
        },
        {
            label: "Half-Diminished Eleven",
            symbol: rootValue + "ø11",
            name: rootValue + " Half-Diminished Eleven"
        },
        {
            label: "Diminished Major Eleven",
            symbol: rootValue + "dim-maj11",
            name: rootValue + " Diminished Major Eleven"
        },
        {
            label: "Eleven Suspended Two",
            symbol: rootValue + "11sus2",
            name: rootValue + " Eleven Suspended Two"
        },
        {
            label: "Eleven Suspended Four",
            symbol: rootValue + "11sus4",
            name: rootValue + " Eleven Suspended Four"
        },
        {
            label: "Augmented Eleven",
            symbol: rootValue + "aug11",
            name: rootValue + " Augmented Eleven"
        },
    ];

    return triads;

}

function getThirteenthChords(rootValue, scaleToLimitBy) {
    rootValue = ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"][rootValue];

    const triads = [
        {
            label: "Thirteen",
            symbol: rootValue + "13",
            name: rootValue + " Thirteen"
        },
        {
            label: "Minor Thirteen",
            symbol: rootValue + "m13",
            name: rootValue + " Minor Thirteen"
        },
        {
            label: "Diminished Thirteen",
            symbol: rootValue + "dim13",
            name: rootValue + " Diminished Thirteen"
        },
        {
            label: "Half-Diminished Thirteen",
            symbol: rootValue + "ø13",
            name: rootValue + " Half-Diminished Thirteen"
        },
        {
            label: "Diminished Major Thirteen",
            symbol: rootValue + "dim-maj13",
            name: rootValue + " Diminished Major Thirteen"
        },
        {
            label: "Thirteen Suspended Two",
            symbol: rootValue + "13sus2",
            name: rootValue + " Thirteen Suspended Two"
        },
        {
            label: "Thirteen Suspended Four",
            symbol: rootValue + "13sus4",
            name: rootValue + " Thirteen Suspended Four"
        },
        {
            label: "Augmented Thirteen",
            symbol: rootValue + "aug13",
            name: rootValue + " Augmented Thirteen"
        },
    ];

    return triads;

}

function fapi_getChordNearbys(chord, type, scaleToLimitBy) {
    type = type === null ? "Extensions": type;


    switch(type) {
        case "Extensions":
            return getExtensionsForChord(chord, scaleToLimitBy);
            break;
        case "Alterations":
            return getAlteredChordsForChord(chord, scaleToLimitBy);
            break;
        case "Added Tones":
            return getAddedToneChordsForChord(chord, scaleToLimitBy);
            break;
        case "Removed Tones":
            return getRemoveToneChordsForChord(chord, scaleToLimitBy);
            break;
        default:
            throw new TypeError("wrong type");
    }

}

function fapi_getScaleNearbys(scale, type, chordToLimitBy) {
    type = type === null ? "Alterations": type;


    switch(type) {
        case "Alterations":
            return getAlteredScalesForScale(scale, chordToLimitBy);
            break;
        case "Added Tones":
            return getAddedToneScalesForScales(scale, chordToLimitBy);
            break;
        case "Removed Tones":
            return getRemoveToneScaleForScale(scale, chordToLimitBy);
            break;
        default:
            throw new TypeError("wrong type");
    }

}


function getExtensionsForChord(chord, scaleToLimitBy) {
    // this function would give us the next logical piece from chord
    //E7 would return E9, Cmaj9 would return Cmaj11 I guess it's just one item in the list


    
    return [{label: "-An Extension-",
    symbol:  "B13",
    name: "B Thirteen"},{label: "-An Extension 2-",
    symbol:  "B13",
    name: "B Thirteen"} ,{label: "-An Extension 3-",
    symbol:  "B13",
    name: "B Thirteen"},{label: "-An Extension 4-",
    symbol:  "B13",
    name: "B Thirteen"} ];

}

function getAlteredChordsForChord(chord, scaleToLimitBy) {
    // this would give us chords where foundChord.noteCount === chord.noteCount but only (chord.noteCount-1) amount of notes match between the two chords
    return [{label: "-An Alteration-",
    symbol:  "B13",
    name: "B Thirteen"}];
}

function getAddedToneChordsForChord(chord, scaleToLimitBy) {
    // this would give us chords where foundChord.noteCount === (chord.noteCount + 1) and all notes in chord are found in foundChord
    return [{label: "-A + Tone chord-",
    symbol:  "B13",
    name: "B Thirteen"}];

}

function getRemoveToneChordsForChord(chord, scaleToLimitBy) {
    // this would give us chords where foundChord.noteCount === (chord.noteCount - 1) and all notes in foundChord are found in chord
    return [{label: "-A - Tone Chord-",
    symbol:  "B13",
    name: "B Thirteen"}];

}


function getAlteredScalesForScale(scale, chordToLimitBy) {
    // this would give us scaless where foundScale.noteCount === scale.noteCount but only (scale.noteCount-1) amount of notes match between the two scales
    return [{label: "-An Alteration-",
    name: "B Lydian"}];
}

function getAddedToneScalesForScales(scale, chordToLimitBy) {
    // this would give usscales where foundScale.noteCount === (scale.noteCount + 1) and all notes in scale are found in foundSCale
    return [{label: "-A + Tone-",
    name: "B Lydian"}];

}

function getRemoveToneScaleForScale(scale, chordToLimitBy) {
    // this would give us scales where foundScale.noteCount === (scale.noteCount - 1) and all notes in foundScale are found in scale
    return [{label: "-A - Tone-",
    name: "B Lydian"}];

}


function fapi_getTunings(instrument, stringCount) {

    switch(instrument) {
        case "Guitar":
            return getGuitarTunings(stringCount);
            break;
        default:
            throw new TypeError("wrong instrument for a tuning you figure");
    }
}

function fapi_getInstruments() {
    return [
        {   
            label: "Guitar"
        }, 
        {
            label: "Piano"
        }
    ];
}

function getGuitarTunings(stringCount) {
    stringCount = stringCount === null ? 6 : stringCount;

    return [
        {   
            label: "EADGBE"
        }, 
        {
            label: "DADGAD"
        }     
    ];
}

function fapi_isValidTextTuning(str, instrument) {

    //not a real solution
    return !str ? false : str.length >= 10;

}

function fapi_getChordsFromUserString(str, scaleToLimitBy) {
    if (!str || str === "") {return null;} 

    //not a real solution
    return [
        {
            label: "A Text-Searched Chord 1",
            name: "B Seven"
        },
        {
            label: "A Text-Searched Chord 2",
            name: "B Seven"
        },
        {
            label: "A Text-Searched Chord 3",
            name: "B Seven"
        },
        {
            label: "A Text-Searched Chord 4",
            name: "B Seven"
        },
    ];

}

function fapi_getScalesFromUserString(str, scaleToLimitBy) {
    if (!str || str === "") {return null;} 

    //not a real solution
    return [
        {
            label: "A Text-Searched Scale 1",
            name: "B Locrian"
        },
        {
            label: "A Text-Searched Scale 2",
            name: "B Locrian"
        },
        {
            label: "A Text-Searched Scale 3",
            name: "B Locrian"
        },
        {
            label: "A Text-Searched Scale 4",
            name: "B Locrian"
        },
    ];

}


export { 
    fetchChord, 
    fapi_getModes, 
    fapi_getScalesFromModeName, 
    fapi_getChords, 
    fapi_getChordNearbys,
    fapi_getScaleNearbys,
    fapi_getTunings,
    fapi_getInstruments,
    fapi_isValidTextTuning,
    fapi_getChordsFromUserString,
    fapi_getScalesFromUserString
}