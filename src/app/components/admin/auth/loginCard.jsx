import React, {Component} from 'react';
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { withStyles } from '@material-ui/core/styles';
import '../../App.scss';
import './loginCard.scss';
import firebase from 'firebase';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import Link from "react-router";
import Grid from '@material-ui/core/Grid';

// Paper styling.
const styles = theme => ({
    root: {
      ...theme.mixins.gutters(),
      paddingTop: theme.spacing.unit * 2,
      paddingBottom: theme.spacing.unit * 2,
      
      
    },

    square: false
    
});

// StyledFirebaseAuth styling.
const uiConfig = {
    signInFlow: "popup",
    signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.FacebookAuthProvider.PROVIDER_ID,
        
    ],
    callbacks: {
        signInSuccessWithAuthResult: () => false
    }
}



function LoginCard(props){
    const { classes, className } = props;

    return(
        <div className="login-card">
            <Paper className={classes.root} >                
                <Grid
                    container
                    direction="column"
                    justify="center"
                    alignItems="center"
                >
                    <Grid item>
                        <h1 >Faça login para acessar o Joker:</h1>
                    </Grid>

                    <br />

                    <Grid item>                    
                        <StyledFirebaseAuth


                            uiConfig={uiConfig}
                            firebaseAuth={firebase.auth()}
                        />   
                    </Grid>
                </Grid>

                

                      
            </Paper>
        </div>
    )
}

export default withStyles(styles)(LoginCard);