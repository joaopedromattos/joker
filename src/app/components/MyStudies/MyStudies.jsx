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
import FileCopyRounded from '@material-ui/icons/FileCopyRounded';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import Grid from '@material-ui/core/Grid';
import axios from 'axios';
import Loading from "../Loading/Loading";
import BinaryDialog from "../Dialogs/BinaryDialog";
import FormDialog from "../Dialogs/FormDialog";
import ThreeDotsMenu from "../ThreeDotsMenu/ThreeDotsMenu";
import Button from "@material-ui/core/Button";
import NewStudyForm from "../NewStudyForm/NewStudyForm";
import { CopyToClipboard } from 'react-copy-to-clipboard';

const styles = theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        flexGrow: 1,
        width: '100%',
    },
    card: {
        minWidth: 275,
    },
    demo: {
        display: 'flex',
        flexWrap: 'wrap',
        flexGrow: 1,
        width: '100%',
                
    },
    title: {
        margin: `${theme.spacing.unit * 4}px 0 ${theme.spacing.unit * 2}px`,
    },
    studyTitle:{
        paddingLeft: '3%',
        paddingRight: '3%'
    },
    button: {
        margin: theme.spacing.unit,
    }, 
    studiesList: {
        width: '100%',
    }, 
    
});

class MyStudies extends React.Component {

    constructor(props){
        super(props)
        this.state = {    
                    
            studies: this.props.studiesDataReducer.studies, 
            openDeleteDialog: false,
            openEditDialog: false,
            editIndex: 0,
            deleteIndex: 0,
            localUrl: "http://localhost:1337",

        }
    }

    // Function that retrieves researcher's studies when he/she logs in.
    getStudies(){

        // Building the api url to retrieve all studies...
        let url = "http://localhost:3000/studies/_id=";
        this.props.userDataReducer.studies.map((study, index) => {

            if (index === this.props.userDataReducer.studies.length - 1){
                url += study

            }else{
                url += study + ","
            }                   

        })

        // The api requisition itself...
        axios.get(url).then(res => {
            this.setState({studies: res.data})
            this.props.studiesDataStoreAction({studies: res.data})
        }, res => {
            this.props.studyRetrieveError()
        })
    }
    
    openDeleteDialog = (index) => {

        console.log("Dentro de open dialog: ", index)
        
        
        this.setState({ openDeleteDialog: true, deleteIndex: index })


    }
    
    openEditDialog = (index) => {
        this.setState({openEditDialog: true, editIndex: index })

    }

    closeEditDialog = () => {
        this.setState({openEditDialog: false })
    }

    denialDelete = () => {

        this.setState({ openDeleteDialog:false })

    }

    
    updateStudy = (newStudyName, newStudyObjective, newCards) => {
        let url = "http://localhost:3000/studies/_id=" + this.props.userDataReducer.studies[this.state.editIndex];
        axios.put(url, {
            name: newStudyName, 
            objective: newStudyObjective, 
            cards: newCards
        }).then(res => {            

            if (res.data.message){
                this.props.studyEditedError()
                return;
            }

            let studiesRedux = this.props.studiesDataReducer.studies
            studiesRedux[this.state.editIndex] = res.data

            this.props.studiesDataStoreAction({ studies: [...studiesRedux] })  

            this.setState({ studies: [...studiesRedux], openEditDialog: false });

            this.props.studyEditedOk()
            
        }, err => {
            this.setState({ studies: [...studiesRedux], openEditDialog: false });
            this.props.studyEditedError()
        })
    }

    // This function returns a function call. It exists because we can't pass an array of functions to a component. 
    // So if you want to add to ThreeDotsMenu component a new function, you should add it's functionality here.
    menuOptions = (action, index) => {
        console.log("index: ", index)
        // Add to this swich the functionality you want.
        switch (action) {
            case 0:
                // 'Copiar link para estudo' has a callback on CopyToClipboard component.
                break;        
            case 1:
                // 'Editar estudo'...
                this.openEditDialog(index)
                break;
            case 2:
                this.openDeleteDialog(index)
                break;
            default: 
                return;
        }
    }
    
