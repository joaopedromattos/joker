import React, { useEffect } from "react";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { connect } from "react-redux";
import { compose } from "redux";
import { withStyles } from "@material-ui/core/styles";
import "../../App.scss";
import "./loginCard.scss";
import firebase from "firebase";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import Link from "react-router";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";

// Paper styling.
const styles = theme => ({
    root: {
        ...theme.mixins.gutters(),
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2)
    },

    square: false,

    progress: {
        margin: theme.spacing(2)
    }
});

// StyledFirebaseAuth styling.
const uiConfig = {
    signInFlow: "popup",
    signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.FacebookAuthProvider.PROVIDER_ID
    ],
    callbacks: {
        signInSuccessWithAuthResult: () => false
    }
};

function LoginCard(props) {
    const { classes, className } = props;

    var config = {
        apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
        authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
        databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
        projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
        storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID
    };

    // This function checks if a firebase app is already defined in our code...
    // We need this kind of verification since firebase doesn't
    // allow us to redefine our app on each new user session (For obvious security reasons).
    const firebaseAuthWrapper = () => {
        if (firebase.apps.length === 0) {
            firebase.initializeApp(config);
        }

        return firebase.auth();
    };

    return (
        <div className="login-card">
            <Paper className={classes.root}>
                <Grid
                    container
                    direction="column"
                    justify="center"
                    alignItems="center"
                >
                    <Grid item>
                        <h1>Faça login para acessar o Joker:</h1>
                    </Grid>

                    <br />

                    <Grid item>
                        <StyledFirebaseAuth
                            uiConfig={uiConfig}
                            firebaseAuth={firebaseAuthWrapper()}
                        />
                    </Grid>

                    <Grid item>
                        <Button href="/">Retornar à página inicial</Button>
                    </Grid>

                    <Grid item>
                        <h4>
                            Não armazenaremos nenhum dado pessoal além de seu
                            nome e e-mail.
                        </h4>
                    </Grid>
                </Grid>
            </Paper>
        </div>
    );
}

export default withStyles(styles)(LoginCard);
