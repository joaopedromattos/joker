export const userDataStoreAction = (userData) => {

    return {
        type: "STORE", 
        name: userData.name,
        email: userData.email,
        authId: userData.authId,
        studies: userData.studies
    }

}