    granted = () => {
        let url = "http://localhost:3000/studies/_id=";  
        
        
        // Handling deletion with api...
        
        console.log("What we requested...", this.state.studies[this.state.deleteIndex]._id)
        axios.delete(url + this.state.studies[this.state.deleteIndex]._id).then((res) => {
            
            let removedItem = this.state.studies[this.state.deleteIndex]
            const newItems = this.state.studies.filter((value) => {
                return value !== removedItem;
            })

            // Updating our reducers to make sure everything is synced up... 
            // this.props.studiesDataStoreAction({studies: [...newItems]})
            this.props.userDataStoreAction(res.data)
            this.props.studiesDataStoreAction({studies: [...newItems]})  
                      
            

            // Just closing our dialog and exhibiting a successful message.
            this.setState({studies:[...newItems], openDeleteDialog: false });

            this.props.studyDeletedOk();
            

        }, (res) => {

        
            // In case of failure on deletion, we just close our dialog and exhibit a failure message...
            this.setState({ openDeleteDialog: false });

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

                    {/* <Typography align='center'>
                            Carregando estudos...
                    </Typography> */}

                    <Loading></Loading>

                    

                </div>
            )
        }else{

            if (!this.props.userDataReducer.studies.length){

                return (
                    <div className={classes.root}>
                        
                        <Grid
                            container
                            direction="row"
                            justify="center"
                            alignItems="center"
                        >
                            <Grid item>
                                <h1 className="centerTitles">Você ainda não tem estudos. É possível criar um estudo na aba "Novo estudo".</h1>
                            </Grid>
                        </Grid>
                        
                    </div>
                )

            }else{
                
                
                return(               
                            
                    <div className={classes.demo}>
                        
                        
                        <div>    
                            {/* This Dialog is exhibited when we try to delete a study */}
                            <BinaryDialog title={"Tem certeza de que deseja excluir este estudo?"} 
                                        open={this.state.openDeleteDialog}
                                        text={`Depois de excluído, você não poderá recuperar os dados do seu estudo.`} 
                                        denialButton="CANCELAR" 
                                        grantedButton="EXCLUIR"
                                        granted={() => this.granted()}
                                        denial={() => this.denialDelete()}
                                        changeConfirmationColor={true}>
                            </BinaryDialog>

                            {/* We exhibit this when trying to edit a study */}
                            <FormDialog
                                open={this.state.openEditDialog}
                                cancel={() => this.closeEditDialog()}
                                title={"Editar estudos"}
                                submitButtonHandler={() => {return;}}
                                submitButton={''}
                                formFields={<NewStudyForm newStudy={(newStudyName, newstudyObjective, newCards) => this.updateStudy(newStudyName, newstudyObjective, newCards)}
                                    firstButton={'Editar estudo '}
                                    name={this.state.studies[this.state.editIndex].name}
                                    objective={this.state.studies[this.state.editIndex].objective}
                                    cards={this.state.studies[this.state.editIndex].cards} />}>
                            </FormDialog>


                        </div>          

                        
                        {/* Here is the list of studies...  */}
                        <List className={classes.studiesList}>            
                            {
                                this.state.studies.map((study, index) => (
                                    <ListItem key={index} divider={true}>                                       
                                        <ListItemText
                                            primary={study.name}
                                            secondary={study.objective}
                                        />
                                        <ListItemSecondaryAction>
                                            {/* Three dots menu that's in the same line of the study title. */}
                                            <ThreeDotsMenu studyLables={[<CopyToClipboard text={this.state.localUrl + '/b/' + study._id} onCopy={() => this.props.studyLinkCopied()}><span>Copiar link para o estudo</span></CopyToClipboard>, "Alterar estudo", "Excluir estudo"]} callbacks={(action, index) => this.menuOptions(action, index)} elementIndex={index} />
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