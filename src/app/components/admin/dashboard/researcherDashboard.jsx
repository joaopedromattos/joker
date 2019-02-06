
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import firebase from 'firebase';
import { connect } from "react-redux";
import { compose } from 'redux'
import { loginAction } from "../../../actions/admin/loginAction";
import { logoutAction } from "../../../actions/admin/logoutAction";
import { userDataStoreAction } from "../../../actions/admin/userDataStoreAction";
import './researcherDashboard.scss';
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
        margin: theme.spacing.unit,
    },
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
            mainElements: [ // The component of the tab you inserted right above should be added here. 
                <MyStudies user={this.props.userDataReducer} studyRetrieveError={() => this.handleOpenStudyRetrieve()}/>, <NewStudyForm newStudy={(studyName, studyObjective, cards) => this.newStudy(studyName, studyObjective, cards)} /> // The order should be the same of the tabs array...
            ],
            logoutClicked: false


        }
    }

    // The following three functions are just handlers of the snackBars
    handleCloseLogin = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        this.setState({ open: false });

    };

    handleCloseStudyCreationOk = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        this.setState({ studyCreationOk: false });

    };

    handleCloseStudyCreationError = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        this.setState({ studyCreationError: false });

    };


    handleOpenStudyRetrieve() {
        this.setState({ studyRetrieveError : true})
    }

    handleCloseStudyRetrieve = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        this.setState({ studyRetrieveError: false });

    };

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


    newStudy = (studyName, studyObjective, cards) => {
        
        // Here I just create the study on the database.
        axios.post('http://localhost:3000/studies', {
            name: studyName,
            objective: studyObjective,
            cards: cards
        }).then(res => {          

            // Taking the response from api and inserting the study id on our user's studies field.
            axios.put('http://localhost:3000/researchers/authId=' + this.state.user.authId, {
                studies: res.data._id
            }).then(res => {
                
                // Updating our redux reducer
                this.props.userDataStoreAction(res.data)

                // Updating our views' properties (because they were instantiated on state, they're not aware of the props change)
                this.setState({
                    user: res.data, 
                    studyCreationOk: true, 
                    mainElements: [
                    <MyStudies user={this.props.userDataReducer} studyRetrieveError={() => this.handleOpenStudyRetrieve()} />, <NewStudyForm newStudy={(studyName, studyObjective, cards) => this.newStudy(studyName, studyObjective, cards)} /> // The order should be the same of the tabs array...
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

    logOut(){

        firebase.auth().signOut()

        this.setState({logoutClicked: true})
        this.props.logoutAction()
        this.props.userDataStoreAction({name:"", email:"", authId:"", studies:[]})

        console.log(this.state.logoutClicked)
        this.props.history.push("/researcherAuth")
    }

    // Logout register and redirectioner
    componentDidMount = () => {
        firebase.auth()
    }





    render() {        

        return (

            <div className="dashboardBody">
                <DashboardDrawer drawer={this.drawer} active={this.state.tabs.active} elements={this.state.tabs.elements} clickHandler={(tab) => this.clickHandler(tab)} logoutClick={() => this.logOut()} />

                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    open={this.state.open}
                    autoHideDuration={3000}
                    onClose={this.handleCloseLogin}
                >
                    <MySnackbarContent
                        onClose={this.handleCloseLogin}
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
                    onClose={this.handleCloseStudyCreationOk}
                >
                    <MySnackbarContent
                        onClose={this.handleCloseStudyCreationOk}
                        variant="success"
                        message="Estudo criado com sucesso!"
                    />
                </Snackbar>

                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    open={this.state.studyCreationError}
                    autoHideDuration={3000}
                    onClose={this.handleCloseStudyCreationError}
                >
                    <MySnackbarContent
                        onClose={this.handleCloseStudyCreationError}
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
                    onClose={this.handleCloseStudyRetrieve}
                >
                    <MySnackbarContent
                        onClose={this.handleCloseStudyRetrieve}
                        variant="error"
                        message="Não foi possível recuperar seus estudos!"
                    />
                </Snackbar>

                {
                    (this.state.tabs.active == 0 && this.state.user && this.state.user.studies) || (this.state.tabs.active != 0) ? (

                        <MainDrawer content={this.state.mainElements[this.state.tabs.active]} ></MainDrawer>

                    ) : (

                        <MainDrawer content={this.state.mainElements[2]} ></MainDrawer>

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
    logoutAction: () => dispatch(logoutAction),
    userDataStoreAction: (userData) => dispatch(userDataStoreAction(userData))
});

ResearcherDashboard.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default compose(withRouter, connect(mapStateToProps, mapDispatchToProps), withStyles(styles2))(ResearcherDashboard);
