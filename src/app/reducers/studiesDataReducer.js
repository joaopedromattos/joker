const studiesDataReducer = (state={studies: null}, action) =>{

    switch (action.type) {
        case "STUDIES_REDUCER_STORE":
            return {
                studies: action.studies
            }
    
        default:
            return state;
    }

}

export default studiesDataReducer;