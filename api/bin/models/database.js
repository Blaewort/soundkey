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

async function fetchPreparedStatement(sql, params){
    return new Promise((resolve, reject) => {
        pool.execute(sql, params, function (error, results) {
            if (error) {
                console.log("FetchPreparedStatement error: " + error);
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
    //console.log("notes");
    //console.log(notes);
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
async function getChords(obj, root = null, category = null, searchString = "", noteOffset = 0) {
    console.log("made it here");
    console.log('\n',"GetChords(",obj,",",root,",",category,",",noteOffset,")");

    let notes = null;

    console.log("objd");
    console.log(obj);
    console.log("obj^");

    let noteConstraint;

    if (obj !== null) { //TODO: all these things below are only being validated if we have an obj to limit us? doesnt validate otherwise
        try{
            notes = formatLookupInput(obj);
            validateNotesInput(root);
            validateCategoryInput(category);
        } catch(err){
            return err;
        }

        //if lacking both root and category, then we can't add AND because it's the first and only item after WHERE
        const andStr = (root && category) ? `AND ` : ``; //this should anticipate the text search which will have no root or category


        noteConstraint = `HAVING COUNT(CASE 
                                            WHEN cn.note IN ("` + notes.join('","') + `") THEN 1
                                        END) = COUNT(DISTINCT cn.note)`;
                                        
        /* noteConstraint = `HAVING COUNT(CASE 
                                        WHEN cn.note IN ("` + notes.join('","') + `") THEN 1
                                    END) = LEAST(COUNT(DISTINCT cn.note), ?)`;*/
    }

    else { //obj is null
        noteConstraint = ``;
    }

    const hasAnyConditions = (!category && !root && !obj) ? `` : `WHERE`;

    console.log("Validation passed");
    
    category = category !== null ? 'c.category = "' + category + '" AND ':  '';

    root = root !== null ? 'c.root_note = "' + root + '"':  '';

    let sql = `SELECT
        c.name,
        c.symbol,
        c.root_note,
        JSON_ARRAYAGG(cn.note) AS notes
    FROM
        chords c
    INNER JOIN chord_has_note cn
        ON c.symbol = cn.chord_symbol
        AND c.root_note = cn.root_note
    ` + hasAnyConditions + `
        ` + category + root + `
        
    GROUP BY
        c.name, c.symbol, c.root_note
    -- Only select chords that contain notes from the allowed list
    `+ noteConstraint+`;`;


    console.log(sql);
    let qResults = await fetchSQL(sql);
    let results = [];
    qResults.forEach(ele => {
        results.push(Chord.chordFromNotation(ele.symbol));
    });
    console.log(results);
    return results;
}

function validateGroupID(id) {
    if (!Number.isInteger(id)) {throw new Error ("groupID must be an integer");}
}


async function getScales(chordToLimitBy, root, groupID) { 
    console.log("inside database.js getScales");

    const limitByChord = chordToLimitBy ? true : false;

    validateNotesInput(root);
    validateGroupID(groupID);

    let sql = `
    SELECT
        scale.name,
        scale.root_note,
        GROUP_CONCAT(sn.note ORDER BY
            CASE
            WHEN sn.note >= ? THEN 1 -- Root Note alphabetical order starting on root note from navnote selection
                ELSE 2
            END,
            sn.note ASC) AS notes
    FROM
        scales scale
    INNER JOIN scale_has_note sn
            ON scale.name = sn.scale_name
            AND scale.root_note = sn.root_note
    WHERE
            scale.root_note = ? AND scale.group_id = ? -- root comes from navnote selection, group_id comes from state.scaleGroupSelection
    GROUP BY
        scale.name, scale.root_note
    `;

    
    let qResults;

    if (limitByChord) { 
        const notesLimiter = formatLookupInput(chordToLimitBy);
        const placeholders = notesLimiter.map(() => '?').join(', ');
        const constrainerStr = `HAVING COUNT(CASE WHEN sn.note IN (${placeholders}) THEN 1 END) = LEAST(COUNT(DISTINCT sn.note),?) -- matches all notes in chord if match toggle, which may not be`;
        sql += constrainerStr; 
        
        console.log(sql);
        console.log("sql^");
        console.log('Parameters:', [root, root, groupID, ...notesLimiter, notesLimiter.length]);

        qResults = await fetchPreparedStatement(sql, [root, root, groupID, ...notesLimiter, notesLimiter.length]);
    } else {
        qResults = await fetchPreparedStatement(sql, [root, root, groupID]);

    }

    console.log(qResults);
    console.log("qResults^");

    let results = [];
    qResults.forEach(ele => {
        const noteNameList = ele.notes.split(",");
        try{
            const scale = Scale.fromSimple(ele.root_note, ele.name, noteNameList);
            results.push(scale);
        } catch(err) {
            console.log("RUH ROH RAGGY");
            throw err;
        }
    });
    return results;
}


//should noteValue just be a note instead? it would prevent a lookup that we could do on the client instead
//obj is either an array of notes or a chord/scale object
async function getScaleGroups(obj, root, type){
    const typeLookupTable = {
        "Pentatonic": 5,
        "Hexatonic":  6,
        "Heptatonic": 7,
        "Octatonic":  8,
        "Dodecatonic": 12,
    };

    let notesLimiter;
    let noteConstraintStr = ``;
    if (obj) {
        notesLimiter = formatLookupInput(obj);
        noteConstraintStr = `AND COUNT(CASE WHEN sn.note IN ("` + notesLimiter.join('","') + `") THEN 1 END) = `+ notesLimiter.length +` -- matches all notes in chord if match toggle, which may not be`;
        
    } 

    const SCALE_LENGTH = typeLookupTable[type];
    if (!SCALE_LENGTH) {throw new Error("Invalid SCALE_LENGTH");}

    let sql = `
        SELECT 
            DISTINCT(scale.group_id) as id,
            sg.name AS name 
        FROM 
            scales scale
        JOIN scale_has_note sn
            ON scale.name = sn.scale_name
            AND scale.root_note = sn.root_note
        JOIN scale_groups sg
            ON scale.group_id = sg.id 
        WHERE
            scale.root_note = '`+ root +`' -- root note from note nav selection
        GROUP BY 
            scale.name, scale.root_note
        HAVING 
            COUNT(sn.note) = `+ SCALE_LENGTH +` -- note count from radio
            `+ noteConstraintStr+ `
        ORDER BY 
            scale.group_id ASC;
    `;

    console.log(sql);


    let results = await fetchSQL(sql);
    return results;
}

//ARG is a chord or notes array
// RETURN should be an array of chords that have N-1 amount of matching notes but the same amount of notes. Meaning [C,E,G] might return [[C,F,G], [C,D,G], [C,Eb,G], [D,E,G], etc...]
// USE user can see chord alterations 1 step away
async function getChordExtensions(baseChord, root = null, category = null, scaleToLimitBy) {
    console.log("inside DATABASE.JS getChordExtensions");

    let notes;
    if (baseChord !== null) {
        try{
            notes = formatLookupInput(baseChord);
            validateNotesInput(root);
            validateCategoryInput(category);
        } catch(err){
            return err;
        }
    }

    let constrainStr = ``;
    if(scaleToLimitBy) {
        let limiterNotes = formatLookupInput(scaleToLimitBy);
        constrainStr = `AND COUNT(CASE WHEN chn.note IN ("` + limiterNotes.join('","') + `") THEN 1 END) = `+ (notes.length+1) +` `;
    }

    console.log(notes);
    console.log("getChordExtensions NOTES^");

    //get baseChord note count
    const noteCount = notes.length;
    const rootString = root !== null ? 'chord.root_note = "' + root + '"':  '';
    const categoryString = (() => {
        if (!category) {throw error("cant get an extension if there's no category")} 
        // Triad extends to Seven or Six for UX
        if (category === "Triad") {return "(chord.category = 'Seven' OR chord.category = 'Six')";}
        // Thirteen doesn't extend so nonsense string that returns nothing I guess
        if (category === "Thirteen") {return "chord.category = 'ExtensionsForThirteen (None)'";}
        // The rest is simple
        return {
            "Seven": "chord.category = 'Nine'",
            "Nine": "chord.category = 'Eleven'",
            "Eleven": "chord.category = 'Thirteen'"
        }[category] || "chord.category = 'ERROR: invalid chord category in getChordExtensions'";
    })();

    let sql = `
    SELECT 
        chn.chord_symbol,
        chn.root_note
    FROM 
        chord_has_note chn
    JOIN 
        chords chord ON chord.symbol = chn.chord_symbol
    WHERE 
        `+ rootString +`
        AND
        `+ categoryString +`
    GROUP BY 
        chn.chord_symbol, 
        chn.root_note
    HAVING 
        COUNT(*) = `+ (noteCount+1) +`  -- number of notes in the target chords
        AND SUM(CASE WHEN chn.note IN ("` + notes.join('","') + `") THEN 1 ELSE 0 END) = `+ noteCount +`  -- Number of matching notes in source chord (all of them)
        `+ constrainStr +`
        ;`;

    console.log(sql);
    console.log("sql^");

    let qResults = await fetchSQL(sql);
    let results = [];

    //console.log(qResults);
    //console.log("qResults^");
    qResults.forEach(ele => {
        console.log(ele.chord_symbol);
        console.log("ele.chordSymbol^");
        results.push(Chord.chordFromNotation(ele.chord_symbol));
    });
    return results;
}
 
//ARG is a chord or notes array
// RETURN should be an array of chords that have N-1 amount of matching notes but the same amount of notes. Meaning [C,E,G] might return [[C,F,G], [C,D,G], [C,Eb,G], [D,E,G], etc...]
// USE user can see chord alterations 1 step away
async function getChordAlterations(baseChord, scaleToLimitBy) {
    console.log("inside getChordAlterations");

    let notes;
    if (baseChord !== null) {
        try{
            notes = formatLookupInput(baseChord);
            //validateNotesInput(root);
            //validateCategoryInput(category);
        } catch(err){
            return err;
        }
    }

    let constrainStr = ``;
    if(scaleToLimitBy) {
        let limiterNotes = formatLookupInput(scaleToLimitBy);
        constrainStr = `AND COUNT(CASE WHEN chn.note IN ("` + limiterNotes.join('","') + `") THEN 1 END) = `+ notes.length +` `;
    }

    console.log(notes);
    console.log("getChordAlterations NOTES^");

    //get baseChord note count
    const noteCount = notes.length;


    let sql = `
    SELECT 
        chn.chord_symbol,
        chn.root_note
    FROM 
        chord_has_note chn
    GROUP BY 
        chn.chord_symbol, 
        chn.root_note
    HAVING 
        COUNT(*) = `+ noteCount +` 
        AND SUM(CASE WHEN chn.note IN ("` + notes.join('","') + `") THEN 1 ELSE 0 END) = `+ (noteCount-1) +`  -- Number of matching notes in your chord minus 1
        `+ constrainStr +`
    ORDER BY 
        CASE 
            WHEN chn.root_note >= "`+ baseChord[0] +`" THEN 1 -- Root Note alphabetical order starting on root note of chord being altered
            ELSE 2
        END,
    chn.chord_symbol; -- alphanumerical order`;
  

    console.log(sql);
    console.log("sql^");

    let qResults = await fetchSQL(sql);
    let results = [];

    //console.log(qResults);
    //console.log("qResults^");
    qResults.forEach(ele => {
        console.log(ele.chord_symbol);
        console.log("ele.chordSymbol^");
        results.push(Chord.chordFromNotation(ele.chord_symbol));
    });

    console.log(results);
    console.log("results^");
    return results;
}

async function getChordAppendments(baseChord, scaleToLimitBy) {
    console.log("inside DATABASE.JS getChordAppendments");

    let notes;
    if (baseChord !== null) {
        try{
            notes = formatLookupInput(baseChord);
        } catch(err){
            return err;
        }
    }

    let constrainStr = ``;
    if(scaleToLimitBy) {
        let limiterNotes = formatLookupInput(scaleToLimitBy);
        constrainStr = `AND COUNT(CASE WHEN chn.note IN ("` + limiterNotes.join('","') + `") THEN 1 END) = `+ (notes.length+1) +` `;
    }

    console.log(notes);
    console.log("getChordAppendments NOTES^");

    //get baseChord note count
    const noteCount = notes.length;


    let sql = `
    SELECT 
        chn.chord_symbol,
        chn.root_note
    FROM 
        chord_has_note chn
    GROUP BY 
        chn.chord_symbol, 
        chn.root_note
    HAVING 
        COUNT(*) = `+ (noteCount+1) +`  -- number of notes in the target chords
        AND SUM(CASE WHEN chn.note IN ("` + notes.join('","') + `") THEN 1 ELSE 0 END) = `+ noteCount +`  -- Number of matching notes in source chord (all of them)
        `+ constrainStr +`
    ORDER BY 
        CASE 
            WHEN chn.root_note >= "`+ baseChord[0] +`" THEN 1 -- Root Note alphabetical order starting on root note of chord being altered
            ELSE 2
        END,
    chn.chord_symbol; -- alphanumerical order`;

    console.log(sql);
    console.log("sql^");

    let qResults = await fetchSQL(sql);
    let results = [];

    //console.log(qResults);
    //console.log("qResults^");
    qResults.forEach(ele => {
        console.log(ele.chord_symbol);
        console.log("ele.chordSymbol^");
        results.push(Chord.chordFromNotation(ele.chord_symbol));
    });
    return results;
}

async function getChordDeductions(baseChord, scaleToLimitBy) {
    console.log("inside DATABASE.JS getChordDeductions");

    let notes;
    if (baseChord !== null) {
        try{
            notes = formatLookupInput(baseChord);
        } catch(err){
            return err;
        }
    }

    let constrainStr = ``;
    if(scaleToLimitBy) {
        let limiterNotes = formatLookupInput(scaleToLimitBy);
        constrainStr = `AND COUNT(CASE WHEN chn.note IN ("` + limiterNotes.join('","') + `") THEN 1 END) = `+ (notes.length-1) +` `;
    }

    console.log(notes);
    console.log("getChordDeductions NOTES^");

    //get baseChord note count
    const noteCount = notes.length;

    let sql = `
    SELECT 
        chn.chord_symbol,
        chn.root_note
    FROM 
        chord_has_note chn
    GROUP BY 
        chn.chord_symbol, 
        chn.root_note
    HAVING 
        COUNT(*) = `+ (noteCount-1) +`  -- number of notes in the target chords
        AND SUM(CASE WHEN chn.note IN ("` + notes.join('","') + `") THEN 1 ELSE 0 END) = `+ (noteCount-1) +`  -- Number of matching notes in source chord (all of them)
        `+ constrainStr +`
    ORDER BY 
        CASE 
            WHEN chn.root_note >= "`+ baseChord[0] +`" THEN 1 -- Root Note alphabetical order starting on root note of chord being altered
            ELSE 2
        END,
    chn.chord_symbol; -- alphanumerical order`;

    console.log(sql);
    console.log("sql^");

    let qResults = await fetchSQL(sql);
    let results = [];

    //console.log(qResults);
    //console.log("qResults^");
    qResults.forEach(ele => {
        console.log(ele.chord_symbol);
        console.log("ele.chordSymbol^");
        results.push(Chord.chordFromNotation(ele.chord_symbol));
    });
    return results;
}
 
//ARG is a scale or notes array
// RETURN should be an array of scales that have N-1 amount of matching notes but the same amount of notes. Meaning [C,E,G] might return [[C,F,G], [C,D,G], [C,Eb,G], [D,E,G], etc...]
async function getScaleAlterations(baseScale, chordToLimitBy) {
    console.log("inside getScaleAlterations");

    let notes;
    if (baseScale !== null) {
        try{
            notes = formatLookupInput(baseScale);
            //validateNotesInput(root);
            //validateCategoryInput(category);
        } catch(err){
            return err;
        }
    }

    let constrainStr = ``;
    if(chordToLimitBy) {
        let limiterNotes = formatLookupInput(chordToLimitBy);
        constrainStr = `AND COUNT(CASE WHEN sn.note IN ("` + limiterNotes.join('","') + `") THEN 1 END) = `+ limiterNotes.length +` `;
    }

    let sql = `
    SELECT 
        scale.name,
        scale.root_note,
        GROUP_CONCAT(sn.note ORDER BY 
            CASE 
                WHEN sn.note >= scale.root_note THEN 1 -- Order note list based on root of scale
                ELSE 2
            END,
            sn.note ASC
        ) AS notes
    FROM 
        scales scale
    JOIN scale_has_note sn
        ON scale.name = sn.scale_name
        AND scale.root_note = sn.root_note
    GROUP BY 
        scale.name, scale.root_note
    HAVING 
        COUNT(sn.note) = `+ notes.length +` -- note count of the scale we are altering
        AND COUNT(CASE WHEN sn.note IN ("` + notes.join('","') + `") THEN 1 END) = `+ (notes.length-1) +` -- Note list from the scale we are altering, matching n-1 notes
        `+ constrainStr +`
    ORDER BY 
        CASE 
            WHEN scale.root_note >= '`+ baseScale[0] +`' THEN 1 -- Root Note alphabetical order starting on root note of scale being altered
            ELSE 2
        END,
    scale.root_note ASC;`

    console.log(sql);

    let qResults = await fetchSQL(sql);
    let results = [];

    qResults.forEach(ele => {
        const noteNameList = ele.notes.split(",");
        try{
            const scale = Scale.fromSimple(ele.root_note, ele.name, noteNameList);
            results.push(scale);
        } catch(err) {
        }
    });
    return results;
}

async function getScaleAppendments(baseScale, chordToLimitBy) {
    console.log("inside getScaleAppendments");

    console.log(baseScale);
    console.log("baseScale^")

    let notes;
    if (baseScale !== null) {
        try{
            notes = formatLookupInput(baseScale);
            //validateNotesInput(root);
            //validateCategoryInput(category);
        } catch(err){
            return err;
        }
    }

    let constrainStr = ``;
    if(chordToLimitBy) {
        let limiterNotes = formatLookupInput(chordToLimitBy);
        constrainStr = `AND COUNT(CASE WHEN sn.note IN ("` + limiterNotes.join('","') + `") THEN 1 END) = `+ limiterNotes.length +` `;
    }

    let sql = `
    SELECT 
        scale.name,
        scale.root_note,
        GROUP_CONCAT(sn.note ORDER BY 
            CASE 
                WHEN sn.note >= scale.root_note THEN 1 -- Order note list based on root of scale
                ELSE 2
            END,
            sn.note ASC
        ) AS notes
    FROM 
        scales scale
    JOIN scale_has_note sn
        ON scale.name = sn.scale_name
        AND scale.root_note = sn.root_note
    GROUP BY 
        scale.name, scale.root_note
    HAVING 
        COUNT(sn.note) = `+ (notes.length+1) +` -- (the count of scale we are altering) plus 1
        AND COUNT(CASE WHEN sn.note IN ("` + notes.join('","') + `") THEN 1 END) = `+ notes.length +` -- Number of matching notes in source scale (all (scale.notes.length)of them)
        `+ constrainStr +`
    ORDER BY 
        CASE 
            WHEN scale.root_note >= '`+ baseScale[0] +`' THEN 1 -- Root Note alphabetical order starting on root note of scale being altered
            ELSE 2
        END,
    scale.root_note ASC;`

    console.log(sql);


    let qResults = await fetchSQL(sql);
    let results = [];

    qResults.forEach(ele => {
        const noteNameList = ele.notes.split(",");
        try{
            const scale = Scale.fromSimple(ele.root_note, ele.name, noteNameList);
            results.push(scale);
        } catch(err) {
        }
    });
    return results;
}

async function getScaleDeductions(baseScale, chordToLimitBy) {
    console.log("inside getScaleDeductions");

    console.log(baseScale);
    console.log("baseScale^")

    let notes;
    if (baseScale !== null) {
        try{
            notes = formatLookupInput(baseScale);
            //validateNotesInput(root);
            //validateCategoryInput(category);
        } catch(err){
            return err;
        }
    }

    let constrainStr = ``;
    if(chordToLimitBy) {
        let limiterNotes = formatLookupInput(chordToLimitBy);
        constrainStr = `AND COUNT(CASE WHEN sn.note IN ("` + limiterNotes.join('","') + `") THEN 1 END) = `+ limiterNotes.length +` `;
    }

    let sql = `
    SELECT 
        scale.name,
        scale.root_note,
        GROUP_CONCAT(sn.note ORDER BY 
            CASE 
                WHEN sn.note >= scale.root_note THEN 1 -- Order note list based on root of scale
                ELSE 2
            END,
            sn.note ASC
        ) AS notes
    FROM 
        scales scale
    JOIN scale_has_note sn
        ON scale.name = sn.scale_name
        AND scale.root_note = sn.root_note
    GROUP BY 
        scale.name, scale.root_note
    HAVING 
        COUNT(sn.note) = `+ (notes.length-1) +` -- note count of the scale we are altering minus 1
        AND COUNT(CASE WHEN sn.note IN ("` + notes.join('","') + `") THEN 1 END) = `+ (notes.length-1) +` -- Number of matching notes in source scale (all (scale.notes.length-1)of them)
        `+ constrainStr +`
    ORDER BY 
        CASE 
            WHEN scale.root_note >= '`+ baseScale[0] +`' THEN 1 -- Root Note alphabetical order starting on root note of scale being altered
            ELSE 2
        END,
    scale.root_note ASC;`

    console.log(sql);


    let qResults = await fetchSQL(sql);
    let results = [];

    qResults.forEach(ele => {
        const noteNameList = ele.notes.split(",");
        try{
            const scale = Scale.fromSimple(ele.root_note, ele.name, noteNameList);
            results.push(scale);
        } catch(err) {
        }
    });
    return results;
}

async function getScaleRotations(root, scaleToRotate) {
    console.log("inside getScaleRotations");

    validateNotesInput(root);
    let notes = formatLookupInput(scaleToRotate);

    let sql = `
    SELECT 
        s.name, 
        s.root_note, 
        GROUP_CONCAT(
            sn.note 
            ORDER BY 
            CASE WHEN sn.note >= s.root_note THEN 1 -- Order note list based on root of scale
            ELSE 2 END, 
            sn.note ASC
        ) AS notes 
    FROM 
        scales s 
        INNER JOIN scale_has_note sn ON s.name = sn.scale_name 
        AND s.root_note = sn.root_note 
    WHERE 
        s.root_note != "`+ root + `" -- root of the selected scale
    GROUP BY 
        s.name, 
        s.root_note 
    HAVING 
        COUNT(*) = `+ notes.length +` -- note count of selected scale
        AND COUNT(
            CASE WHEN sn.note IN ("` + notes.join('","') + `") THEN 1 -- note list of selected chord
            END
        ) = `+ notes.length +` -- note count of selected scale
    ORDER BY 
        CASE WHEN s.root_note >= "`+ root +`" THEN 1 -- root note of scale selected
        ELSE 2 END, 
    s.root_note ASC;
    `;

    console.log(sql);


    let qResults = await fetchSQL(sql);
    let results = [];

    qResults.forEach(ele => {
        const noteNameList = ele.notes.split(",");
        try{
            const scale = Scale.fromSimple(ele.root_note, ele.name, noteNameList);
            results.push(scale);
        } catch(err) {
        }
    });
    return results;
}

async function getChordRotations(root, chordToRotate) {
    console.log("inside getChordRotations");

    validateNotesInput(root);
    let notes = formatLookupInput(chordToRotate);

    let sql = `
    SELECT 
        chn.chord_symbol, 
        chn.root_note 
    FROM 
        chord_has_note chn 
    WHERE 
        chn.root_note != "`+ root +`" -- root note of selected chord
    GROUP BY 
        chn.chord_symbol, 
        chn.root_note 
    HAVING 
        COUNT(*) = `+ notes.length +` -- note count of selected chord
        AND COUNT(
            CASE WHEN chn.note IN ("` + notes.join('","') + `") THEN 1 -- note list of selected chord
            END
        ) = `+ notes.length +`  -- note count of selected chord
    ORDER BY 
        CASE WHEN chn.root_note >= "`+ root + `" THEN 1 -- root note of chord selected
        ELSE 2 END, 
    chn.root_note ASC;
    `;

    console.log(sql);


    let qResults = await fetchSQL(sql);
    let results = [];

    qResults.forEach(ele => {
        console.log(ele.chord_symbol);
        console.log("ele.chordSymbol^");
        results.push(Chord.chordFromNotation(ele.chord_symbol));
    });
    return results;
}

async function getScalesFromUserString(objectLimiter, userSelectedScaleNotes, userString) {
    console.log("inside getScalesFromUserString");

    let limiterNotes;
    let selectedScaleNotes;
    let noteConstraint = ``;

    console.log(userSelectedScaleNotes);
    console.log("userSelectedScaleNotes^"); //okay this is passing

    if (objectLimiter !== null && objectLimiter !== undefined) {
        try{
            limiterNotes = formatLookupInput(objectLimiter);
        } catch(err){
            return err;
        }
        noteConstraint = `COUNT(CASE WHEN sn.note IN ("`+ limiterNotes.join('","') +`") THEN 1 END) = 3 -- notes in MATCH_CHORD and number of matching notes in MATCH_CHORD_NOTES
                         AND `;
    }


    let orderBySelectedScale = ``;
    if (userSelectedScaleNotes !== null && userSelectedScaleNotes !== undefined) {
        const selectedScaleNotes = userSelectedScaleNotes ? formatLookupInput(userSelectedScaleNotes) : null;
        orderBySelectedScale = `CASE 
            WHEN scale.root_note >= '`+ selectedScaleNotes[0] +`' THEN 1 -- Root Note alphabetical order starting on root note of scale user currently has selected (if any)
            ELSE 2
        END,`
    }

    let sql = `
    SELECT 
        scale.name,
        scale.root_note,
        GROUP_CONCAT(sn.note ORDER BY 
            CASE 
                WHEN sn.note >= scale.root_note THEN 1 -- Order note list based on root of scale
                ELSE 2
            END,
            sn.note ASC
        ) AS notes,
        CONCAT(scale.root_note, ' ', scale.name) AS full_name
    FROM 
        scales scale
    JOIN scale_has_note sn
        ON scale.name = sn.scale_name
        AND scale.root_note = sn.root_note
    GROUP BY 
        scale.name, scale.root_note
    HAVING 
        `+ noteConstraint + `
        full_name LIKE '%`+ userString +`%'
    ORDER BY 
        `+ orderBySelectedScale +`
        scale.root_note ASC;`

    console.log(sql);


    let qResults = await fetchSQL(sql);
    let results = [];

    qResults.forEach(ele => {
        const noteNameList = ele.notes.split(",");
        try{
            const scale = Scale.fromSimple(ele.root_note, ele.name, noteNameList);
            results.push(scale);
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
    s.name,
    s.mode_id,
    s.root_note,
    GROUP_CONCAT(sn.note) as notes
    FROM
    scales s
    INNER JOIN scale_has_note sn ON s.root_note = sn.root_note and s.name = sn.scale_name
    WHERE
    sn.scale_name = ANY (
        SELECT
        name 
        FROM
        scale_has_note
        where
        note IN ` + notesListString + `
        group by 
        name
        HAVING count(note) >= ` + noteslength + `
    ) AND  sn.root_note = ANY (
        SELECT
        root_note
        FROM
        scale_has_note
        where
        note IN ` + notesListString + `
        group by 
        name
        HAVING count(note) >= ` + noteslength + `
    )
    GROUP BY
    sn.scale_name, sn.root_note`;
    let qResults = await fetchSQL(sql);
    let results = [];
    qResults.forEach(ele => {
        try{
            results.push(new Scale.Scale(ele.root_note ,ele.mode_id,ele.name ));
        } catch(err) {
        }
    });
    return results;
}

module.exports = { 
    getChords,
    getScaleGroups,
    getScales,
    getChordExtensions,
    getChordAlterations,
    getChordAppendments,
    getChordDeductions,
    getChordRotations,
    getScaleAlterations,
    getScaleAppendments,
    getScaleDeductions,
    getScaleRotations,
    getScalesFromUserString
 };
