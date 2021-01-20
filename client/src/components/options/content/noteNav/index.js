import React from 'react';
import './styles.css'

class NoteNav extends component {
    render() {
        return (
            <div className="note_navigator">
                <div class="arrow_container left">
                    <button type="button">
                        <i class="fas fa-arrow-left"></i>
                    </button>
                </div>

                <div class="note_container">
                    <div class="note_select">
                        <select>
                            <option value="0">&#127925;</option>
                            <option value="1">A</option>
                            <option value="2">A#</option>
                            <option value="3">B</option>
                            <option value="4">C</option>
                            <option value="5">C#</option>
                            <option value="6">D</option>
                            <option value="7">D#</option>
                            <option value="8">E</option>
                            <option value="9">F</option>
                            <option value="10">F#</option>
                            <option value="11">G</option>
                            <option value="12">G#</option>
                        </select>   
                    </div>
                </div>

                <div class="arrow_container right">
                    <button type="button">
                        <i class="fas fa-arrow-right"></i>
                    </button>
                </div>
        </div>
        );
    }
}
  
export default NoteNav;



        
  

