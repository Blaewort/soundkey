//handle all api requests for the applicatiom

function fetchChord(notation) {
    console.log(notation);
    return fetch('http://localhost:5000/chordAPI/getChord/d').then(response => response.json);
}

export { fetchChord }