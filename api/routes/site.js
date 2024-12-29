const express = require("express");
const db = require("../bin/models/database");
const siteRouter = express.Router();
const chordExpressions =  require('chord-expressions');
console.log("Load SITE Router");
const path = require('path');

module.exports = siteRouter;




siteRouter.use(express.static(path.join(__dirname, '../../client/build')));

siteRouter.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/build/index.html'));
});

