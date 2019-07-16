import React, { Component } from 'react';
import PropTypes from 'prop-types';
import firebase from 'firebase';
import { connect } from "react-redux";
import { compose } from 'redux';
import { loginAction } from "../../../actions/admin/loginAction";
import { logoutAction } from "../../../actions/admin/logoutAction";
import { userDataStoreAction } from "../../../actions/admin/userDataStoreAction";
import { studiesDataStoreAction } from "../../../actions/admin/studiesDataStoreAction";
import DashboardDrawer from "../../DashboardDrawer/DashboardDrawer";
import MainDrawer from "../../MainContentDashboard/MainDrawer";
import InsertChart from '@material-ui/icons/InsertChartRounded';
import AddCircle from '@material-ui/icons/AddCircle';
import MySnackbarContent from "../../MySnackbarContentWrapper/MySnackbarContent";
import Snackbar from '@material-ui/core/Snackbar';
import { withStyles } from '@material-ui/core/styles';
import NewStudyForm from "../../NewStudyForm/NewStudyForm";
import MyStudies from "../../MyStudies/MyStudies";
import axios from "axios";
import { withRouter } from "react-router-dom";


const styles2 = theme => ({
    margin: {
        margin: theme.spacing(1),
    },
    dashboardBody: {
        backgroundImage: 'none', 
        backgroundColor: 'white',
    }
});


class ResearcherDashboard extends Component {

    constructor(props) {
        super(props)
        
        this.state = {            
            user: this.props.userDataReducer,
            tabs: {
                active: 0,
                elements: [{ // To insert a new tab on the drawer, place it this array...
                    tabName: "Meus estudos",
                    tabIcon: <InsertChart />
                }, {
                    tabName: "Novo estudo",
                    tabIcon: <AddCircle />
                }],


            },
            
            
            open: true,
            studyCreationOk: false,
            studyCreationError: false,
            studyRetrieveError: false,
            studyDeletedOk: false,
            studyDeletedError: false,
            studyEditedOk: false, 
            studyEditedError: false,
            studyLinkCopied: false,
            cardLimitExceeded: false,
            mainElements: [ // The component of the tab you inserted right above should be added here. 
                <MyStudies user={this.props.userDataReducer} 
                    studyRetrieveError={() => this.setState({ studyRetrieveError: true })}
                    studyDeletedOk={() => this.setState({ studyDeletedOk: true })}
                    studyDeletedError={() => this.setState({ studyDeletedError: true })}
                    studyEditedOk={() => this.setState({ studyEditedOk: true })}
                    studyEditedError={() => this.setState({ studyEditedError: true })}
                    studyLinkCopied={() => this.setState({ studyLinkCopied: true })}
                    boardsRetrievalError={() =>  this.setState({ boardsRetrievalError : true})}/>,                    
                <NewStudyForm newStudy={(studyName, studyObjective, cards) => this.newStudy(studyName, studyObjective, cards)}
                    firstButton={'Criar estudo '}
                    name={''}
                    objective={''}
                    cards={[]} /> // The order should be the same of the tabs array...
            ],
            logoutClicked: false


        }
        
    }


    // Creating tab transition...
    clickHandler = (tab) => {

        this.setState({
            tabs: {
                active: tab,
                elements: [{
                    tabName: "Meus estudos",
                    tabIcon: <InsertChart />
                }, {
                    tabName: "Novo estudo",
                    tabIcon: <AddCircle />
                }]
            }
        });

    }

