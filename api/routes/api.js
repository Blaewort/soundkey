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

  let notes = req.body.notes;
  let scaleToLimitBy = req.body.scaleToLimitBy;
  console.log("db.getChords/Alterations(",notes,",",scaleToLimitBy,")");
  let chords = await db.getChordAlterations(notes,scaleToLimitBy);
  res.json(JSON.stringify(chords));
});

router.post('/getChords/Extensions',async (req,res) => {
  console.log("in the /getChords/Extensions route");

  let root = req.body.root ? req.body.root : null;
  let category = req.body.category ? req.body.category : null;
  let baseChord = req.body.baseChord;
  let scaleToLimitBy = req.body.scaleToLimitBy;

  console.log("db.getChords/Extensions(",baseChord,",",root,",",category,",",scaleToLimitBy,")");
  let chords = await db.getChordExtensions(baseChord,root,category,scaleToLimitBy);
  res.json(JSON.stringify(chords));
});

router.post('/getChords/Appendments',async (req,res) => { // TODO: a lot of reusable code around these parts
  console.log("in the /getChords/Extensions route");

  console.log(req.body);
  console.log("req.body^");

  let notes = req.body.notes;
  let scaleToLimitBy = req.body.scaleToLimitBy;
  console.log("db.getChords/Appendments(",notes,",",scaleToLimitBy,")");
  let chords = await db.getChordAppendments(notes,scaleToLimitBy);
  res.json(JSON.stringify(chords));
});

router.post('/getChords/Deductions',async (req,res) => {
  console.log("in the /getChords/Deductions route");

  console.log(req.body);
  console.log("req.body^");

  let notes = req.body.notes;
  let scaleToLimitBy = req.body.scaleToLimitBy;
  console.log("db.getChords/Deductions(",notes,",",scaleToLimitBy,")");
  let chords = await db.getChordDeductions(notes,scaleToLimitBy);
  res.json(JSON.stringify(chords));
});

router.post('/getChords/Rotations',async (req,res) => {
  console.log("in the /getChords/Rotations route");

  console.log(req.body);
  console.log("req.body^");

  let root = req.body.root;
  let chordToRotate = req.body.chordToRotate;
  console.log("db.getChords/Rotations(",root,",",chordToRotate,")");
  let chords = await db.getChordRotations(root,chordToRotate);
  res.json(JSON.stringify(chords));
});

router.post('/getScales/Rotations',async (req,res) => {
  console.log("in the /getScales/Rotations route");

  console.log(req.body);
  console.log("req.body^");

  let root = req.body.root;
  let scaleToRotate = req.body.scaleToRotate;
  console.log("db.getChords/Rotations(",root,",",scaleToRotate,")");
  let scales = await db.getScaleRotations(root,scaleToRotate);
  res.json(JSON.stringify(scales));
});

router.post('/getChords/fromStrings/' ,(req,res) => {
  console.log(req.body);
  let chords = chordExpressions.Chord.chordFromNotation(req.body.string);
  console.log(chords);
  res.send(JSON.stringify(chords));
});

router.post('/getChords/',async (req,res) => {
  console.log("in the route");

  let root = req.body.root ? req.body.root : null;
  let category = req.body.category ? req.body.category : null;
  let notes = req.body.notes;

  console.log("db.getChords(",notes,",",root,",",category,")");

  let chords = await db.getChords(notes,root,category);
  res.json(JSON.stringify(chords));
});

//getScales(obj,root = null,mode = null)
router.post('/getScales/',async (req,res) => {
  console.log("in the /getScales/ route");
  let root = req.body.root ? req.body.root : null;
  let notes = req.body.notes;
  let groupID = req.body.groupID;
  console.log("db.getScales(",notes,",",root,",",groupID,")");
  let scales = await db.getScales(notes, root, groupID);
  res.json(scales);
});

router.post('/getScaleGroups/',async (req,res) => {
  console.log("in the /getScaleGroups/ route");

  let root = req.body.root ? req.body.root : null;
  let chordToLimitBy = req.body.chordToLimitBy;
  let type = req.body.type;

  console.log("db.getScaleGroups(",chordToLimitBy,",",root,",",type,")");
  let scales = await db.getScaleGroups(chordToLimitBy, root, type);
  res.json(scales);
});

router.post('/getScales/Alterations',async (req,res) => {
  console.log("in the route /getScales/Alterations");
  let maxNotes = req.body.maxNotes ? req.body.maxNotes : null;
  let root = req.body.root ? req.body.root : null;
  let category = req.body.category ? req.body.category : null;
  let notes = req.body.notes;
  let chordToLimitBy = req.body.chordToLimitBy;
  console.log("db.getScalesAlterations(",notes,",",chordToLimitBy,")");
  let scales = await db.getScaleAlterations(notes, chordToLimitBy);
  res.send(scales);
});

router.post('/getScales/Appendments',async (req,res) => {
  console.log("in the route /getScales/Appendments");
  let notes = req.body.notes;
  let chordToLimitBy = req.body.chordToLimitBy;
  console.log("db.getScaleAppendments(",notes,",",chordToLimitBy,")");
  let scales = await db.getScaleAppendments(notes, chordToLimitBy);
  res.send(scales);
});

router.post('/getScales/Deductions',async (req,res) => {
  console.log("in the route /getScales/Deductions");
  let notes = req.body.notes;
  let chordToLimitBy = req.body.chordToLimitBy;
  console.log("db.getScalesDeductions(",notes,",",chordToLimitBy,")");
  let scales = await db.getScaleDeductions(notes, chordToLimitBy);
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




module.exports = router;