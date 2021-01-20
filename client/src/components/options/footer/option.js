import React from 'react';
import './option.css'

class FooterOption extends Component {
    render() {
        return (
            <div className="option">
                <<button type="button">
                    <i class="fas fa-chess-rook"></i>
                </button>
                <label></label>
            </div>
        );
  }
}
  export default FooterOption;



        /* this examples
<div class="option" data-designation="chords">
    <button type="button">
      <i class="fas fa-chess-rook"></i>
    </button>
    <label>Chords</label>
</div>

<div class="option" data-designation="scales">
    <button type="button">
      <i class="fas fa-chess-bishop"></i>
    </button>
    <label>Scales</label>
</div>

<div class="option" data-designation="settings">
   <button type="button">
     <i class="fas fa-cog"></i>
  </button>
  <label>Settings</label>
</div>

*/