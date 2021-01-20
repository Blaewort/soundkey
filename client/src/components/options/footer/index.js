import React from 'react';
import './styles.css'

class OptFooter extends Component {
    render() {
    return (
        <div className="visual_mod_bar">
            <FooterOption></FooterOption>
            <FooterOption></FooterOption>
            <FooterOption></FooterOption>
        </div>
    );
  }
}
  
  export default OptFooter;



        /* child HTML
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
