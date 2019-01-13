import React, {Component} from 'react';
import '../../App.scss';
import './researcherAuth.scss';
import LoginCard from "./loginCard";
import firebase from 'firebase';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types'
import { connect } from "react-redux";
import { loginAction } from "../../../actions/admin/loginAction";
import { logoutAction } from "../../../actions/admin/logoutAction";
import axios from "axios";



// Firebase configs. Won't show in navigation files. 
var config = {
    apiKey: "AIzaSyB_NnYnVtuvvLQizJfjC3_3dlJ0hhfSXuU",
    authDomain: "joker-1544625266228.firebaseapp.com",
    databaseURL: "https://joker-1544625266228.firebaseio.com",
    projectId: "joker-1544625266228",
    storageBucket: "joker-1544625266228.appspot.com",
    messagingSenderId: "20089384964"
};

const axiosPostConfig = {
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
}



firebase.initializeApp(config);

class ResearcherAuth extends Component{

    state = {
        isSignedIn: Boolean,
        user: {}
    }

    

    // Here is the plan:
    // If a user has already signed into the application, he/she will already be in our database...
    // ... so we can just fetch this data and pass to our dashboard.
    // However, he/she might have signed in for the first time...
    // ... in this case, we insert this new user in our database :) 
    getUserInsideDatabase(){

        
        
        axios.get('http://localhost:3000/researchers/email=' + this.state.user.email).then( res => {
            console.log("First database response: ", res);
            if (!(res.data.length)){
                // User not in our database
                axios.post('http://localhost:3000/researchers', {

                    authId: this.state.user.uid,
                    email: this.state.user.email,
                    name: this.state.user.displayName,
                    // studies : []
                } ,).then(res => {
                            console.log("Usuario nao se encontrava na DB\n, agora ele ja fora inserido.")
                            console.log("User not in data base response: ", res)
                            return res
                        }
                    )
            }else{
                return res
            }
        });
        
    }
    
    // This function is responsible for updating our user state.
    componentDidMount = () => {
        this.state.isSignedIn = false;

        firebase.auth().onAuthStateChanged(usr => {

            this.setState({ isSignedIn: !!usr, user: usr })   

            if (this.state.isSignedIn){

                this.props.authReducer.authenticated ? (this.props.logoutAction()) : (this.props.loginAction())
                this.getUserInsideDatabase()

                // console.log("USER", this.state.user)
                // console.log("Deu certo?", deuCerto)
                console.log('http://localhost:3000/researchers/email=' + this.state.user.email)

            }
                     
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
                        // <Link to='/researcherDashboard' />
                    ) : (
                        <LoginCard />
                    )
                }
                
            </div>
        )


        
    }
    
}

const mapStateToProps = state => ({
    ...state
});

const mapDispatchToProps = dispatch => ({
    loginAction: () => dispatch(loginAction),
    logoutAction: () => dispatch(logoutAction)
});


export default connect(mapStateToProps, mapDispatchToProps)(ResearcherAuth);