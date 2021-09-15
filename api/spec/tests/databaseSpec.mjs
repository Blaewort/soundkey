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
        chords.forEach(chord => {
            expect(chord.category).toBe("Triad");
            expect(chord.notes.includes("C"));
            expect(chord.notes.includes("E"));
            expect(chord.notes.includes("G"));
        });
        chords = await getChords(notesArr,null,"Six");
        chords.forEach(chord => {
            expect(chord.category).toBe("Six");
            expect(chord.notes.includes("C"));
            expect(chord.notes.includes("E"));
            expect(chord.notes.includes("G"));
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
  