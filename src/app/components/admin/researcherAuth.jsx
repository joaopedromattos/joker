import React, {Component} from 'react';
// import OAuth from "./oAuth";
import '../App.scss';
import './researcherAuth.scss';
import LoginCard from "./loginCard";
import firebase from 'firebase';


// Paper styling function to export values that will be converted 
// into CSS when inside of Material-UI

var config = {
    apiKey: "AIzaSyB_NnYnVtuvvLQizJfjC3_3dlJ0hhfSXuU",
    authDomain: "joker-1544625266228.firebaseapp.com",
    databaseURL: "https://joker-1544625266228.firebaseio.com",
    projectId: "joker-1544625266228",
    storageBucket: "joker-1544625266228.appspot.com",
    messagingSenderId: "20089384964"
};

firebase.initializeApp(config);


class ResearcherAuth extends Component{
    state = {
        isSignedIn: Boolean,
        user: {}
    }

    signInCallBack = callBackUser => {
        this.setState({user : callBackUser})
    }

    

    componentDidMount = () => {
        this.state.isSignedIn = false;
        firebase.auth().onAuthStateChanged(usr => {
            this.setState({ isSignedIn: !!usr, user: usr })

          
            
        })
    }
    
    render(){

        return (
            <div className="login-card">
                {
                    this.state.isSignedIn ? (
                        <span>
                            <div>Signed In!</div>
                            <button onClick={() => firebase.auth().signOut()}>Sign out!</button>
                            <h1>Welcome {this.state.user.displayName}</h1>
                        </span>
                    ) : <LoginCard />
                }
                
            </div>
        )


        
    }
    
}


export default ResearcherAuth;