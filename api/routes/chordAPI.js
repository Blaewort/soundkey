var express = require("express");
var router = express.Router();
var chord = require('../bin/models/chord.js');


router.get('/getChord/:chordNotation', (req,res) => {
    console.log(req.params.chordNotation);
    try{
      var newChord = chord.getChordFromNotation(req.params.chordNotation);
    } catch(err){
        res.send(err.message);
    }
    res.json(newChord.notes);
    console.log('Sent chord');
});





























module.exports = router;