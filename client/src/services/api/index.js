//handle all api requests for the applicatiom

function fetchChord(notation) {
    console.log(notation);
    return fetch('http://localhost:5000/chordAPI/getChord/d').then(response => response.json);
}


// below is the data the UI knows how to read, not necessarily the format in db
// although this might be limited to the simple addition of a label attribute for item display in the UI

function fapi_getModes(noteValue, type = "Heptatonic") {
    type = type === null ? "Heptatonic": type;

    //noteValue would be 0-12 and we'd grab all chords with root note 0-12

    switch(type) {
        case "Heptatonic":
            return getHeptatonicModes();
            break;
        case "Dodecatonic":
            return getDodecatonicModes();
            break;
        default:
            throw new TypeError("note length of " + type + " not suppored");
    }
}

//let list = this.props.getScalesFromModeName(this.props.noteSelect.value, this.props.mode); blark

function fapi_getScalesFromModeName(noteValue, mode) {


    noteValue = ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"][noteValue];

    switch(mode) {
        //12 notes
        case "Chromatic":
            return [
                {
                label: "Chromatic",
                name: noteValue + " Chromatic"
                }
            ];
            break;
        //7 notes
        case "Diatonic":
            return [
                {
                    label: "Major",
                    name: noteValue + " Major"
                },
                {
                    label: "Dorian",
                    name: noteValue + " Dorian"
                },
                {
                    label: "Phrygian",
                    name: noteValue + " Phrygian"
                },
                {
                    label: "Lydian",
                    name: noteValue + " Lydian"
                },
                {
                    label: "Mixolydian",
                    name: noteValue + " Mixolydian"
                },
                {
                    label: "Minor",
                    name: noteValue + " Minor"
                },
                {
                    label: "Locrian",
                    name: noteValue + " Locrian"
                }
            ];
            break;
            case "Melodic Minor":
                return [
                    {
                        label: "Melodic Minor",
                        name: noteValue + " Melodic Minor"
                    },
                    {
                        label: "Dorian b2",
                        name: noteValue + " Dorian b2"
                    },
                    {
                        label: "Lydian Augmented",
                        name: noteValue + " Lydian Augmented"
                    },
                    {
                        label: "Lydian Dominant",
                        name: noteValue + " Lydian Dominant"
                    },
                    {
                        label: "Mixolydian b6",
                        name: noteValue + " Mixolydian b6" 
                    },
                    {
                        label: "Aeolian b5",
                        name: noteValue + " Aeolian b5"
                    },
                    {
                        label: "Super Locrian",
                        name: noteValue + " Super Locrian"
                    }
                ];
                break;
                case "Neapolitan Major":
                    return [
                        {
                            label: "Neapolitan Major",
                            name: noteValue + " Neapolitan Major"
                        },
                        {
                            label: "Leading Whole Tone",
                            name: noteValue + " Leading Whole Tone"
                        },
                        {
                            label: "Lydian Augmented Dominant",
                            name: noteValue + " Lydian Augmented Dominant"
                        },
                        {
                            label: "Lydian Dominant b6",
                            name: noteValue + " Lydian Dominant b6"
                        },
                        {
                            label: "Major Locrian",
                            name: noteValue + " Major Locrian"
                        },
                        {
                            label: "Semi-Locrian b4",
                            name: noteValue + " Semi-Locrian b4"
                        },
                        {
                            label: "Super Locrian bb3",
                            name: noteValue + " Super Locrian bb3"
                        }
                    ];
                break;
                case "Neapolitan Minor":
                    return [
                        {
                            label: "Neapolitan Minor",
                            name: noteValue + " Neapolitan Minor"
                        },
                        {
                            label: "Lydian #6",
                            name: noteValue + " Lydian #6"
                        },
                        {
                            label: "Mixolydian Augmented",
                            name: noteValue + " Mixolydian Augmented"
                        },
                        {
                            label: "Hungarian Gypsy",
                            name: noteValue + " Hungarian Gypsy"
                        },
                        {
                            label: "Locrian Dominant",
                            name: noteValue + " Locrian Dominant"
                        },
                        {
                            label: "Ionian #2",
                            name: noteValue + " Ionian #2"
                        },
                        {
                            label: "Ultra Locrian bb3",
                            name: noteValue + " Ultra Locrian bb3"
                        }
                    ];
                break;
                case "Harmonic Major":
                    return [
                        {
                            label: "Harmonic Major",
                            name: noteValue + " Harmonic Major",
                        },
                        {
                            label: "Dorian b5",
                            name: noteValue + " Dorian b5"
                        },
                        {
                            label: "Phyrgian b4",
                            name: noteValue + " Phyrgian b4"
                        },
                        {
                            label: "Lydian b3",
                            name: noteValue + " Lydian b3"
                        },
                        {
                            label: "Mixolydian b9",
                            name: noteValue + " Mixolydian b9"
                        },
                        {
                            label: "Lydian Augmented #2",
                            name: noteValue + " Lydian Augmented #2"
                        },
                        {
                            label: "Locrian bb7",
                            name: noteValue + " Locrian bb7"
                        }
                    ];
                break;
                case "Harmonic Minor":
                    return [
                        {
                            label: "Harmonic Minor",
                            name: noteValue + " Harmonic Minor"
                        },
                        {
                            label: "Locrian #6",
                            name: noteValue + " Locrian #6"
                        },
                        {
                            label: "Ionian Augmented",
                            name: noteValue + " Ionian Augmented"
                        },
                        {
                            label: "Romanian",
                            name: noteValue + " Romanian"
                        },
                        {
                            label: "Phrygian Dominant",
                            name: noteValue + " Phrygian Dominant"
                        },
                        {
                            label: "Lydian #2",
                            name: noteValue + " Lydian #2"
                        },
                        {
                            label: "Ultra Locrian",
                            name: noteValue + " Ultra Locrian"
                        }
                    ];
                break;
                case "Double Harmonic":
                    return [
                        {
                            label: "Double Harmonic Major",
                            name: noteValue + " Double Harmonic Major"
                        },
                        {
                            label: "Lydian #2 #6",
                            name: noteValue +" Lydian #2 #6" 
                        },
                        {
                            label: "Ultra Phrygian",
                            name: noteValue + " Ultra Phrygian"
                        },
                        {
                            label: "Double Harmonic Minor",
                            name: noteValue + " Double Harmonic Minor"
                        },
                        {
                            label: "Oriental",
                            name: noteValue + " Oriental"
                        },
                        {
                            label: "Ionian Augmented #2",
                            name: noteValue + " Ionian Augmented #2"
                        },
                        {
                            label: "Locrian bb3 bb7",
                            name: noteValue + " Locrian bb3 bb7"
                        }
                    ];
                break;
        default:
            throw new TypeError("mode of " + mode + " not suppored");
    }

}

