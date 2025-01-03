import { Note } from 'chord-expressions';

//const urlRoot = "http://localhost:5000/api";

const host = window.location.hostname;

const urlRoot = host === "localhost" ? `http://${window.location.hostname}:5000/api` : `https://${window.location.hostname}/api`;

//const urlRoot = `${window.location.hostname}/api`;

console.log("+++++++++++++++++++++++///////////////////////////////////+++");
console.log(urlRoot);

//handle all api requests for the applicatiom

// returns a promise

async function postData(url = '', data = {}) {
    console.log("+++++++++++++++++++++++///////////////////////////////////+++");
    console.log(urlRoot);
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

function fapi_getScales(noteValue,chordToLimitBy, groupID) {
    noteValue = typeof noteValue === "string" ? parseInt(noteValue) : noteValue;

    console.log("made it to fapi_getScales")

    // if its a chord/scale object with .notes prop then convert it to an array of note label strings (["A#, "B", C#, etc])
    if(chordToLimitBy?.notes){
        chordToLimitBy = chordToLimitBy.notes.map(val => val.label);
    }

    const root = Note.fromValue(noteValue).name;
    console.log("root");
    console.log(root);

    return postData(urlRoot + '/getScales/',
        {
            notes: chordToLimitBy, 
            root: root, //this constraint works for A but nothing else. why?
            groupID: groupID,
        }
    ).then(
        response => {
            return response.json();
    });
}

function fapi_getScaleGroups(noteValue,chordToLimitBy, type) {
    noteValue = typeof noteValue === "string" ? parseInt(noteValue) : noteValue;

    console.log("made it to fapi_getScaleGroups")

    // if its a chord/scale object with .notes prop then convert it to an array of note label strings (["A#, "B", C#, etc])
    if(chordToLimitBy?.notes){
        chordToLimitBy = chordToLimitBy.notes.map(val => val.label);
    }

    const root = Note.fromValue(noteValue).name;
    console.log("root");
    console.log(root);

    return postData(urlRoot + '/getScaleGroups/',
        {
            chordToLimitBy: chordToLimitBy, 
            root: root, 
            type: type,
        }
    ).then(
        response => {
            return response.json();
    });
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

function fapi_getChordExtensions(noteValue,category = null, baseChord, scaleToLimitBy, triadBase) {
    console.log("inside fapi_getChordExtensions");
    noteValue = typeof noteValue === "string" ? parseInt(noteValue) : noteValue;


    // if its a chord/scale object with .notes prop then convert it to an array of note label strings (["A#, "B", C#, etc])
    if(baseChord?.notes){
        baseChord = baseChord.notes.map(val => val.label);
    }
    if(scaleToLimitBy?.notes){
        scaleToLimitBy = scaleToLimitBy.notes.map(val => val.label);
    }

    const root = Note.fromValue(noteValue).name;
    console.log("root");
    console.log(root);

    console.log("made it to just before the return of fapi_getChordExtensions");

    return postData(urlRoot + '/getChords/Extensions/',
        {
            baseChord: baseChord, 
            root: root,
            category: category, //the radio value the UI is set to
            scaleToLimitBy: scaleToLimitBy,
            triadBase: triadBase
        }
    ).then(
        response => {
            return response.json();
    });
}

function fapi_getChordAlterations(noteValue, baseChord, scaleToLimitBy) {
    console.log("inside fapi_getChordAlterations");
    noteValue = typeof noteValue === "string" ? parseInt(noteValue) : noteValue;

    console.log("made it to fapi_getChordAlterations")

    // if its a chord/scale object with .notes prop then convert it to an array of note label strings (["A#, "B", C#, etc])
    if(baseChord?.notes){
        baseChord = baseChord.notes.map(val => val.label);
    }
    if(scaleToLimitBy?.notes){
        scaleToLimitBy = scaleToLimitBy.notes.map(val => val.label);
    }

    const root = Note.fromValue(noteValue).name;
    console.log("root");
    console.log(root);

    return postData(urlRoot + '/getChords/Alterations/',
        {
            baseChord: baseChord, 
            scaleToLimitBy: scaleToLimitBy
        }
    ).then(
        response => {
            return response.json();
    });
}

function fapi_getChordAppendments(noteValue, baseChord, scaleToLimitBy) {
    console.log("inside fapi_getChordAppendments");
    noteValue = typeof noteValue === "string" ? parseInt(noteValue) : noteValue;

    console.log("made it to fapi_getChordAppendments")

    // if its a chord/scale object with .notes prop then convert it to an array of note label strings (["A#, "B", C#, etc])
    if(baseChord?.notes){
        baseChord = baseChord.notes.map(val => val.label);
    }
    if(scaleToLimitBy?.notes){
        scaleToLimitBy = scaleToLimitBy.notes.map(val => val.label);
    }

    const root = Note.fromValue(noteValue).name;
    console.log("root");
    console.log(root);

    return postData(urlRoot + '/getChords/Appendments/',
        {
            baseChord: baseChord,
            scaleToLimitBy: scaleToLimitBy
        }
    ).then(
        response => {
            return response.json();
    });
}

function fapi_getChordDeductions(noteValue,baseChord, scaleToLimitBy) {
    console.log("inside fapi_getChordDeductions");
    noteValue = typeof noteValue === "string" ? parseInt(noteValue) : noteValue;

    console.log("made it to fapi_getChordDeductions")

    // if its a chord/scale object with .notes prop then convert it to an array of note label strings (["A#, "B", C#, etc])
    if(baseChord?.notes){
        baseChord = baseChord.notes.map(val => val.label);
    }
    if(scaleToLimitBy?.notes){
        scaleToLimitBy = scaleToLimitBy.notes.map(val => val.label);
    }

    const root = Note.fromValue(noteValue).name;

    return postData(urlRoot + '/getChords/Deductions/',
        {
            baseChord: baseChord, 
            scaleToLimitBy: scaleToLimitBy
        }
    ).then(
        response => {
            return response.json();
    });
}

function fapi_getChordRotations(noteValue, chordToRotate) {
    console.log("inside fapi_getChordRotationss");
    noteValue = typeof noteValue === "string" ? parseInt(noteValue) : noteValue;

    console.log("made it to fapi_getChordRotations")

    // if its a chord/scale object with .notes prop then convert it to an array of note label strings (["A#, "B", C#, etc])
    if(chordToRotate?.notes){
        chordToRotate = chordToRotate.notes.map(val => val.label);
    }

    const root = Note.fromValue(noteValue).name;
    console.log("root");
    console.log(root);

    return postData(urlRoot + '/getChords/Rotations/',
        {
            chordToRotate: chordToRotate, 
            root: root, //this constraint works for A but nothing else. why?
        }
    ).then(
        response => {
            return response.json();
    });
}

function fapi_getScaleRotations(noteValue, scaleToRotate) {
    console.log("inside fapi_getScaleRotationss");
    noteValue = typeof noteValue === "string" ? parseInt(noteValue) : noteValue;

    console.log("made it to fapi_getScaleRotations")

    // if its a chord/scale object with .notes prop then convert it to an array of note label strings (["A#, "B", C#, etc])
    if(scaleToRotate?.notes){
        scaleToRotate = scaleToRotate.notes.map(val => val.label);
    }

    const root = Note.fromValue(noteValue).name;
    console.log("root");
    console.log(root);

    return postData(urlRoot + '/getScales/Rotations/',
        {
            scaleToRotate: scaleToRotate, 
            root: root, //this constraint works for A but nothing else. why?
        }
    ).then(
        response => {
            return response.json();
    });
}

function fapi_getScaleAlterations(noteValue, baseScale, chordToLimitBy) {
    console.log("inside fapi_getScaleAlterations");
    noteValue = typeof noteValue === "string" ? parseInt(noteValue) : noteValue;

    console.log("made it to fapi_getScaleAlterations");

    // if its a chord/scale object with .notes prop then convert it to an array of note label strings (["A#, "B", C#, etc])
    if(baseScale?.notes){
        baseScale = baseScale.notes.map(val => val.label);
    }
    if (chordToLimitBy?.notes) {
        chordToLimitBy = chordToLimitBy.notes.map(val => val.label);
    }

    console.log(noteValue);
    console.log("noteValu^^^^e");
    

    const root = Note.fromValue(noteValue).name;

    console.log("made it to ________________DDDDDDDDDDDDDDDD");

    return postData(urlRoot + '/getScales/Alterations/',
        {
            baseScale: baseScale, 
            chordToLimitBy: chordToLimitBy
        }
    ).then(
        response => {
            return response.json();
    });
}

function fapi_getScaleAppendments(noteValue,baseScale, chordToLimitBy) {
    console.log("inside fapi_getScaleAppendments");
    noteValue = typeof noteValue === "string" ? parseInt(noteValue) : noteValue;

    console.log("made it to fapi_getScaleAppendments")

    // if its a chord/scale object with .notes prop then convert it to an array of note label strings (["A#, "B", C#, etc])
    if(baseScale?.notes){
        baseScale = baseScale.notes.map(val => val.label);
    }
    if(chordToLimitBy?.notes){
        chordToLimitBy = chordToLimitBy.notes.map(val => val.label);
    }

    const root = Note.fromValue(noteValue).name;

    return postData(urlRoot + '/getScales/Appendments/',
        {
            baseScale: baseScale, 
            chordToLimitBy: chordToLimitBy,
        }
    ).then(
        response => {
            return response.json();
    });
}

function fapi_getScaleDeductions(noteValue, baseScale, chordToLimitBy) {
    console.log("inside fapi_getScaleDeductions");
    noteValue = typeof noteValue === "string" ? parseInt(noteValue) : noteValue;

    console.log("made it to fapi_getScaleDeductions")

    // if its a chord/scale object with .notes prop then convert it to an array of note label strings (["A#, "B", C#, etc])
    if(baseScale?.notes){
        baseScale = baseScale.notes.map(val => val.label);
    }
    if(chordToLimitBy?.notes){
        chordToLimitBy = chordToLimitBy.notes.map(val => val.label);
    }

    const root = Note.fromValue(noteValue).name;

    return postData(urlRoot + '/getScales/Deductions/',
        {
            baseScale: baseScale, 
            chordToLimitBy: chordToLimitBy
        }
    ).then(
        response => {
            return response.json();
    });
}

function fapi_getScaleFromUserString(userString, userSelectedScale, selectedChord) {
    console.log("inside fapi_getScaleFromUserString");

    console.log("made it to fapi_getScaleFromUserString")

    // if its a chord/scale object with .notes prop then convert it to an array of note label strings (["A#, "B", C#, etc])
    let userSelectedScaleNotes;
    if(userSelectedScale?.notes){
        userSelectedScaleNotes = userSelectedScale.notes.map(val => val.label);
    }

    let selectedChordNotes;
    if(selectedChord?.notes){
        selectedChordNotes = selectedChord.notes.map(val => val.label);
    }

    return postData(urlRoot + '/getScales/FromString/',
        {
            userSelectedScaleNotes: userSelectedScaleNotes, 
            userString: userString, 
            chordToLimitBy: selectedChordNotes,
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
    fapi_getScaleGroups,
    fapi_getScalesFromModeName, 
    fapi_getScales,
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
}