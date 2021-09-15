var express = require("express");
const { ConsoleReporter } = require("jasmine");
var db = require("../bin/models/database");
var router = express.Router();

console.log("Load API Router");


router.get('/getChords/', (req,res) => {
  console.log("Get Chords");
  res.send('chords');
}); 

router.post('/getChords/',async (req,res) => {
  let maxNotes = req.body.maxNotes ? req.body.maxNotes : null;
  let root = req.body.root ? req.body.root : null;
  let category = req.body.category ? req.body.category : null;
  let notes = req.body;
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