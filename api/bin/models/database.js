const chordExp = require('chord-expressions');
const Chord = require('chord-expressions').Chord;
const Scale = require('chord-expressions').Scale;
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

function validateLookupInput(obj){
    let notes = obj.notes ? obj.notes : obj;
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
    notes.forEach(note =>{
        if(noteNames.findIndex(name => name === note) === -1){
            throw("Invalid Note: " + note);
        }
    });

}

//ARG is a chord or notes array
// RETURN should be an arry of scales that have ALL notes the chord does plus any extras
// USE user can see a full list of highly compatible scales for their chord
function getScalesFromChord(chord) {
    
}

//ARG is a chord or notes array
// RETURN should be an array of chords that have ALL notes the chord does plus any extras
// USE user can see chords with added tones
async function getChordsFromChord(chord, maxNotes = 12) {
    let notes = chord.notes ? chord.notes : chord;
    validateLookupInput(notes);
    
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
              HAVING count(note) >= ` + notes.length + `
            )
          GROUP BY
            cn.chord_symbol
          HAVING Count(cn.note) <= ` + maxNotes ;

          async function fetchChords(notes){
            return new Promise((resolve, reject) => {
                pool.query(sql, function (error, results, fields) {
                    if (error) {
                        console.log(error);
                        reject(error);
                    };
                    resolve(results);
                });
            });
        }
        
        let qResults = await fetchChords(notes);
        let results = [];
        qResults.forEach(ele => {
            results.push(Chord.chordFromNotation(ele.chord_symbol));
        });
        return results;
}
 
//ARG is a scal eor notes array
// RETURN should be an array of scales that have ALL notes the scale does plus any extras
// USE user can see chords with added tones (we may only want this to be 1 extra note so if chord.notes.length is 3 then find 4 note chords)
function getScalesFromScale(scale) {
 
 
}
 
//ARG is a chord or notes array
// RETURN should be an array of chords that have N-1 amount of matching notes but the same amount of notes. Meaning [C,E,G] might return [[C,F,G], [C,D,G], [C,Eb,G], [D,E,G], etc...]
// USE user can see chord alterations 1 step away
async function getChordAlterations(chord,minNotes = 1,maxNotes = 1, noteDiff) {
    let notes = chord.notes ? chord.notes : chord;
    validateLookupInput(notes);
    async function fetchChords(notes){
        return new Promise((resolve, reject) => {
            pool.query('SELECT * FROM `chord_has_note`', function (error, results, fields) {
                if (error) {
                    console.log(error);
                    reject(error);
                };
                resolve(results);
            });
        });
    }
    let qResults = await fetchChords(notes);
    let chords = {};
    var results = [];
    qResults.forEach(function(item){
        if(chords[item.chord_symbol] === undefined){
            chords[item.chord_symbol] = [item.note_name];
        } else {
            chords[item.chord_symbol].push(item.note_name);
        }
    });
    Object.entries(chords).forEach(entry => {
        const [key, value] = entry;
        var count = value.reduce(function(accumulator,value){
            if(notes.findIndex(note => note === value) > -1){
                return accumulator + 1;
            } else {
                return accumulator;
            }
        }, 0);
        let lng = value.length ;
        if((lng-count) >= minNotes && (lng-count) <= maxNotes && lng === (notes.length - noteDiff)){
            results.push(key);
        }
      });
    return results;
 
}
 
//ARG is a scale or notes array
// RETURN should be an array of scales that have N-1 amount of matching notes but the same amount of notes. Meaning [C,E,G] might return [[C,F,G], [C,D,G], [C,Eb,G], [D,E,G], etc...]
// USE user can see chord alterations 1 step away
function getScaleAlterations(scale) {
 
 
}
 
//ARG is a scale or notes array
// RETURN should be an array of scales that have N-1 amount of matching notes AND N-1 amount of notes. Meaning [C,E,G] might return [[C, G], [E,G], [C,E], etc...]
// USE user can see all the different ways of viewing their scale through the subsets
function getSubscalesFromScale(scale) {
 
 
}
async function test(){
   let r = await getChordsFromChord(["A", "C#", "E"]);
   console.log(r);
}
test();

module.exports = { getScalesFromChord, getChordsFromChord, getScalesFromScale, getChordAlterations, getScaleAlterations, getSubscalesFromScale }
