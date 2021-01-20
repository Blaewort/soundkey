import React from 'react';
import './styles.css'

class ListArea extends Component {
    render () {
        return (
            <div className="list_areao">
                <span>
                    Scales
                </span>
                <ul>
                    <div class="option_container">
                    <li>
                    C Lydian
                    </li>
                    <li>
                    C Lydian Dominant
                    </li>
                    <li>
                    C Lydian Augmented
                    </li>
                    <li>
                    C Lydian Dominant b6
                    </li>
                    <li >
                    C Lydian Dominant b2
                    </li>
                    <li>
                    C Lydian Dominant #2
                    </li>
                    </div>
                </ul>
            </div>
        );
    }
  }
  
  export default ListArea;