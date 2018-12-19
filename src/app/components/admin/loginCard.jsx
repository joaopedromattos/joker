import React, {Component} from 'react';
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { withStyles } from '@material-ui/core/styles';
// import OAuth from "./oAuth";
import '../App.scss';
import './loginCard.scss';
import firebase from 'firebase';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

const styles = theme => ({
    root: {
      ...theme.mixins.gutters(),
      paddingTop: theme.spacing.unit * 2,
      paddingBottom: theme.spacing.unit * 2,
      
    },
    
});

const uiConfig = {
    signInFlow: "popup",
    signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    ],
    callbacks: {
        signInSuccessWithAuthResult: () => false
    }
}

function LoginCard(props){
    const { classes } = props;

    return(
        <div className="login-card">
            <Paper className={classes.root} >
                <Typography variant="h5" component="h3">
                    Faça login para acessar o Joker:
                </Typography>

                <br/>
                
                <StyledFirebaseAuth

                          
                    uiConfig={uiConfig}
                    firebaseAuth={firebase.auth()}
                />         
            </Paper>
        </div>
    )
}

export default withStyles(styles)(LoginCard);