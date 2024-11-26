import { Note } from 'chord-expressions';

const urlRoot = "http://localhost:5000/api";

//handle all api requests for the applicatiom

// returns a promise

async function postData(url = '', data = {}) {
    // Default options are marked with *
    console.log("fetch it");
    return await fetch(url, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      //mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json'
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(data) // body data type must match "Content-Type" header
    }).then(handleErrors);
  }

  function handleErrors(response) {
    if (!response.ok) {
        console.log("POST DATA ERROR: ", response.statusText);
        throw Error(response.statusText);
    }
    return response;
}

// below is the data the UI knows how to read, not necessarily the format in db
// although this might be limited to the simple addition of a label attribute for item display in the UI


async function fapi_getModes(root, type = "Heptatonic", chordToLimitBy) {
    console.log("root");
    console.log(root);
    type = type === null ? "Heptatonic": type;

    //noteValue would be 0-12 and we'd grab all chords with root note 0-12
    await postData(urlRoot + '/getModes/',
    {
        root: Note.fromValue(root).name,
        type: type,
        data: chordToLimitBy
    }
    ).then(response => {
        return response.json
    }).catch((error) => {
        console.error('Error:', error);
      });;

}


//let list = this.props.getScalesFromModeName(this.props.noteSelect.value, this.props.mode); blark
async function fapi_getScalesFromModeName(noteValue, mode = null, chordToLimitBy = null) {
    postData(urlRoot +'/getScales/',
        {
            root: Note.fromValue(noteValue).name,
            mode: mode,
            data: chordToLimitBy
        }
    )
    .then(response => {return response.json});
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

async function getDodecatonicModes(noteValue, chordToLimitBy = null) {
    return await fapi_getScalesFromModeName(noteValue,"dodecatonic", chordToLimitBy);
}
 
function fapi_getChords(noteValue,category = null, scaleToLimitBy, searchString = "") {
    noteValue = typeof noteValue === "string" ? parseInt(noteValue) : noteValue;

    console.log("made it to fapi_getChords")

    // if its a chord/scale object with .notes prop then convert it to an array of note label strings (["A#, "B", C#, etc])
    if(scaleToLimitBy?.notes){
        scaleToLimitBy = scaleToLimitBy.notes.map(val => val.label);
    }

    const root = Note.fromValue(noteValue).name;
    console.log("root");
    console.log(root);

    return postData(urlRoot + '/getChords/',
        {
            notes: scaleToLimitBy, 
            root: root, //this constraint works for A but nothing else. why?
            category: category, //the radio value the UI is set to
            searchString: searchString, //user input text search string
        }
    ).then(
        response => {
            return response.json();
    });
}

function getTriads(noteValue, scaleToLimitBy) {
    return fapi_getChords(noteValue, "Triad", scaleToLimitBy);
}

function getSixthChords(noteValue, scaleToLimitBy) {
    return fapi_getChords(noteValue, "Six", scaleToLimitBy);
}

function getSeventhChords(noteValue, scaleToLimitBy) {
    return fapi_getChords(noteValue, "Seven", scaleToLimitBy);
}

function getNinthChords(noteValue, scaleToLimitBy) {
    return fapi_getChords(noteValue, "Nine", scaleToLimitBy);
}

function getEleventhChords(noteValue, scaleToLimitBy) {
    return fapi_getChords(noteValue, "Eleven", scaleToLimitBy);
}

function getThirteenthChords(noteValue, scaleToLimitBy) {
    return fapi_getChords(noteValue, "Thirteen", scaleToLimitBy);
}
//valid types Extensions, Alterations, Added Tones, Removed Tones
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
    /*
    chord.category is a triad you would grab chords with category = seven
    if seven, then nine
    if nine, then 11
    if eleven, then thirteen
    if thirteen, return nothing
    */
   return;
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
    return [{label: "-An Alteration 1-", name: "A Lydian"},
            {label: "-An Alteration 2-", name: "A Lydian"},
            {label: "-An Alteration 3-", name: "A Lydian"}];
}

function getAddedToneScalesForScales(scale, chordToLimitBy) {
    // this would give usscales where foundScale.noteCount === (scale.noteCount + 1) and all notes in scale are found in foundSCale
    return [{label: "-A + Tone-", name: "B Lydian"}];

}

function getRemoveToneScaleForScale(scale, chordToLimitBy) {
    // this would give us scales where foundScale.noteCount === (scale.noteCount - 1) and all notes in foundScale are found in scale
    return [{label: "-A - Tone 1-", name: "C Lydian"},
            {label: "-A - Tone 2-", name: "B Lydian"}];
}


function fapi_getTunings(instrument, stringCount) {

    switch(instrument) {
        case "Guitar":
            return getGuitarTunings(stringCount);
            break;
        case "Bass":
            return getBassTunings(stringCount);
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
            label: "Bass"
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
        },
        {
            label: "DADGBE"
        },
        {
            label: "DADGBD"
        }
    ];
}

function getBassTunings(stringCount) {
    stringCount = stringCount === null ? 4 : stringCount;

    return [
        {   
            label: "EADG"
        },
        {
            label: "DADG"
        },
    ];
}

function fapi_isValidTextTuning(tuningString, instrument) {
    console.log("instrument");
    console.log(instrument);
    if (!tuningString) {return false;}
    if (typeof tuningString !== "string") {return false;}

    const tuningNoteStringArray = tuningString.match(/[A-G][b|#]?/g);

    if (instrument === "Guitar") {
        return tuningNoteStringArray && tuningNoteStringArray.length === 6;
    }
    else if (instrument === "Bass") {
        return tuningNoteStringArray && tuningNoteStringArray.length === 4;
    }

}

async function fapi_getChordsFromUserString(string, scaleToLimitBy) {
    console.log("fapi_getChordsFromUserString");
    console.log("String: " + string);
    if (!string || string === "") {return null;} 
    return await postData(urlRoot + '/getChords/fromStrings/',
    {
        string: string
    }
    ).then(response => {
        return response.json();
    }).catch((error) => {
        console.error('Error:', error);
      });;
    /*
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
    */

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

function fapi_getAllTonewood() {
    return [
        {
            label: "Rosewood"
        },
        {
            label: "Maple"
        }
    ];
}

function fapi_getAllPianoOctaves() {
    return [
        {
            label: "2"
        },
        {
            label: "3"
        }
    ];
}

function fapi_getOrientations() {
    return [
        {
            label: "Right-Handed"
        },
        {
            label: "Left-Handed"
        }
    ];
}


export {  
    fapi_getModes, 
    fapi_getScalesFromModeName, 
    fapi_getChords, 
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
}