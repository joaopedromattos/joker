import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import FolderIcon from '@material-ui/icons/Folder';
import DeleteIcon from '@material-ui/icons/Delete';
import axios from 'axios';
import Loading from "../Loading/Loading";
import BinaryDialog from "../Dialogs/BinaryDialog";

const styles = theme => ({
    root: {
        flexGrow: 1,
        maxWidth: 752,
    },
    demo: {
        backgroundColor: theme.palette.background.paper,
    },
    title: {
        margin: `${theme.spacing.unit * 4}px 0 ${theme.spacing.unit * 2}px`,
    },
});





class MyStudies extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            
            studies: null, 
            openDialog: false,     

        }
    }

    // Basically, this component cycle event is just responsible for updating our view in case of a study addition...
    componentDidUpdate(prevProps){

        // Checking if our props 'user' has changed...
        if (this.props.user.studies.length > prevProps.user.studies.length ){

            // Declaring our api url...
            let urlRequest = "http://localhost:3000/studies/_id=";

            // Taking the last element on our studies vector (the last one to be added, by mongo's default...)            
            let newStudyUrl = this.props.user.studies[this.props.user.studies.length - 1]
        

            urlRequest += newStudyUrl;

            // API request to get info about this last study...
            axios.get(urlRequest).then(res => {
                this.setState({ studies: [...this.state.studies[this.state.studies.length - 1], res.data] })
            }, res => {
                this.props.studyRetrieveError()
            })

            
        }
    }

    getStudies(){

        console.log("Study retrieving => Get studies")        
        let url = "http://localhost:3000/studies/_id=";

        this.props.user.studies.map((study, index) => {

            if (index === this.props.user.studies.length - 1){
                url += study

            }else{
                url += study + ","
            }       
            

        })

        axios.get(url).then(res => {
            this.setState({studies: res.data})
        }, res => {
            this.props.studyRetrieveError()
        })
    }

    


    render() {
        const { classes } = this.props;
        const { secondary } = this.state;

        if (!this.state.studies){
            this.getStudies()
            return (
                <div>

                    <Typography variant='h1' align='center'>
                            Carregando estudos...
                    </Typography>
                    <Loading></Loading>

                    

                </div>
            )
        }else{
            return(               
                        
                <div className={classes.demo}>

                    { 

                        this.state.openDialog ? (
                            <BinaryDialog ></BinaryDialog>
                        ):(
                            <span></span>
                        )

                    }

                    <List >                        
                        {
                            this.state.studies.map((study, index) => (

                                <ListItem key={index}>
                                    <ListItemAvatar>
                                        <Avatar>
                                            <FolderIcon />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={study.name}
                                        secondary={study.objective}
                                    />
                                    <ListItemSecondaryAction>
                                        <IconButton aria-label="Delete" color="secondary" onClick={(index) => this.openDialog(index)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                </ListItem>

                            ))
                            
                        }                    
                        
                    </List>
                </div>
            
            )

        }




    }
}

MyStudies.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MyStudies);