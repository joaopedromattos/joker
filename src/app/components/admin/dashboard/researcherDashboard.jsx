// Component to which the used is redirected after signing in...

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import firebase from 'firebase';
import { connect } from "react-redux";
import { compose } from 'redux'
import { loginAction } from "../../../actions/admin/loginAction";
import { logoutAction } from "../../../actions/admin/logoutAction";
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
import LinearLoading from "../../LinearLoading/LinearLoading";
import axios from "axios";
import { withRouter } from "react-router-dom";

const styles2 = theme => ({
    margin: {
        margin: theme.spacing.unit,
    },
});


class ResearcherDashboard extends Component{

    constructor(props){
        super(props)
        this.state = {
            isSignedIn: true, 
            user: {}, 
            tabs: {
                active: 0,
                elements: [{ // To insert a new tab on the drawer, place it this array...
                    tabName: "Meus estudos", 
                    tabIcon: <InsertChart/>
                }, {
                    tabName: "Novo estudo",
                    tabIcon: <AddCircle/>
                }], 
                
                
            }, 
            open: true,
            studyCreationOk: false, 
            studyCreationError: false,
            studyRetrieveError: false,
            mainElements: [ // The component of the tab you inserted right above should be added here. 
                <MyStudies />, <NewStudyForm newStudy={(studyName, studyObjective, cards) => this.newStudy(studyName, studyObjective, cards)}/>, <LinearLoading/> // The order should be the same of the tabs array...
            ]
            
            
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

    handleCloseStudyRetrieve = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        this.setState({ studyRetrieveError: false });

    };
    
    getUserStudies(){

        axios.get('http://localhost:3000/researchers/email=' + this.state.user.email).then(res => {
            this.setState({user: res.data})
        }, res => {
            this.setState({ studyRetrieveError: true})
        })

    }
    

    // Creating tab transition...
    clickHandler = (tab) =>{

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


    newStudy = (studyName, studyObjective, cards) =>{

        axios.post('http://localhost:3000/studies', {
            name: studyName,
            objective: studyObjective,
            cards: cards            
        }).then(res => {

            console.log("Como o estudo fica no banco:", res)

            axios.put('http://localhost:3000/researchers/authId=' + this.state.user.uid, {
                studies: res.data._id
            }).then(res => {
                console.log("Como ficou o usuário depois de adicionado o estudo: ", res)
                this.setState({ user: res.data})
                this.setState({ studyCreationOk: true})
            }, res => {
                this.setState({ studyCreationError: true })
            })

        }, res => {

            this.setState({studyCreationError: true})

        })



    }

    // Logout register and redirectioner
    componentDidMount = () => {

        firebase.auth().onAuthStateChanged(usr => {

            this.setState({
                isSignedIn: !!usr, 
                user: usr, 
                tabs: {
                    active: 0,
                    elements: [{
                        tabName: "Meus estudos",
                        tabIcon: <InsertChart />
                    }, {
                        tabName: "Novo estudo",
                        tabIcon: <AddCircle />
                    }],
                    
                }
                
                
            })

            this.getUserStudies()


            if (!this.state.isSignedIn) {

                this.props.authReducer.authenticated ? (this.props.logoutAction()) : (this.props.loginAction())          


                this.props.history.push("/researcherAuth")

            }

        })
    }

    render() {

        return (
                 
            
            <div className="dashboardBody">
                <DashboardDrawer drawer={this.drawer} active={this.state.tabs.active} elements={this.state.tabs.elements} clickHandler={(tab) => this.clickHandler(tab)} logoutClick={() => firebase.auth().signOut()} />

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

                    ):(
                    
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
    logoutAction: () => dispatch(logoutAction)
});

ResearcherDashboard.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default compose(withRouter, connect(mapStateToProps, mapDispatchToProps), withStyles(styles2))(ResearcherDashboard);