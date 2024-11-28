const express = require("express");
const { ConsoleReporter } = require("jasmine");
const db = require("../bin/models/database");
const router = express.Router();
const chordExpressions =  require('chord-expressions');
console.log("Load API Router");


router.get('/getChords/', (req,res) => {
  console.log("Get Chords");
  res.send('chords');
});

router.post('/getChords/Alterations',async (req,res) => {
  console.log("in the /getChords/Alterations route");

  console.log(req.body);
  console.log("req.body^");

  let maxNotes = req.body.maxNotes ? req.body.maxNotes : null;
  let root = req.body.root ? req.body.root : null;
  let category = req.body.category ? req.body.category : null;
  let notes = req.body.notes;
  console.log("db.getChords/Alterations(",notes,",",root,",",category,",",maxNotes,")");
  let chords = await db.getChordAlterations(notes,root,category,maxNotes);
  res.json(JSON.stringify(chords));
});

router.post('/getChords/fromStrings/' ,(req,res) => {
  console.log(req.body);
  let chords = chordExpressions.Chord.chordFromNotation(req.body.string);
  console.log(chords);
  res.send(JSON.stringify(chords));
});

router.post('/getChords/',async (req,res) => {
  console.log("in the route");
  let maxNotes = req.body.maxNotes ? req.body.maxNotes : null;
  let root = req.body.root ? req.body.root : null;
  let category = req.body.category ? req.body.category : null;
  let notes = req.body.notes;
  console.log("db.getChords(",notes,",",root,",",category,",",maxNotes,")");
  let chords = await db.getChords(notes,root,category,maxNotes);
  res.json(JSON.stringify(chords));
});
//getScales(obj,root = null,mode = null)
router.post('/getScales/',async (req,res) => {
  let body = req.body;
  let scales = await db.getScales(body.data, body.root, body.mode);
  res.send(scales);
});
//(noteValue, type = "Heptatonic", obj)
router.post('/getModes/',async (req,res) => {
  let body = req.body;
  let results = await db.getModes(body.root, body.type , body.data);
  res.send(results);
});

module.exports = router;