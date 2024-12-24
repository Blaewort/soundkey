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

  let baseChord = req.body.baseChord;
  let scaleToLimitBy = req.body.scaleToLimitBy;
  console.log("db.getChords/Alterations(",baseChord,",",scaleToLimitBy,")");
  let chords = await db.getChordAlterations(baseChord,scaleToLimitBy);
  res.json(JSON.stringify(chords));
});

router.post('/getChords/Extensions',async (req,res) => {
  console.log("in the /getChords/Extensions route");

  let root = req.body.root ? req.body.root : null;
  let category = req.body.category ? req.body.category : null;
  let baseChord = req.body.baseChord;
  let scaleToLimitBy = req.body.scaleToLimitBy;
  let triadBase = req.body.triadBase;

  console.log("db.getChords/Extensions(",baseChord,",",root,",",category,",",scaleToLimitBy,")");
  let chords = await db.getChordExtensions(baseChord,root,category,scaleToLimitBy, triadBase);
  res.json(JSON.stringify(chords));
});

router.post('/getChords/Appendments',async (req,res) => { // TODO: a lot of reusable code around these parts
  console.log("in the /getChords/Extensions route");

  let baseChord = req.body.baseChord;
  let scaleToLimitBy = req.body.scaleToLimitBy;
  console.log("db.getChords/Appendments(",baseChord,",",scaleToLimitBy,")");
  let chords = await db.getChordAppendments(baseChord,scaleToLimitBy);
  res.json(JSON.stringify(chords));
});

router.post('/getChords/Deductions',async (req,res) => {
  console.log("in the /getChords/Deductions route");

  let baseChord = req.body.baseChord;
  let scaleToLimitBy = req.body.scaleToLimitBy;
  console.log("db.getChords/Deductions(",baseChord,",",scaleToLimitBy,")");
  let chords = await db.getChordDeductions(baseChord,scaleToLimitBy);
  res.json(JSON.stringify(chords));
});

router.post('/getChords/Rotations',async (req,res) => {
  console.log("in the /getChords/Rotations route");

  let root = req.body.root;
  let chordToRotate = req.body.chordToRotate;
  console.log("db.getChords/Rotations(",root,",",chordToRotate,")");
  let chords = await db.getChordRotations(root,chordToRotate);
  res.json(JSON.stringify(chords));
});

router.post('/getScales/Rotations',async (req,res) => {
  console.log("in the /getScales/Rotations route");

  let root = req.body.root;
  let scaleToRotate = req.body.scaleToRotate;
  console.log("db.getChords/Rotations(",root,",",scaleToRotate,")");
  let scales = await db.getScaleRotations(root,scaleToRotate);
  res.json(JSON.stringify(scales));
});

router.post('/getChords/fromStrings/' ,async (req,res) => {
  console.log(req.body);
  let chords;
  try {
    chords = chordExpressions.Chord.chordFromNotation(req.body.string, true);
  } catch (error) {
    console.log(error);
    return;
  }
  
  console.log(chords);

  // need label for app, not name
  chords.notes = chords.notes.map((note) => {
    const { name, ...rest } = note; 
      return {
          ...rest, 
          label: name, 
      };
  });


 // fromNotation (or parser itself) not giving correct chordCategory so we need to override with what we can find in the database
  // if we can't find it then it's just going to be "Crafted" per db.GetChordCategoryAndTriadBase
 // same deal for triadBase
  const { category, triadBase } = await db.getChordCategoryAndTriadBase(chords.rootNote.name, chords.notes.map(note => note.label));
  chords.category = category;
  chords.triadBase = triadBase;


 

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

  let baseScale = req.body.baseScale;
  let chordToLimitBy = req.body.chordToLimitBy;
  console.log("db.getScalesAlterations(",baseScale,",",chordToLimitBy,")");
  let scales = await db.getScaleAlterations(baseScale, chordToLimitBy);
  res.send(scales);
});

router.post('/getScales/Appendments',async (req,res) => {
  console.log("in the route /getScales/Appendments");
  let baseScale = req.body.baseScale;
  let chordToLimitBy = req.body.chordToLimitBy;
  console.log("db.getScaleAppendments(",baseScale,",",chordToLimitBy,")");
  let scales = await db.getScaleAppendments(baseScale, chordToLimitBy);
  res.send(scales);
});

router.post('/getScales/Deductions',async (req,res) => {
  console.log("in the route /getScales/Deductions");

  let baseScale = req.body.baseScale;
  let chordToLimitBy = req.body.chordToLimitBy;
  console.log("db.getScalesDeductions(",baseScale,",",chordToLimitBy,")");
  let scales = await db.getScaleDeductions(baseScale, chordToLimitBy);
  res.send(scales);
});

router.post('/getScales/FromString',async (req,res) => {
  console.log("in the route /getScales/FromString");
  let chordToLimitBy = req.body.chordToLimitBy;
  let userString = req.body.userString;
  let userSelectedScaleNotes = req.body.userSelectedScaleNotes;
  console.log("db.getScalesDeductions(",chordToLimitBy,",",userSelectedScaleNotes,",",userString,")");
  let scales = await db.getScalesFromUserString(chordToLimitBy, userSelectedScaleNotes, userString);
  res.send(scales);
});




module.exports = router;