var express = require("express");
var router = express.Router();
var chord = require('../bin/models/chord.js');


router.get('/getChord/:chordNotation', (req,res) => {
    console.log(req.params.chordNotation);
    try{
      var newChord = chord.getChordFromNotation(req.params.chordNotation);
    } catch(err){
        console.log(err.message);
        res.send(err.message);
    }
    console.log(newChord);
    res.json(newChord.notes);
    console.log('Sent chord');
});





























module.exports = router;