import React from 'react';
import PropTypes from 'prop-types';
import { studiesDataStoreAction } from "../../actions/admin/studiesDataStoreAction";
import { userDataStoreAction } from "../../actions/admin/userDataStoreAction";
import { compose } from "redux";
import { connect } from "react-redux"; 
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
                    
            studies: this.props.studiesDataReducer.studies, 
            openDialog: false,
            deleteIndex: 0,                  

        }
    }

    // // Basically, this component cycle event is just responsible for updating our view in case of a study addition...
    // componentDidUpdate(prevProps, prevState){

    //     // Checking if our props 'userDataReducer' has changed...
    //     // If affirmative, we have to fetch the new study to this view.
    //     if (this.props.userDataReducer.studies.length > this.state.studies.length ){

    //         // Declaring our api url...
    //         let urlRequest = "http://localhost:3000/studies/_id=";

    //         // Taking the last element on our studies vector (the last one to be added, by mongo's default...)            
    //         let newStudyUrl = this.props.userDataReducer.studies[this.props.userDataReducer.studies.length - 1]
        

    //         urlRequest += newStudyUrl;

    //         // API request to get info about this last study...
    //         axios.get(urlRequest).then(res => {
    //             this.setState({ studies: [...this.state.studies[this.state.studies.length - 1], res.data] })
    //             this.props.studiesDataStoreAction({ studies: [...this.state.studies[this.state.studies.length - 1], res.data] })
    //         }, res => {
    //             this.props.studyRetrieveError()
    //         })

            
    //     }

    // }

    getStudies(){

        let url = "http://localhost:3000/studies/_id=";

        this.props.userDataReducer.studies.map((study, index) => {

            if (index === this.props.userDataReducer.studies.length - 1){
                url += study

            }else{
                url += study + ","
            }                   

        })

        console.log("Estudos que vamos pegar: " , url)

        axios.get(url).then(res => {
            this.setState({studies: res.data})
            this.props.studiesDataStoreAction({studies: res.data})
        }, res => {
            this.props.studyRetrieveError()
        })
    }

    openDialog = (index) => {

        console.log("Dentro de open dialog: ", index)
        
        
        this.setState({ openDialog: true, deleteIndex: index })


    }

    denial = () => {

        this.setState({ openDialog:false })

    }
    
    granted = () => {
        let url = "http://localhost:3000/studies/_id=";  
        
        
        // Handling deletion with api...
        
        console.log("What we requested...", this.state.studies[this.state.deleteIndex]._id)
        axios.delete(url + this.state.studies[this.state.deleteIndex]._id).then((res) => {
            
            
            console.log("DELETE RESPONSE: ", res)
            // Now, I'll just update our local data...
            let aux = this.state.studies
            aux.splice(this.state.deleteIndex, 1)
            this.setState({studies: aux})

            // Updating our reducers to make sure everything is synced up... 
            this.props.studiesDataStoreAction({studies: aux})
            this.props.userDataStoreAction(res.data)
            
            

            // Just closing our dialog and exhibiting a successful message.
            this.setState({ openDialog: false });

            this.props.studyDeletedOk();
            

        }, (res) => {

            console.log("Error: ", res)

            // In case of failure on deletion, we just close our dialog and exhibit a failure message...
            this.setState({ openDialog: false });

            this.props.studyDeletedError();
            
        })


        

    }   
    
 
    render() {
        const { classes } = this.props;
        const { secondary } = this.state;

        // Checking if our props 'userDataReducer' has changed...
        // If affirmative, we have to fetch the new study to this view.
        if (this.state.studies && this.props.userDataReducer.studies && this.props.userDataReducer.studies.length > this.state.studies.length) {

            // Declaring our api url...
            let urlRequest = "http://localhost:3000/studies/_id=";

            // Taking the last element on our studies vector (the last one to be added, by mongo's default...)            
            let newStudyUrl = this.props.userDataReducer.studies[this.props.userDataReducer.studies.length - 1]


            urlRequest += newStudyUrl;

            // API request to get info about this last study...
            axios.get(urlRequest).then(res => {
                this.setState({ studies: this.state.studies.concat(res.data) })                
                this.props.studiesDataStoreAction({ studies: this.state.studies })
            }, res => {
                this.props.studyRetrieveError()
            })


        }

        // If our studies are null and there are studies to retrieve, we should get them... 
        if (!this.state.studies && this.props.userDataReducer.studies && this.props.userDataReducer.studies.length ){
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

            if (!this.props.userDataReducer.studies.length){

                return (
                    <div>

                        <Typography variant='h1' align='center'>
                            Você ainda não tem estudos.
                        </Typography>



                    </div>
                )

            }else{
                
                
                return(               
                            
                    <div className={classes.demo}>

                        <BinaryDialog title={"Tem certeza de que deseja excluir este estudo?"} 
                                    open={this.state.openDialog}
                                    text={`Depois de excluído, você não poderá recuperar os dados do seu estudo.`} 
                                    denialButton="CANCELAR" 
                                    grantedButton="EXCLUIR"
                                    granted={() => this.granted()}
                                    denial={() => this.denial()}
                                    changeConfirmationColor={true}>
                        </BinaryDialog>


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
                                            <IconButton aria-label="Delete" color="secondary" onClick={() => this.openDialog(index)}>
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
}

const mapStateToProps = state => ({
    ...state
});

const mapDispatchToProps = dispatch => ({
    userDataStoreAction: (userData) => dispatch(userDataStoreAction(userData)),
    studiesDataStoreAction: (studiesData) => dispatch(studiesDataStoreAction(studiesData)),

});

MyStudies.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default compose(connect(mapStateToProps, mapDispatchToProps), withStyles(styles))(MyStudies);