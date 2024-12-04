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

router.post('/getChords/Extensions',async (req,res) => {
  console.log("in the /getChords/Extensions route");

  console.log(req.body);
  console.log("req.body^");

  let maxNotes = req.body.maxNotes ? req.body.maxNotes : null;
  let root = req.body.root ? req.body.root : null;
  let category = req.body.category ? req.body.category : null;
  let notes = req.body.notes;
  console.log("db.getChords/Extensions(",notes,",",root,",",category,",",maxNotes,")");
  let chords = await db.getChordExtensions(notes,root,category,maxNotes);
  res.json(JSON.stringify(chords));
});

router.post('/getChords/Appendments',async (req,res) => { // TODO: a lot of reusable code around these parts
  console.log("in the /getChords/Extensions route");

  console.log(req.body);
  console.log("req.body^");

  let maxNotes = req.body.maxNotes ? req.body.maxNotes : null;
  let root = req.body.root ? req.body.root : null;
  let category = req.body.category ? req.body.category : null;
  let notes = req.body.notes;
  console.log("db.getChords/Appendments(",notes,",",root,",",category,",",maxNotes,")");
  let chords = await db.getChordAppendments(notes,root,category,maxNotes);
  res.json(JSON.stringify(chords));
});

router.post('/getChords/Deductions',async (req,res) => {
  console.log("in the /getChords/Deductions route");

  console.log(req.body);
  console.log("req.body^");

  let maxNotes = req.body.maxNotes ? req.body.maxNotes : null;
  let root = req.body.root ? req.body.root : null;
  let category = req.body.category ? req.body.category : null;
  let notes = req.body.notes;
  console.log("db.getChords/Deductions(",notes,",",root,",",category,",",maxNotes,")");
  let chords = await db.getChordDeductions(notes,root,category,maxNotes);
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

router.post('/getScales/Alterations',async (req,res) => {
  console.log("in the route /getScales/Alterations");
  let maxNotes = req.body.maxNotes ? req.body.maxNotes : null;
  let root = req.body.root ? req.body.root : null;
  let category = req.body.category ? req.body.category : null;
  let notes = req.body.notes;
  console.log("db.getScalesAlterations(",notes,",",root,",",category,",",maxNotes,")");
  let scales = await db.getScaleAlterations(notes, root, maxNotes);
  res.send(scales);
});

router.post('/getScales/Appendments',async (req,res) => {
  console.log("in the route /getScales/Appendments");
  let maxNotes = req.body.maxNotes ? req.body.maxNotes : null;
  let root = req.body.root ? req.body.root : null;
  let category = req.body.category ? req.body.category : null;
  let notes = req.body.notes;
  console.log("db.getScaleAppendments(",notes,",",root,",",category,",",maxNotes,")");
  let scales = await db.getScaleAppendments(notes, root, maxNotes);
  res.send(scales);
});

router.post('/getScales/Deductions',async (req,res) => {
  console.log("in the route /getScales/Deductions");
  let maxNotes = req.body.maxNotes ? req.body.maxNotes : null;
  let root = req.body.root ? req.body.root : null;
  let category = req.body.category ? req.body.category : null;
  let notes = req.body.notes;
  console.log("db.getScalesDeductions(",notes,",",root,",",category,",",maxNotes,")");
  let scales = await db.getScaleDeductions(notes, root, maxNotes);
  res.send(scales);
});

router.post('/getScales/FromString',async (req,res) => {
  console.log("in the route /getScales/FromString");
  let maxNotes = req.body.maxNotes ? req.body.maxNotes : null;
  let root = req.body.root ? req.body.root : null;
  let category = req.body.category ? req.body.category : null;
  let limiterNotes = req.body.limiterNotes;
  let userString = req.body.userString;
  let userSelectedScaleNotes = req.body.userSelectedScaleNotes;
  console.log("db.getScalesDeductions(",limiterNotes,",",userSelectedScaleNotes,",",userString,")");
  let scales = await db.getScalesFromUserString(limiterNotes, userSelectedScaleNotes, userString);
  res.send(scales);
});


//(noteValue, type = "Heptatonic", obj)
router.post('/getModes/',async (req,res) => {
  let body = req.body;
  let results = await db.getModes(body.root, body.type , body.data);
  res.send(results);
});

module.exports = router;