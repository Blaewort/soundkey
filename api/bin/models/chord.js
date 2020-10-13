const  Chord = require('chord-expressions').Chord;
const StartSession = require('./index.js');
console.log(Chord);
module.exports = {
    getChordFromNotation: function(chordNotation){
    return Chord.chordFromNotation(chordNotation);
}

};
