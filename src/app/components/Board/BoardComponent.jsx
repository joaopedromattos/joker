import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from 'redux'
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import axios from "axios";
import { normalize, schema } from "normalizr";
import "./BoardComponent.scss";
import classnames from "classnames";
import slugify from "slugify";

import MySnackbarContent from "../MySnackbarContentWrapper/MySnackbarContent";
import Snackbar from '@material-ui/core/Snackbar';

import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
    root: {
        ...theme.mixins.gutters(),
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
        margin: 'auto',
    }, 
    progress: {
        color: '#FFFFFF',
    },
    disable: {
        backgroundColor: '#536bba'
        
    }

});


class BoardComponent extends Component {

    constructor(props){
        super(props)
        this.state = {

            studyLink: "", 
            boardRetrieveError: false,
            loading: false,


        }
    }

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });

        
    };

    // Function that parses the link we've received...
    fieldParse = () => {

        // This regex will parse the '/b/STUDY_ID' portion on the input.
        let parseResult = /(\/b\/)(\d|\D)*/.exec(this.state.studyLink);

        let studyId = '';

        // If we've had no match with the input string...
        if (parseResult === null){ 
            // ... we consider our user has already typed our raw id.
            studyId = this.state.studyLink;         
        }else{
            // When we have a match, we just remove the '/b/' part of the string and get the id.
            studyId = parseResult[0].split("/b/")[1]
        }

        // Second parse to decide if we have in our hands is a real id or just rubbish 
        if (/(\`|\~|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\+|\=|\[|\{|\]|\}|\||\\|\'|\<|\,|\.|\>|\?|\/|\""|\;|\:|\s)/.exec(studyId) === null){
            return studyId; // If there are no special characters in our string...
        }else{ 
            return null;
        }
    }

    // Boards are stored in a tree structure inside mongoDB.
    // This function takes the tree shaped boards and returns a flat structure more suitable to a redux store.
    // This was taken from the original creator of react-kanban library
    normalizeBoards = boards => {
        console.log("res data: ", boards);
        const card = new schema.Entity("cardsById", {}, { idAttribute: "_id" });
        const list = new schema.Entity(
            "listsById",
            { cards: [card] },
            { idAttribute: "_id" }
        );
        const board = new schema.Entity(
            "boardsById",
            { lists: [list] },
            { idAttribute: "_id" }
        );
        const { entities } = normalize(boards, [board]);
        console.log("entities: ", entities);
        return {entities, boardId: boards[0]._id};
    };

    boardSearch = () => {
        let id = this.fieldParse()

        if (id === null ){
            this.setState({boardRetrieveError: true})
        }else{
            axios.get("http://localhost:3000/fetchBoard/_id=" + id).then(res => {
                const normBoards = this.normalizeBoards([res.data]);
                console.log("NORM BOARDS: ", normBoards);

                if (normBoards.entities.boardsById){this.props.boardInit(normBoards.entities.boardsById);}
                if (normBoards.entities.listsById){this.props.listInit(normBoards.entities.listsById)};
                if (normBoards.entities.cardsById){this.props.cardsInit(normBoards.entities.cardsById)};
                if (normBoards.entities.boardId){this.props.currentBoardInit(normBoards.boardId)};
                this.setState({loading: true});

                this.props.history.push({
                    pathname: `/b/${normBoards.boardId}`,
                })
                
            });
        }

        
        
    }

    render = () => {

        const { classes } = this.props;

    

        return (
            <div className="landing-page">
                <Helmet>
                    <title>Acesso ao estudo</title>
                </Helmet>
                <div className="landing-page-info-wrapper">

                    <Snackbar
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                        open={this.state.boardRetrieveError}
                        autoHideDuration={3000}
                        onClose={(event, reason) => {
                            if (reason === 'clickaway') {
                                return;
                            }
                            this.setState({ boardRetrieveError: false });
                        }}
                    >
                        <MySnackbarContent
                            onClose={(event, reason) => {
                                if (reason === 'clickaway') {
                                    return;
                                }
                                this.setState({ boardRetrieveError: false });
                            }}
                            variant="error"
                            message="Não foi possível encontrar o estudo. Verifique o Id/Link inserido!"
                        />
                    </Snackbar>
                    
                    <Paper className={classes.root} elevation={1}>

                        
                        
                        <Typography variant="h5" align="center" component="h3">
                            Insira o link ou o id do estudo
                        </Typography>

                        <br/>
                        
                        <TextField
                            id="outlined-full-width"
                            label="Id ou Link do estudo"
                            style={{ margin: 'auto' }}
                            value={this.state.studyLink}
                            onChange={this.handleChange('studyLink')}
                            autoFocus={true}
                            required={true}
                            fullWidth
                            margin="dense"
                            variant="outlined"
                            
                        />

                        <br/>
                        <br/>
                        
                        {/* {boards.map(board => (
                            <Link
                            key={board._id}
                            to={`/b/${board._id}/${slugify(board.title, {
                                lower: true
                            })}`}
                            onClick={this.enterAsGuest}
                            >
                            <div className="guest-button-wrapper">
                                <button className="signin-button guest-button">
                                Começar
                            </button>
                            </div>
                            </Link>
                        ))} */
                        }

                        <Button style={{ backgroundColor: this.state.loading ? '#7e8cba' : '#3f51b5'}} disabled={this.state.loading} variant="contained" color="primary" fullWidth onClick={() => this.boardSearch()}>
                            {(!this.state.loading) ? ("Iniciar pesquisa") : ("")}
                            {this.state.loading && <CircularProgress size={20} className={classes.progress}  /> }                       
                        </Button>

                        <br/>
                        <br/>
                        
                        <Button variant="outlined" href='/' fullWidth >Retornar à página inicial</Button>
                    </Paper>

                    
                </div>
            </div>
        );
    }
}

BoardComponent.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    ...state
});

const mapDispatchToProps = dispatch => ({

    boardInit: (fetchedBoard) => dispatch({ type: "BOARD_ACCESS", payload: {board: fetchedBoard}}),
    listInit: (fetchedList) => dispatch({ type: "LIST_ACCESS", payload: { list: fetchedList } }),
    cardsInit: (fetchedCards) => dispatch({ type: "CARD_ACCESS", payload: { cards: fetchedCards } }),
    currentBoardInit: (currentBoard) => dispatch({ type: "PUT_BOARD_ID_IN_REDUX", payload: { boardId: currentBoard } })

});


export default compose(connect(mapStateToProps, mapDispatchToProps), withStyles(styles))(BoardComponent);