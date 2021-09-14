// run to intialize database

const Settings = require("../../settings");
const mysql = require('mysql2');
const dbSettings = Settings[Settings.env].db;
const chordExp = require('chord-expressions');

let con = mysql.createConnection({
    host: dbSettings.host,
    user:dbSettings.user,
    password: dbSettings.password
});

function saveToChordNoteTable(chord) {
    chord.notes.forEach(note => {
        con.query("INSERT IGNORE INTO chord_has_note (chord_symbol, root_note, note) VALUES(?,?,?)", [chord.sym, chord.root.name,note.name ], function(err,result){
            if (err) throw err;
        });
    });
}

function saveToChordTable(chord) {
    let sql = "INSERT IGNORE INTO chords (chord_name, chord_symbol, root_note, category) VALUES(?,?,?,?)"
    con.query(sql,[chord.name, chord.sym, chord.root.name,chord.category] , function(err,result){
        if (err) throw err;
    });
}

function saveChordAndAlterations(chord) {

    saveToChordTable(chord);
    saveToChordNoteTable(chord);

    
    if (chord.alteredChords.mod) {
        chord.alteredChords.mod.forEach(alteredChord => saveChordAndAlterations(alteredChord));
    }
    

    if (chord.alteredChords.add) {
        chord.alteredChords.add.forEach(alteredChord => saveChordAndAlterations(alteredChord));
    }
}

function saveChords() {
    const chords = chordExp.generateChords();
    chords.forEach(chord =>{
        saveChordAndAlterations(chord);
    });
}

function saveScales() {
    const scales = chordExp.generateScales();

    scales.forEach(element =>{
        let sql = "INSERT IGNORE INTO scales (scale_name, scale_mode, root_note) VALUES(?,?,?)"
        con.query(sql,[element.scaleName, element.modeName, element.rootNote.name ] , function(err,result){
            if (err) throw err;
        });
        element.notes.forEach(note => {
            con.query("INSERT IGNORE INTO scale_has_note (scale_name,scale_mode ,root_note, note) VALUES(?,?,?,?)", [element.scaleName ,element.modeName, element.rootNote.name , note.name ], function(err,result){
                if (err) throw err;
            });
        });
    });
}

console.log(dbSettings);

con.connect(function(err) {
    if (err) throw err;

    console.log("Connected!");

    con.query("CREATE DATABASE IF NOT EXISTS sound_key DEFAULT CHARACTER SET utf8 DEFAULT COLLATE utf8_general_ci", function (err, result) {
        if (err) throw err;
        console.log("Database created");
    });
    con.changeUser({database : 'sound_key'}, function(err) {
        if (err) throw err;
    });
    con.query("CREATE TABLE IF NOT EXISTS chords (chord_name VARCHAR(255), chord_symbol VARCHAR(255), root_note VARCHAR(255), category VARCHAR(255), PRIMARY KEY (chord_symbol,root_note)) DEFAULT CHARACTER SET utf8 DEFAULT COLLATE utf8_general_ci", function (err, result) {
        if (err) throw err;
        console.log("chords table created");
    });
    con.query("CREATE TABLE IF NOT EXISTS notes (note VARCHAR(255) NOT NULL PRIMARY KEY ) DEFAULT CHARACTER SET utf8 DEFAULT COLLATE utf8_general_ci", function (err, result) {
        if (err) throw err;
        console.log("notes table created");
    });
    con.query("INSERT IGNORE INTO notes(note) VALUES ('A'),('B'),('C'),('D'),('E'),('F'),('G'),('Ab'),('Bb'),('Cb'),('Db'),('Eb'),('Fb'),('Gb'),('A#'),('B#'),('C#'),('D#'),('E#'),('F#'),('G#')", function (err, result) {
        if (err) throw err;
        console.log("pupulate notes table");
    });
    con.query("CREATE TABLE IF NOT EXISTS chord_has_note (chord_symbol VARCHAR(255), root_note VARCHAR(255), note VARCHAR(255), PRIMARY KEY (chord_symbol, root_note, note)) DEFAULT CHARACTER SET utf8 DEFAULT COLLATE utf8_general_ci", function (err, result) {
        if (err) throw err;
        console.log("chord has notes table created");
    });

    saveChords();

    con.query("CREATE TABLE IF NOT EXISTS scales (scale_name VARCHAR(255), scale_mode VARCHAR(255), root_note VARCHAR(255) ,PRIMARY KEY (scale_name,root_note)) DEFAULT CHARACTER SET utf8 DEFAULT COLLATE utf8_general_ci", function (err, result) {
        if (err) throw err;
        console.log("scales table created");
    });
    con.query("CREATE TABLE IF NOT EXISTS scale_has_note (scale_name VARCHAR(255),scale_mode VARCHAR(255), root_note VARCHAR(255), note VARCHAR(255), PRIMARY KEY (scale_name, scale_mode, root_note, note)) DEFAULT CHARACTER SET utf8 DEFAULT COLLATE utf8_general_ci", function (err, result) {
        if (err) throw err;
        console.log("scale has notes table created");
    });

    saveScales();
    
  });