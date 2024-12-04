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

        noteConstraint = andStr + `NOT EXISTS (
            SELECT 1
            FROM chord_has_note cn2
            WHERE cn2.chord_symbol = c.chord_symbol
            AND cn2.note NOT IN ("` + notes.join('","') + `")
        )`;

    }

    else { //obj is null
        noteConstraint = ``;
    }

    const hasAnyConditions = (!category && !root && !obj) ? `` : `WHERE`;

    console.log("Validation passed");
    
    category = category !== null ? 'c.category = "' + category + '" AND ':  '';

    root = root !== null ? 'c.root_note = "' + root + '"':  '';

    let sql = `SELECT
        c.chord_name,
        c.chord_symbol,
        c.root_note,
        JSON_ARRAYAGG(cn.note) AS notes
    FROM
        chords c
    INNER JOIN chord_has_note cn
        ON c.chord_symbol = cn.chord_symbol
        AND c.root_note = cn.root_note
    ` + hasAnyConditions + `
        ` + category + root + `
        -- Only select chords that contain notes from the allowed list
        `+ noteConstraint + `
    GROUP BY
        c.chord_name, c.chord_symbol, c.root_note;`;


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
        "pentatonic": 5,
        "hexatonic":  6,
        "heptatonic": 7,
        "octatonic":  8
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
async function getChordExtensions(baseChord, root = null, category = null) {
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
        chords chord ON chord.chord_symbol = chn.chord_symbol
    WHERE 
        `+ rootString +`
        AND
        `+ categoryString +`
    GROUP BY 
        chn.chord_symbol, 
        chn.root_note
    HAVING 
        COUNT(*) = `+ (noteCount+1) +`  -- number of notes in the target chords
        AND SUM(CASE WHEN chn.note IN ("` + notes.join('","') + `") THEN 1 ELSE 0 END) = `+ noteCount +`;  -- Number of matching notes in source chord (all of them)`;

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
async function getChordAlterations(baseChord) {
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

async function getChordAppendments(baseChord) {
    console.log("inside DATABASE.JS getChordAppendments");

    let notes;
    if (baseChord !== null) {
        try{
            notes = formatLookupInput(baseChord);
        } catch(err){
            return err;
        }
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

async function getChordDeductions(baseChord) {
    console.log("inside DATABASE.JS getChordDeductions");

    let notes;
    if (baseChord !== null) {
        try{
            notes = formatLookupInput(baseChord);
        } catch(err){
            return err;
        }
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
async function getScaleAlterations(baseScale) {
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

    let sql = `
    SELECT 
        scale.scale_name,
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
        ON scale.scale_name = sn.scale_name
        AND scale.root_note = sn.root_note
    GROUP BY 
        scale.scale_name, scale.root_note
    HAVING 
        COUNT(sn.note) = `+ notes.length +` -- note count of the scale we are altering
        AND COUNT(CASE WHEN sn.note IN ("` + notes.join('","') + `") THEN 1 END) = `+ (notes.length-1) +` -- Note list from the scale we are altering, matching n-1 notes
    ORDER BY 
        CASE 
            WHEN scale.root_note >= '`+ baseScale[0] +`' THEN 1 -- Root Note alphabetical order starting on root note of scale being altered
            ELSE 2
        END,
    scale.root_note ASC;`

    let qResults = await fetchSQL(sql);
    let results = [];

    qResults.forEach(ele => {
        const noteNameList = ele.notes.split(",");
        try{
            const scale = Scale.fromSimple(ele.root_note, ele.scale_name, noteNameList);
            results.push(scale);
        } catch(err) {
        }
    });
    return results;
}

async function getScaleAppendments(baseScale) {
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

    let sql = `
    SELECT 
        scale.scale_name,
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
        ON scale.scale_name = sn.scale_name
        AND scale.root_note = sn.root_note
    GROUP BY 
        scale.scale_name, scale.root_note
    HAVING 
        COUNT(sn.note) = `+ (notes.length+1) +` -- (the count of scale we are altering) plus 1
        AND COUNT(CASE WHEN sn.note IN ("` + notes.join('","') + `") THEN 1 END) = `+ notes.length +` -- Number of matching notes in source scale (all (scale.notes.length)of them)
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
            const scale = Scale.fromSimple(ele.root_note, ele.scale_name, noteNameList);
            results.push(scale);
        } catch(err) {
        }
    });
    return results;
}

async function getScaleDeductions(baseScale) {
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

    let sql = `
    SELECT 
        scale.scale_name,
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
        ON scale.scale_name = sn.scale_name
        AND scale.root_note = sn.root_note
    GROUP BY 
        scale.scale_name, scale.root_note
    HAVING 
        COUNT(sn.note) = `+ (notes.length-1) +` -- note count of the scale we are altering minus 1
        AND COUNT(CASE WHEN sn.note IN ("` + notes.join('","') + `") THEN 1 END) = `+ (notes.length-1) +` -- Number of matching notes in source scale (all (scale.notes.length-1)of them)
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
            const scale = Scale.fromSimple(ele.root_note, ele.scale_name, noteNameList);
            results.push(scale);
        } catch(err) {
        }
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
        scale.scale_name,
        scale.root_note,
        GROUP_CONCAT(sn.note ORDER BY 
            CASE 
                WHEN sn.note >= scale.root_note THEN 1 -- Order note list based on root of scale
                ELSE 2
            END,
            sn.note ASC
        ) AS notes,
        CONCAT(scale.root_note, ' ', scale.scale_name) AS full_name
    FROM 
        scales scale
    JOIN scale_has_note sn
        ON scale.scale_name = sn.scale_name
        AND scale.root_note = sn.root_note
    GROUP BY 
        scale.scale_name, scale.root_note
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
            const scale = Scale.fromSimple(ele.root_note, ele.scale_name, noteNameList);
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

module.exports = { 
    getChords,
    getScales,
    getModes,
    getChordExtensions,
    getChordAlterations,
    getChordAppendments,
    getChordDeductions,
    getScaleAlterations,
    getScaleAppendments,
    getScaleDeductions,
    getScalesFromUserString
 };
