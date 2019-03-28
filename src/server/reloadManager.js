export const loadState = () => {
    try{
        const serializedState = localStorage.getItem('state');
        return (serializedState === null) ? undefined : JSON.parse(serializedState);
    }catch(err){
        console.log("Local storage load error: ", err);
        return undefined;
    }
}

export const saveState = (state) => {
    try{
        const serializedState = JSON.stringify(state);
        localStorage.setItem('state', serializedState);
    }catch(err){
        console.log("Local storage save error: ", err);
    }
}