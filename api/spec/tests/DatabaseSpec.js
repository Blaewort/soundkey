import { getScalesFromChord, getChordsFromChord, getScalesFromScale, getChordAlterations, getScaleAlterations, getSubscalesFromScale } from '../../bin/models/database.js';


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

describe("Database Suite", function() {
    it("getModes", function() {
        //fapi_getModes(noteValue, type = "Heptatonic", chordToLimitBy) type = default Heptatonic or Dodecatonic
        //returns a list of all possible modes for a rootNote, type, and limit chord

    });
    it("getScalesFromModeName", function() {
        //getScalesFromModeName(noteValue, mode, chordToLimitBy)
        
    });
    it("getChords", function() {
        //fapi_getChords(noteValue, type = "Triads", scaleToLimitBy)
        
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


  });
  