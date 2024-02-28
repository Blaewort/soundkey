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

        // Generate a chord from notation to show tests running correctly
        let gChord = Chord.chordFromNotation("C"); // Create C Major chord with notes C, E, G
        expect(gChord.category).toBe("Triad");
        expect(gChord.hasNote("C")).toBe(true);
        expect(gChord.rootNote.name).toBe("C");
        expect(gChord.allNotesFoundInNoteStringList(["C", "E", "G"])).toBe(true);
        expect(gChord.allNotesFoundInNoteStringList(["C", "E", "G", "A"])).toBe(true);
        expect(gChord.allNotesFoundInNoteStringList(["C", "E"])).toBe(false);
        expect(gChord.allNotesFoundInNoteStringList(["C", "E", "A"])).toBe(false);


        // database
        let noteLimitBy = ["E","F#","G#", "A#", "B", "C#", "D#"]; // E Lydian
        let chords = await getChords(noteLimitBy,"E","Triad");
        
        chords.forEach(chord => {
            expect(chord.category).toBe("Triad");
            expect(chord.hasNote("E")).toBe(true); //should have E since we only want chords built on E
            expect(chord.rootNote.name).toBe("E"); //should be built on E
            expect(chord.allNotesFoundInNoteStringList(noteLimitBy)).toBe(true); //all notes in each chord should be present in noteLimitBy
        });


        noteLimitBy = ["C","E","G"];
        chords = await getChords(noteLimitBy,null,"Triad");
        chords.forEach(chord => {
            expect(chord.category).toBe("Triad");
            expect(chord.allNotesFoundInNoteStringList(noteLimitBy)).toBe(true);
        });


        chords = await getChords(noteLimitBy,null,"Six");
        chords.forEach(chord => {
            expect(chord.category).toBe("Six");
            expect(chord.allNotesFoundInNoteStringList(noteLimitBy)).toBe(true);
        });


        

        

        
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
  