    // Callback responsible for communicating to our database the data of the study we're creating
    newStudy = (studyName, studyObjective, cards) => {

        // We'll only allow studies to be created with less than 
        
        if (cards.length > 100){
            this.setState({ cardLimitExceeded : true});
        }else{            
            // Here I just create the study on the database.
            console.log("Cards: ", cards);
            axios.post(process.env.REACT_APP_ADMIN_API + '/studies' , {
                name: studyName,
                objective: studyObjective,
                cards: cards
            }).then(res => {          
                console.log("res.data._id", res.data);
                // Taking the response from api and inserting the study id on our user's studies field.
                axios.put(process.env.REACT_APP_ADMIN_API + '/researchers/authId=' + this.state.user.authId, {
                    studies: res.data._id
                }).then(res => {
                    
                    // Updating our redux reducer
                    this.props.userDataStoreAction(res.data)
    
                    // Updating our views' properties (because they were instantiated on state, they're not aware of the props change)
                    this.setState({
                        user: res.data, 
                        studyCreationOk: true, 
                        mainElements: [
                        <MyStudies user={this.props.userDataReducer}  
                                studyRetrieveError={() => this.setState({ studyRetrieveError: true })}
                                studyDeletedOk={() => this.setState({ studyDeletedOk: true })}
                                studyDeletedError={() => this.setState({ studyDeletedError: true })}
                                studyEditedOk={() => this.setState({ studyEditedOk: true })}
                                studyEditedError={() => this.setState({ studyEditedError: true })}
                                studyLinkCopied={() => this.setState({ studyLinkCopied: true })}
                                boardsRetrievalError={() =>  this.setState({ boardsRetrievalError : true})}/>,                                
                            <NewStudyForm newStudy={(studyName, studyObjective, cards) => this.newStudy(studyName, studyObjective, cards)}
                                firstButton={'Criar estudo '}
                                name={''}
                                objective={''}
                                cards={[]} /> // The order should be the same of the tabs array...
                    ]})
    
                }, res => {
                    
                    // If we could not insert this study in our user's studies field...
                    this.setState({ studyCreationError: true })
                })
    
            }, res => {
    
                // If we could not insert our study in the database.
                this.setState({ studyCreationError: true })
    
            })
        }
        



    }

    // Cleaning our current data to make our login/logout logic keep working.
    logOut(){

        firebase.auth().signOut()

        this.setState({logoutClicked: true})
        this.props.logoutAction()
        this.props.userDataStoreAction({name:"", email:"", authId:"", studies:[]})
        this.props.studiesDataStoreAction({studies: null})
        

        console.log(this.state.logoutClicked)
        this.props.history.push("/researcherAuth")
    }

    // Logout register and redirectioner
    componentDidMount = () => {
        // If the user is not authenticated, he/she should not be in this page...
        if (this.props.authReducer.authenticated){
            firebase.auth() // If the user is authenticated, he/she can log out.
        }else{
            this.props.history.push("/researcherAuth")
        }
    }

