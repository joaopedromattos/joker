const userDataReducer = (state={name:"", email:"", authId:"", studies: []}, action) => {

    switch (action.type) {
        case "STORE":
            return {
                authId: action.authId,
                email: action.email,
                name: action.name,
                studies: action.studies
            };
    
        default:
            return state;
    }

}

export default userDataReducer;