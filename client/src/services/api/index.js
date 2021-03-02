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

function fapi_getChords(noteValue, category = "Triads", scaleToLimitBy, maxNotes = 12) {
    category = category === null ? "Triads": category;
    postData('http://localhost:5000/chordAPI/getChords/',
        {
            obj: scaleToLimitBy,
            category: category,
            root: Note.fromValue(noteValue).name,
            maxNotes: maxNotes
        }
    ).then(response => {return response.json});
}

function getTriads(hoteValue, scaleToLimitBy, maxNotes = 12) {
    return fapi_getChords(noteValue, "Triads", scaleToLimitBy, maxNotes = 12);
}

function getSixthChords(rootValue, scaleToLimitBy) {
    return fapi_getChords(noteValue, "Six", scaleToLimitBy, maxNotes = 12);
}

function getSeventhChords(rootValue, scaleToLimitBy) {
    return fapi_getChords(noteValue, "Seven", scaleToLimitBy, maxNotes = 12);
}

function getNinthChords(rootValue, scaleToLimitBy) {
    return fapi_getChords(noteValue, "Nine", scaleToLimitBy, maxNotes = 12);
}

function getEleventhChords(rootValue, scaleToLimitBy) {
    return fapi_getChords(noteValue, "Eleven", scaleToLimitBy, maxNotes = 12);
}

function getThirteenthChords(rootValue, scaleToLimitBy) {
    return fapi_getChords(noteValue, "Thirteen", scaleToLimitBy, maxNotes = 12);
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