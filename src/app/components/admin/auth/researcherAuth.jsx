import React, { Component } from "react";
import "../../App.scss";
import "./researcherAuth.scss";
import LoginCard from "./loginCard";
import { Helmet } from "react-helmet";
import firebase from "firebase";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loginAction } from "../../../actions/admin/loginAction";
import { logoutAction } from "../../../actions/admin/logoutAction";
import { userDataStoreAction } from "../../../actions/admin/userDataStoreAction";
import axios from "axios";
import { withRouter } from "react-router-dom";

class ResearcherAuth extends Component {
    state = {
        isSignedIn: this.props.authReducer,
        user: {}
    };

    // Here is the plan:
    // If a user has already signed into the application, he/she will already be in our database...
    // ... so we can just fetch this data and pass to our dashboard.
    // However, he/she might have signed in for the first time...
    // ... in this case, we insert this new user in our database :)
    getUserInsideDatabase(user) {
        console.log("Getting user inside database...");
        axios
            .get(
                process.env.REACT_APP_ADMIN_API +
                    "/researchers/email=" +
                    user.email
            )
            .then(res => {
                console.log("First database response: ", res);
                if (!res.data.length) {
                    // User not in our database
                    axios
                        .post(
                            process.env.REACT_APP_ADMIN_API + "/researchers",
                            {
                                authId: user.uid,
                                email: user.email,
                                name: user.displayName
                            }
                        )
                        .then(res => {
                            console.log(
                                "User not in data base response: ",
                                res
                            );
                            console.log(
                                "Usuario nao se encontrava na DB\n, agora ele ja fora inserido."
                            );
                            this.setState({ user: res.data[0] });
                            this.props.userDataStoreAction(res.data);
                            return res;
                        });
                } else {
                    this.setState({ user: res.data[0] });
                    this.props.userDataStoreAction(res.data[0]);
                    return res;
                }
            });
    }

    componentDidUpdate() {
        if (this.props.userDataReducer.authId !== "") {
            console.log(this.props.userDataReducer);
            this.props.history.push({
                pathname: "/researcherDashboard"

                // We can't pass any kind of data through this next component :(
                // Basically, react nodes are separated from a single source of react-router-dom, that is,
                // There is not a father react node encapsulated within withRouter (higher-order react-router-dom component)
                // For such reason, we're not able to pass data to this route, because it is another react-router-dom instance
            });
        }
    }

    // This function is responsible for updating our user state.
    componentDidMount() {
        firebase.auth().onAuthStateChanged(usr => {
            console.log("Firebase response:", usr);

            if (usr) {
                this.getUserInsideDatabase(usr);
                this.props.authReducer.authenticated
                    ? this.props.logoutAction()
                    : this.props.loginAction();
            }
        });
    }

    render() {
        return (
            <>
                <Helmet>
                    <title>Login</title>
                </Helmet>
                <LoginCard />
            </>
        );
    }
}

const mapStateToProps = state => ({
    ...state
});

const mapDispatchToProps = dispatch => ({
    loginAction: () => dispatch(loginAction),
    logoutAction: () => dispatch(logoutAction),
    userDataStoreAction: userData => dispatch(userDataStoreAction(userData))
});

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(ResearcherAuth)
);
