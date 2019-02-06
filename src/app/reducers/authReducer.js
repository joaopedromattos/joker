const authReducer = (state={authenticated:false}, action) => {

    switch (action.type) {
        case "AUTH":
            return {
                authenticated : action.authenticated
            }  
                     
    
        default:
            return state;
    }

}

export default authReducer;