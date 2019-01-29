import React, {Component} from 'react';
import '../../App.scss';
import './researcherAuth.scss';
import LoginCard from "./loginCard";
import firebase from 'firebase';
import PropTypes from 'prop-types'
import { connect } from "react-redux";
import { loginAction } from "../../../actions/admin/loginAction";
import { logoutAction } from "../../../actions/admin/logoutAction";
import axios from "axios";
import { withRouter } from "react-router-dom";




class ResearcherAuth extends Component{

    
    state = {
        isSignedIn: false,
        user: {},
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

                } ,).then(res => {
                            this.setState({user: res.data})
                            console.log("Usuario nao se encontrava na DB\n, agora ele ja fora inserido.")
                            console.log("User not in data base response: ", res)
                            return res
                        }
                    )
            }else{
                this.setState({user: res.data})
                return res
            }
        });
        
    }
    
    // This function is responsible for updating our user state.
    componentDidMount = () => {

        firebase.auth().onAuthStateChanged(usr => {

            this.setState({ isSignedIn: !!usr, user: usr })   

            if (this.state.isSignedIn){

                this.props.authReducer.authenticated ? (this.props.logoutAction()) : (this.props.loginAction())
                this.getUserInsideDatabase()

                console.log('http://localhost:3000/researchers/email=' + this.state.user.email)
                this.props.history.push({
                    pathname: "/researcherDashboard",

                    // We can't pass any kind of data through this next component :(
                    // Basically, react nodes are separated from a single source of react-router-dom, that is,
                    // There is not a father react node encapsulated within withRouter (higher-order react-router-dom component)
                    // For such reason, we're not able to pass data to this route, because it is another react-router-dom instance
                    
                })

            }
                     
        })
    }

   
    
    render(){

        return (
            
            <div className="login-card">
                {
                    // !this.state.isSignedIn ? (
                        // <span>
                        //     <div>Signed In!</div>
                        //     <button onClick={() => firebase.auth().signOut()}>Sign out!</button>
                        //     <h1>Welcome {this.state.user.displayName}</h1>
                            
                        // </span>
                        // <Link to='/researcherDashboard' />
                }
                <LoginCard />
                {/*                         
                        ) : (
                            
                    )
                 */}
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


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ResearcherAuth));