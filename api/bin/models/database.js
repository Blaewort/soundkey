const chordExp = require('chord-expressions');
const Chord = require('chord-expressions').Chord;
const Scale = require('chord-expressions').Scale;
const Note = require('chord-expressions').Note;
const Settings = require("../../settings");
const mysql = require('mysql2');
const dbSettings = Settings[Settings.env].db;

const pool = mysql.createPool({
    host: dbSettings.host,
    user:dbSettings.user,
    password: dbSettings.password,
    database: 'sound_key',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

pool.on('acquire', function (connection) {
    console.log('Connection %d acquired', connection.threadId);
});

pool.on('connection', function (connection) {
    console.log('setting SQL mode');
    console.log(connection.modes);
    connection.query('SET sql_mode=only_full_group_by');
});

async function fetchSQL(sql){
    return new Promise((resolve, reject) => {
        pool.query(sql, function (error, results, fields) {
            if (error) {
                console.log("FetchSQL error: " + error);
                reject(error);
            };
            resolve(results);
        });
    });
}

function formatLookupInput(obj){
    let notes;
    
    try{
        notes = obj.notes ? obj.notes.map(ele => {return ele.name}) : obj;
        validateNotesInput(notes);
        return notes;
    } catch(err) {
        throw("Invalid Notes input");
    }
}

function validateNotesInput(obj){
    if(obj === null){
        return;
    }
    let notes = obj.notes ? obj.notes : obj;
    notes = Array.isArray(notes) ? notes : [notes];
    let flag = false;
    const noteNames = [
        "A",
        "A#",
        "B",
        "C",
        "C#",
        "D",
        "D#",
        "E",
        "F",
        "F#",
        "G",
        "G#"
    ];
    console.log("notes");
    console.log(notes);
    notes.forEach(note =>{
        if(noteNames.findIndex(name => name === note) === -1){
            console.log("Invalid Note: " + note);
            throw("Invalid Note: " + note);
        }
    });
    return;
}
const modes = [
    "diatonic",
    "melodic minor",
    "neapolitan major",
    "neapolitan minor",
    "harmonic minor",
    "harmonic major",
    "double harmonic",
    "hungarian major",
    "harmonic lydian"
];

function validateModeInput(mode){
    if(mode === null){
        return;
    }
    if(modes.find(element => element === mode) === undefined){
        console.log("Invalid Mode: ", mode);
        throw("Invalid Mode: ", mode);
    }
}

function validateCategoryInput(category){
    const categories = [
        "Triad",
        "Seven",
        "Nine",
        "Eleven",
        "Thirteen",
        "Six"
    ];
    if (category === null){
        return
    } else if(!category.includes(category)){
        console.log("Invalid Chord category: ", category);
        throw("Invalid Chord category: ", category);
    }
}



//ARG is a chord or notes array
// RETURN should be an array of chords that have ALL notes the chord does plus any extras
// USE user can see chords with added tones
async function getChords(obj, root = null, category = null, noteOffset = 0) {
    console.log('\n',"GetChords(",obj,",",root,",",category,",",noteOffset,")");
    let notes = null;
    try{
        notes = formatLookupInput(obj);
        validateNotesInput(root);
        validateCategoryInput(category);
    } catch(err){
        return err;
    }
    console.log("Validation passed");
    category = category !== null ? 'AND c.category = "' + category + '"':  '';
    console.log("---------------------------------------------cat");
    console.log(category);
    root = root !== null ? 'AND c.root_note = "' + root + '"':  '';
    let newChordLength = '';
    let matchingChordLength = '';
    switch(noteOffset){
        case -1:
            newChordLength = 'HAVING Count(cn.note) <= ' + notes.length - 1;
            break;
        case 0:
            break;
        case 1:
            matchingChordLength = 'HAVING count(note) >= ' + notes.length + 1;
            break;
    };
    let sql = `SELECT
    c.chord_name,
    c.chord_symbol,
    c.root_note,
    GROUP_CONCAT(cn.note) as notes
    FROM
    chords c
    INNER JOIN chord_has_note cn ON c.chord_symbol = cn.chord_symbol
    and c.root_note = cn.root_note
    WHERE
    cn.chord_symbol = ANY (
        SELECT
        chord_symbol
        FROM
        chord_has_note
        where
        note IN ("` + notes.join('","') + `")
        group by 
        chord_symbol
        ` + matchingChordLength + `
    ) ` + category + root + `
    GROUP BY
    cn.chord_symbol` + newChordLength + `,
    c.chord_name,
    c.chord_symbol,
    c.root_note`;
    console.log(sql);
    let qResults = await fetchSQL(sql);
    let results = [];
    qResults.forEach(ele => {
        results.push(Chord.chordFromNotation(ele.chord_symbol));
    });
    console.log(results);
    return results;
}
 
//ARG is a scale or notes array
// RETURN should be an array of scales that have ALL notes the scale does plus any extras
// USE user can see chords with added tones (we may only want this to be 1 extra note so if chord.notes.length is 3 then find 4 note chords)
async function getScales(obj,root = null,mode = null) { 
    let notes = formatLookupInput(obj);
    validateNotesInput(root);
    validateModeInput(mode);
    let notesListString = '("' + notes.join('","') + '")';
    let noteslength = notes.length;
    root = root !== null ? 'AND sn.root_note = "' + root + '"':  '';
    mode = mode !== null ? 'AND sn.scale_mode = "' + mode + '"': '';
    let sql = `SELECT
    s.scale_name,
    s.scale_mode,
    s.root_note,
    GROUP_CONCAT(sn.note) as notes
    FROM
    scales s
    INNER JOIN scale_has_note sn ON s.root_note = sn.root_note and s.scale_name = sn.scale_name
    WHERE
    sn.scale_name = ANY (
        SELECT
        scale_name 
        FROM
        scale_has_note
        where
        note IN ` + notesListString + `
        group by 
        scale_name
        HAVING count(note) >= ` + noteslength + `
    ) AND  sn.root_note = ANY (
        SELECT
        root_note
        FROM
        scale_has_note
        where
        note IN ` + notesListString + `
        group by 
        scale_name
        HAVING count(note) >= ` + noteslength + `
    ) ` + root + mode +
    `
    GROUP BY
    sn.scale_name, sn.root_note`
    `s.scale_name,`
    `s.scale_mode,`
    `s.root_note`;
    let qResults = await fetchSQL(sql);
    let results = [];
    qResults.forEach(ele => {
        try{
            results.push(new Scale.Scale(ele.root_note ,ele.scale_mode,ele.scale_name ));
        } catch(err) {
        }
    });
    return results;
}
//should noteValue just be a note instead? it would prevent a lookup that we could do on the client instead
//obj is either an array of notes or a chord/scale object
async function getModes(root, type = "heptatonic", obj){
    const typeLookupTable = {
        "heptatonic": 7,
        "pentatonic": 5,
        "hexatonic":  6,
        "octatonic":  8,
        "dodecatonic": 12
    };
    let notes = formatLookupInput(obj);
    let notesListString = '("' + notes.join('","') + '")';
    let noteslength = notes.length;
    //TODO: Should scaleLength fail instead of defautling to heptatonic
    let scaleLength = typeLookupTable[type] ? typeLookupTable[type] : 7;
    let sql = `SELECT DISTINCT
    s.scale_mode
  FROM
    scales s
    INNER JOIN scale_has_note sn ON s.root_note = sn.root_note and s.scale_name = sn.scale_name
  WHERE
    sn.scale_mode = ANY (
      SELECT
        scale_mode
      FROM
        scale_has_note
      where
        note IN ` + notesListString + ` and root_note = "` + root + '"'+ `
      group by 
       scale_name
      HAVING count(distinct note) = ` + noteslength + `
    ) AND sn.scale_name = ANY (
      SELECT
        scale_name
      FROM
        scale_has_note
      where
      note IN ` + notesListString + ` and root_note = "` + root + '"'+ `
      group by 
       scale_name
      HAVING count(distinct note) = ` + noteslength + `
    ) AND  sn.root_note = "` + root + '"'+ `
  GROUP BY
    sn.scale_name, sn.root_note
  HAVING Count(sn.note) = ` + scaleLength;
    let results = await fetchSQL(sql);
    return results;
}
 
//ARG is a chord or notes array
// RETURN should be an array of chords that have N-1 amount of matching notes but the same amount of notes. Meaning [C,E,G] might return [[C,F,G], [C,D,G], [C,Eb,G], [D,E,G], etc...]
// USE user can see chord alterations 1 step away
async function getChordAlterations(obj, numberOfNotesToAlterBy = 1) {
    let notes = formatLookupInput(obj);
    let sql = `SELECT
    c.chord_name,
    c.chord_symbol,
    c.root_note,
    GROUP_CONCAT(cn.note) as notes
    FROM
    chords c
    INNER JOIN chord_has_note cn ON c.chord_symbol = cn.chord_symbol
    and c.root_note = cn.root_note
    WHERE
    cn.chord_symbol = ANY (
        SELECT
        chord_symbol
        FROM
        chord_has_note
        where
        note IN ("` + notes.join('","') + `")
        group by 
        chord_symbol
        HAVING count(note) >= ` + (notes.length - numberOfNotesToAlterBy) + `
    )
    GROUP BY
    cn.chord_symbol
    HAVING Count(cn.note) <= ` + maxNotes;
    let qResults = await fetchSQL(sql);
    let results = [];
    qResults.forEach(ele => {
        results.push(Chord.chordFromNotation(ele.chord_symbol));
    });
    return results;
 
}
 
//ARG is a scale or notes array
// RETURN should be an array of scales that have N-1 amount of matching notes but the same amount of notes. Meaning [C,E,G] might return [[C,F,G], [C,D,G], [C,Eb,G], [D,E,G], etc...]
// USE user can see chord alterations 1 step away
async function getScaleAlterations(scale, numberOfNotesToAlterBy = 1) {
    let notes = formatLookupInput(obj);
    let notesListString = '("' + notes.join('","') + '")';
    let noteslength = notes.length - numberOfNotesToAlterBy;
    let sql = `SELECT
    s.scale_name,
    s.scale_mode,
    s.root_note,
    GROUP_CONCAT(sn.note) as notes
    FROM
    scales s
    INNER JOIN scale_has_note sn ON s.root_note = sn.root_note and s.scale_name = sn.scale_name
    WHERE
    sn.scale_name = ANY (
        SELECT
        scale_name 
        FROM
        scale_has_note
        where
        note IN ` + notesListString + `
        group by 
        scale_name
        HAVING count(note) >= ` + noteslength + `
    ) AND  sn.root_note = ANY (
        SELECT
        root_note
        FROM
        scale_has_note
        where
        note IN ` + notesListString + `
        group by 
        scale_name
        HAVING count(note) >= ` + noteslength + `
    )
    GROUP BY
    sn.scale_name, sn.root_note`;
    let qResults = await fetchSQL(sql);
    let results = [];
    qResults.forEach(ele => {
        try{
            results.push(new Scale.Scale(ele.root_note ,ele.scale_mode,ele.scale_name ));
        } catch(err) {
        }
    });
    return results;
}
 
//ARG is a scale or notes array
// RETURN should be an array of scales that have N-1 amount of matching notes AND N-1 amount of notes. Meaning [C,E,G] might return [[C, G], [E,G], [C,E], etc...]
// USE user can see all the different ways of viewing their scale through the subsets
async function getSubscalesFromScale(scale, numberOfNotesToAlterBy = 1 , numberOfMatchingNotesToLeaveOut = 1 ) {
    let notes = formatLookupInput(obj);
    let notesListString = '("' + notes.join('","') + '")';
    let noteslength = notes.length - numberOfNotesToAlterBy;
    let sql = `SELECT
    s.scale_name,
    s.scale_mode,
    s.root_note,
    GROUP_CONCAT(sn.note) as notes
    FROM
    scales s
    INNER JOIN scale_has_note sn ON s.root_note = sn.root_note and s.scale_name = sn.scale_name
    WHERE
    sn.scale_name = ANY (
        SELECT
        scale_name 
        FROM
        scale_has_note
        where
        note IN ` + notesListString + `
        group by 
        scale_name
        HAVING count(note) >= ` + noteslength + `
    ) AND  sn.root_note = ANY (
        SELECT
        root_note
        FROM
        scale_has_note
        where
        note IN ` + notesListString + `
        group by 
        scale_name
        HAVING count(note) >= ` + noteslength + `
    )
    GROUP BY
    sn.scale_name, sn.root_note`;
    let qResults = await fetchSQL(sql);
    let results = [];
    qResults.forEach(ele => {
        try{
            results.push(new Scale.Scale(ele.root_note ,ele.scale_mode,ele.scale_name ));
        } catch(err) {
        }
    });
    return results;
}

module.exports = { getChords, getScales, getModes}