function getHeptatonicModes() {
    //queries a _Mode_ table which is a list of modes (string=name, makeup=notsure)

    return [
        {
            label: "Diatonic",
            makeup: "2w h 3w h" //express the pattern all diatonic scales share regardless of reference to a root note
                                // might be useful for grabbing a list of all diatonic scales
        },
        {
            label: "Melodic Minor",
            makeup: "1w h 4w h"
        },
        {
            label: "Neapolitan Major",
        },
        {
            label: "Neapolitan Minor",
        },
        {
            label: "Harmonic Major",
        },
        {
            label: "Harmonic Minor",
        },
        {
            label: "Double Harmonic",
        },
    ];
}


function getDodecatonicModes() {
    //queries a _Mode_ table which is a list of modes (string=name, makeup=notsure)
    return [
        {
            label: "Chromatic",
            makeup: "12h" 
        }
    ];
}






function fapi_getChords(noteValue, type = "Triads") {
    type = type === null ? "Triads": type;

    //noteValue would be 0-12 and we'd grab all chords with root note 0-12

    switch(type) {
        case "Triads":
            return getTriads(noteValue);
            break;
        case "Seventh Chords":
            return getSeventhChords(noteValue);
            break;
        case "Ninth Chords":
            return getNinthChords(noteValue);
            break;
        case "Eleventh Chords":
            return getEleventhChords(noteValue);
            break;
        case "Thirteenth Chords":
            return getThirteenthChords(noteValue);
            break;
        case "Sixth Chords":
            return getSixthChords(noteValue);
            break;
        default:
            throw new TypeError("bad chord type");
    }
}

