const ListStateManager = {};




// returns list state object that nullifies the appropriate list (the one we are about to get new data for)
// if there's nothing to nullify then you get null or nothing back which can be used to update state.list or leave it alone like return {...state, list: returnValue || state.list}
ListStateManager.getNullifiedListState = function getNullifiedListState(state, overrideStr) {
    // We nullify the appropriate list so that we can indicate to user that data is loading and we need an empty list to reach ListArea component
    // for that to happen. TODO in future, maybe we can check to see if our query for current state-coordinates is the same as last time, 
    // in which case we can return null in order to avoid unnecessary database calls

    if (state.focus === "chord") {
        return getNullifiedListStateInChordFocus(state);
    } else if (state.focus === "scale") {
        return getNullifiedListStateInScaleFocus(state, overrideStr);
    }
}

function getNullifiedListStateInChordFocus(state) {
    let nullifiedList = null; 

    const listToNull = {
        "navsearch": "nav",
        "edit": "edit"

    }[state.view.chord];

    if (listToNull) {
        nullifiedList = {
            ...state.list,
            [state.focus]: {
                ...state.list[state.focus],
                [listToNull]: null
            }
        };
    }
    return nullifiedList;
}

function getNullifiedListStateInScaleFocus(state, overrideStr) {
    let nullifiedList = null;


    let listToNull = {
        "navsearchmode": "navModes",
        "navsearch": "navGroups" ,
        "edit": "edit"
    }[state.view.scale];

    // need this for scale group item click so instead of clearing sclae group item list we clear mode item list 
    if (overrideStr && overrideStr === "in_nav_groups_but_clear_nav_modes") {
        listToNull = "navModes";
    }

    if (listToNull) {
        nullifiedList = {
            ...state.list,
            [state.focus]: {
                ...state.list[state.focus],
                [listToNull]: null
            }
        };
    }
    return nullifiedList;
}








export default ListStateManager;