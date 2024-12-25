import React, {Component} from 'react';

import Header from '../../header/index';
import Footer from '../../footer/index';

class EmptyController extends Component{

    constructor(props) {
        super(props);
    }

    render() {
        const header = <Header engaged={false} leftIcon="logo" />;
        const footer = <Footer onUpdate={this.props.footer.onUpdate} selectedValue={this.props.footer.selectedValue} />;

        return <>
            <div class="top-controls">
                {header}
            </div>
            
            <div class="issues-known">
                <span>Known Issues</span>
                <ul>
                <li>Go to chord nav, turn off toggle, select a note that is not in the selected scale, like F, then turn the toggle back on. It doesn't fetch data...sometimes!
                    Obviously issue probably has something to do with enforceSelection function which updates to a matching scale note when toggle is turned on again
                    </li>
                    <li>Chord text search is not working correctly for mods without parentheses (Example: D7b5 should be D7 with the existing 5 in D7 flatted, but is instead D7(add b5).
                        You can work around this with parentheses like D7(b5), D7(b5,b13), D7(b5)(add 13) to get the necessary chord
                    </li>
                    <li>Sus chord extensions broken (?) after you hit the sus note an octave up (Example: B9sus4 cant extend to B9sus13 (should it?) because 
                        B11sus4 technically doesn't exist to bridge the gap—11 is 4— so if it actually makes sense to bridge B9sus4 to B13sus4 where 13sus4 just has no 11, is unclear</li>
                    <li>11sus4, maj11sus4 and 9sus2, maj9sus4 chords shouldn't exist but are being created by the generator and put into the database. Just remove those entries from chord_gen
                        But on that note, for the potentially (up for debate) valuable existence of 13sus4, 11sus2 chords and etc we could be making those but right now they are in chord_gen with 11 and 4 dupes and 9 and 2 dupes, woops
                    </li>
                </ul> 
            </div>

            <div class="bottom-controls">
                {footer}
            </div>
        </>
    }
}

export default EmptyController;