function getTriads(rootValue) {
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

function getSixthChords(rootValue) {
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

function getSeventhChords(rootValue) {
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

function getNinthChords(rootValue) {
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

function getEleventhChords(rootValue) {
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

function getThirteenthChords(rootValue) {
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

function fapi_getChordNearbys(chord, type) {
    type = type === null ? "Extensions": type;


    switch(type) {
        case "Extensions":
            return getExtensionsForChord(chord);
            break;
        case "Alterations":
            return getAlteredChordsForChord(chord);
            break;
        case "Added Tones":
            return getAddedToneChordsForChord(chord);
            break;
        case "Removed Tones":
            return getRemoveToneChordsForChord(chord);
            break;
        default:
            throw new TypeError("wrong type");
    }

}

function fapi_getScaleNearbys(scale, type) {
    type = type === null ? "Alterations": type;


    switch(type) {
        case "Alterations":
            return getAlteredScalesForScale(scale);
            break;
        case "Added Tones":
            return getAddedToneScalesForScales(scale);
            break;
        case "Removed Tones":
            return getRemoveToneScaleForScale(scale);
            break;
        default:
            throw new TypeError("wrong type");
    }

}


function getExtensionsForChord(chord) {
    // this function would give us the next logical piece from chord
    //E7 would return E9, Cmaj9 would return Cmaj11 I guess it's just one item in the list


    
    return [{label: "-An Extension-",
    symbol:  "B13",
    name: "B Thirteen"}];

}

function getAlteredChordsForChord(chord) {
    // this would give us chords where foundChord.noteCount === chord.noteCount but only (chord.noteCount-1) amount of notes match between the two chords
    return [{label: "-An Alteration-",
    symbol:  "B13",
    name: "B Thirteen"}];
}

function getAddedToneChordsForChord(chord) {
    // this would give us chords where foundChord.noteCount === (chord.noteCount + 1) and all notes in chord are found in foundChord
    return [{label: "-A + Tone chord-",
    symbol:  "B13",
    name: "B Thirteen"}];

}

function getRemoveToneChordsForChord(chord) {
    // this would give us chords where foundChord.noteCount === (chord.noteCount - 1) and all notes in foundChord are found in chord
    return [{label: "-A - Tone Chord-",
    symbol:  "B13",
    name: "B Thirteen"}];

}


function getAlteredScalesForScale(scale) {
    // this would give us scaless where foundScale.noteCount === scale.noteCount but only (scale.noteCount-1) amount of notes match between the two scales
    return [{label: "-An Alteration-",
    name: "B Lydian"}];
}

function getAddedToneScalesForScales(scale) {
    // this would give usscales where foundScale.noteCount === (scale.noteCount + 1) and all notes in scale are found in foundSCale
    return [{label: "-A + Tone-",
    name: "B Lydian"}];

}

function getRemoveToneScaleForScale(scale) {
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


export { 
    fetchChord, 
    fapi_getModes, 
    fapi_getScalesFromModeName, 
    fapi_getChords, 
    fapi_getChordNearbys,
    fapi_getScaleNearbys,
    fapi_getTunings,
    fapi_getInstruments,
    fapi_isValidTextTuning
}