    render() {  
        
        const { classes } = this.props;

        return (

            <div className={classes.dashboardBody}>
                <DashboardDrawer drawer={this.drawer} active={this.state.tabs.active} elements={this.state.tabs.elements} clickHandler={(tab) => this.clickHandler(tab)} logoutClick={() => this.logOut()} />

                {/* All these snack bars are just warnings and sucess messages. */}
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    open={this.state.boardsRetrievalError}
                    autoHideDuration={3000}
                    onClose={(event, reason) => {
                        if (reason === 'clickaway') {
                            return;
                        }
                        this.setState({ boardsRetrievalError: false });
                    }}
                >
                    <MySnackbarContent
                        onClose={(event, reason) => {
                            if (reason === 'clickaway') {
                                return;
                            }
                            this.setState({ boardsRetrievalError: false });
                        }}
                        variant="error"
                        message="Não foi possível acessar a base de dados!"
                    />
                </Snackbar>

                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    open={this.state.cardLimitExceeded}
                    autoHideDuration={3000}
                    onClose={(event, reason) => {
                        if (reason === 'clickaway') {
                            return;
                        }
                        this.setState({ cardLimitExceeded: false });
                    }}
                >
                    <MySnackbarContent
                        onClose={(event, reason) => {
                            if (reason === 'clickaway') {
                                return;
                            }
                            this.setState({ cardLimitExceeded: false });
                        }}
                        variant="error"
                        message="Máximo de 100 cartões excedido!"
                    />
                </Snackbar>

                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    open={this.state.studyLinkCopied}
                    autoHideDuration={3000}
                    onClose={(event, reason) => {
                        if (reason === 'clickaway') {
                            return;
                        }
                        this.setState({ studyLinkCopied: false });
                    }}
                >
                    <MySnackbarContent
                        onClose={(event, reason) => {
                            if (reason === 'clickaway') {
                                return;
                            }
                            this.setState({ studyLinkCopied: false });
                        }}
                        variant="success"
                        message="Link para estudo copiado!"
                    />
                </Snackbar>

                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    open={this.state.studyEditedOk}
                    autoHideDuration={3000}
                    onClose={(event, reason) => {
                        if (reason === 'clickaway') {
                            return;
                        }
                        this.setState({ studyEditedOk: false });
                    }}
                >
                    <MySnackbarContent
                        onClose={(event, reason) => {
                            if (reason === 'clickaway') {
                                return;
                            }
                            this.setState({ studyEditedOk: false });
                        }}
                        variant="success"
                        message="Estudo editado com sucesso!"
                    />
                </Snackbar>

                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    open={this.state.studyEditedError}
                    autoHideDuration={3000}
                    onClose={(event, reason) => {
                        if (reason === 'clickaway') {
                            return;
                        }
                        this.setState({ studyEditedError: false });
                    }}
                >
                    <MySnackbarContent
                        onClose={(event, reason) => {
                            if (reason === 'clickaway') {
                                return;
                            }
                            this.setState({ studyEditedError: false });
                        }}
                        variant="error"
                        message="Ocorreram erros ao editar seu estudo!"
                    />
                </Snackbar>

                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    open={this.state.open}
                    autoHideDuration={3000}
                    onClose={(event, reason) => {
                        if (reason === 'clickaway') {
                            return;
                        }
                        this.setState({ open: false });
                    }}
                >
                    <MySnackbarContent
                        onClose={(event, reason) => {
                            if (reason === 'clickaway') {
                                return;
                            }
                            this.setState({ open: false });
                        }}
                        variant="success"
                        message="Login efetuado com sucesso!"
                    />
                </Snackbar>

                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    open={this.state.studyCreationOk}
                    autoHideDuration={3000}
                    onClose={(event, reason) => {
                        if (reason === 'clickaway') {
                            return;
                        }
                        this.setState({ studyCreationOk: false });
                    }}
                >
                    <MySnackbarContent
                        onClose={(event, reason) => {
                            if (reason === 'clickaway') {
                                return;
                            }
                            this.setState({ studyCreationOk: false });
                        }}
                        variant="success"
                        message="Estudo criado com sucesso!"
                    />
                </Snackbar>
                
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    open={this.state.studyDeletedOk}
                    autoHideDuration={3000}
                    onClose={(event, reason ) => {
                        if (reason === 'clickaway') {
                            return;
                        }
                        this.setState({ studyDeletedOk: false });
                    }}
                >
                    <MySnackbarContent
                        onClose={(event, reason) => {
                            if (reason === 'clickaway') {
                                return;
                            }
                            this.setState({ studyDeletedOk: false });
                        }}
                        variant="success"
                        message="Estudo excluído com sucesso!"
                    />
                </Snackbar>

                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    open={this.state.studyCreationError}
                    autoHideDuration={3000}
                    onClose={(event, reason) => {
                        if (reason === 'clickaway') {
                            return;
                        }
                        this.setState({ studyCreationError: false });
                    }}
                >
                    <MySnackbarContent
                        onClose={(event, reason) => {
                            if (reason === 'clickaway') {
                            return;
                        }
                        this.setState({ studyCreationError: false });
                        }}
                        variant="error"
                        message="Ocorreram erros ao tentar salvar seu estudo!"
                    />
                </Snackbar>
                
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    open={this.state.studyRetrieveError}
                    autoHideDuration={3000}
                    onClose={(event, reason) => {
                        if (reason === 'clickaway') {
                            return;
                        }
                        this.setState({ studyRetrieveError: false });
                    }}
                >
                    <MySnackbarContent
                        onClose={(event, reason) => {
                            if (reason === 'clickaway') {
                                return;
                            }
                            this.setState({ studyRetrieveError: false });
                        }}
                        variant="error"
                        message="Não foi possível recuperar seus estudos!"
                    />
                </Snackbar>

                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    open={this.state.studyDeletedError}
                    autoHideDuration={3000}
                    onClose={(event, reason) => {
                        if (reason === 'clickaway') {
                            return;
                        }
                        this.setState({ studyDeletedError: false });
                    }}
                >
                    <MySnackbarContent
                        onClose={(event, reason) => {
                            if (reason === 'clickaway') {
                                return;
                            }
                            this.setState({ studyDeletedError: false });
                        }}
                        variant="error"
                        message="Não foi possível excluir seu estudo!"
                    />
                </Snackbar>

                {/* This component is responsible for rendering the tab that's being passed through 'content' property */}
                <MainDrawer content={this.state.mainElements[this.state.tabs.active]} ></MainDrawer>

            </div>

        )

    }

}


const mapStateToProps = state => ({
    ...state
});

const mapDispatchToProps = dispatch => ({
    loginAction: () => dispatch(loginAction),
    logoutAction: () => dispatch(logoutAction),
    userDataStoreAction: (userData) => dispatch(userDataStoreAction(userData)),
    studiesDataStoreAction: (studiesData) => dispatch(studiesDataStoreAction(studiesData)),
    
});

ResearcherDashboard.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default compose(withRouter, connect(mapStateToProps, mapDispatchToProps), withStyles(styles2))(ResearcherDashboard);
