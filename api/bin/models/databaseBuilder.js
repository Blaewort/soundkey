// run to intialize database

const Settings = require("../../settings");
const mysql = require('mysql2');
const dbSettings = Settings[Settings.env].db;
const chordExp = require('chord-expressions');

    var con = mysql.createConnection({
        host: dbSettings.host,
        user:dbSettings.user,
        password: dbSettings.password
    });


    con.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");
        con.query("CREATE DATABASE IF NOT EXISTS sound_key", function (err, result) {
            if (err) throw err;
            console.log("Database created");
        });
        con.changeUser({database : 'sound_key'}, function(err) {
            if (err) throw err;
          });
        const chords = chordExp.generateChords();
        con.query("CREATE TABLE IF NOT EXISTS chords (chord_name VARCHAR(255), chord_symbol VARCHAR(255), root_note VARCHAR(255), PRIMARY KEY (chord_symbol,root_note))", function (err, result) {
            if (err) throw err;
            console.log("chords table created");
        });
        con.query("CREATE TABLE IF NOT EXISTS notes (note VARCHAR(255) NOT NULL PRIMARY KEY )", function (err, result) {
            if (err) throw err;
            console.log("notes table created");
        });
        con.query("INSERT IGNORE INTO notes(note) VALUES ('A'),('B'),('C'),('D'),('E'),('F'),('G'),('Ab'),('Bb'),('Cb'),('Db'),('Eb'),('Fb'),('Gb'),('A#'),('B#'),('C#'),('D#'),('E#'),('F#'),('G#')", function (err, result) {
            if (err) throw err;
            console.log("pupulate notes table");
        });
        con.query("CREATE TABLE IF NOT EXISTS chord_has_note (chord_symbol VARCHAR(255), root_note VARCHAR(255), note VARCHAR(255), PRIMARY KEY (chord_symbol, root_note, note))", function (err, result) {
            if (err) throw err;
            console.log("chord has notes table created");
        });
        chords.forEach(element =>{
            let sql = "INSERT IGNORE INTO chords (chord_name, chord_symbol, root_note) VALUES(?,?,?)"
            con.query(sql,[element.name, element.sym, element.root.name ] , function(err,result){
                if (err) throw err;
            });
            element.notes.forEach(note => {
                con.query("INSERT IGNORE INTO chord_has_note (chord_symbol, root_note, note) VALUES(?,?,?)", [element.sym, element.root.name,note.name ], function(err,result){
                    if (err) throw err;
                });
            });
        });

        con.query("CREATE TABLE IF NOT EXISTS scales (scale_name VARCHAR(255), scale_mode VARCHAR(255), root_note VARCHAR(255) ,PRIMARY KEY (scale_name,root_note))", function (err, result) {
            if (err) throw err;
            console.log("scales table created");
        });
        con.query("CREATE TABLE IF NOT EXISTS scale_has_note (scale_name VARCHAR(255), root_note VARCHAR(255), note VARCHAR(255), PRIMARY KEY (scale_name, root_note, note))", function (err, result) {
            if (err) throw err;
            console.log("scale has notes table created");
        });
        const scales = chordExp.generateScales();
        scales.forEach(element =>{
            let sql = "INSERT IGNORE INTO scales (scale_name, scale_mode, root_note) VALUES(?,?,?)"
            con.query(sql,[element.scaleName, element.modeName, element.rootNote.name ] , function(err,result){
                if (err) throw err;
            });
            element.notes.forEach(note => {
                con.query("INSERT IGNORE INTO scale_has_note (scale_name, root_note, note) VALUES(?,?,?)", [element.scale_name , element.rootNote.name , note.name ], function(err,result){
                    if (err) throw err;
                });
            });
        });
      });