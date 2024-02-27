import { getChords, getScales, getModes} from '../../bin/models/database.js';
import {Chord,Scale }from 'chord-expressions';

describe("Database Suite", function() {
    it("getModes", function() {
        //fapi_getModes(noteValue, type = "Heptatonic", chordToLimitBy) type = default Heptatonic or Dodecatonic
        //returns a list of all possible modes for a rootNote, type, and limit chord
    });
    it("getScalesFromModeName", function() {
        //getScalesFromModeName(noteValue, mode, chordToLimitBy)
        
    });
    it("getChords", async function() {
        //getChords(obj, category = null , maxNotes = 12)
        let notesArr = ["C","E","G"];
        let chords = await getChords(notesArr,null,"Triad");
        console.log("--------------------------------------------------here chords");
        console.log(chords);
        chords.forEach(chord => {
            expect(chord.category).toBe("Triad");
            console.log("---------------------------------------------------------------------NOTE");
            console.log(chord.notes[0]);
            expect(chord.notes.find( (note) => note.name === "C")).toBeDefined();
            expect(chord.notes.find( (note) => note.symbol === "C") || 
            chord.notes.find( (note) => note.symbol === "E") ||
            chord.notes.find( (note) => note.symbol === "G"));
        });

        console.log("heyyyyyy66666666666666666666666666y");
        chords = await getChords(notesArr,null,"Six");
        chords.forEach(chord => {
            expect(chord.category).toBe("Six");
            //expect(chord.notes.includes("C").toBe(true));
            expect(chord.notes.includes("E"));
            expect(chord.notes.includes("G"));
        })


        notesArr = ["E","F#","G#", "A#", "B", "C#", "D#"];
        chords = await getChords(notesArr,"E","Triad");
        chords.forEach(chord => {
            expect(chord.category).toBe("Triad");
            expect(
                chord.notes.includes("E") || 
                chord.notes.includes("G#") || 
                chord.notes.includes("G#") || 
                chord.notes.includes("A#") || 
                chord.notes.includes("B") ||
                chord.notes.includes("C#") ||
                chord.notes.includes("D#") );
        })

        

        
    });
    it("getChordNearbys", function() {
        
    });
    it("getScaleNearbys", function() {
        
    });
    it("getTunings", function() {
        
    });
 
    it("isValidTextTuning", function() {
        
    });
    it("getChordsFromUserString", function() {
        
    });
    it("getScalesFromUserString", function() {
        
    });
    it("getScales", async function() {
        let notesArr = ["C","E","G"];
        let scales = await getScales(notesArr,"C","diatonic");
        scales.forEach(scale =>{
            expect(scale.rootNote.name).toBe("C");
            expect(scale.modeName).toBe("diatonic");
            expect(scale.notes.includes("C")).toBe(true);
            expect(scale.notes.includes("E")).toBe(true);
            expect(scale.notes.includes("G")).toBe(true);

        });
    });
  });
  