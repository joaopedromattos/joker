import React from "react";
import PropTypes from "prop-types";
import { compose } from "redux";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import MenuItem from "@material-ui/core/MenuItem";
import Divider from "@material-ui/core/Divider";
import TextField from "@material-ui/core/TextField";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import DeleteIcon from "@material-ui/icons/Delete";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import "./NewStudyForm.scss";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import DragAndDropCardCreation from "../DragAndDropCardCreation/DragAndDropCardCreation";

const drawerWidth = 240;

const styles = theme => ({
    container: {
        display: "flex",
        flexWrap: "wrap",
        flexGrow: 1
        // padding: theme.spacing.unit * 3,
        // width: 10000
    },
    textField: {
        marginLeft: theme.spacing(1)
        // marginRight: theme.spacing.unit,
    },
    dense: {
        marginTop: 16
    },
    menu: {
        // width: theme.zIndex.drawer,
    },
    root: {
        width: "100%"
        // maxWidth: 360,

        // backgroundColor: theme.palette.background.paper,
    },
    cardList: {
        maxWidth: "100%"
    },
    button: {
        margin: theme.spacing(1)
    },

    leftIcon: {
        marginRight: theme.spacing(1)
    }
});

class NewStudyForm extends React.Component {
    state = {
        name: this.props.name,
        objective: this.props.objective,
        currentCard: "",
        currentCardDescription: "",
        cards: this.props.cards
    };

    // Function used to add cards to our study. It just modifies data locally.
    addCard = () => {
        this.setState({
            cards: [
                {
                    name: this.state.currentCard,
                    description: this.state.currentCardDescription
                },
                ...this.state.cards
            ]
        });
    };

    // This function is used to remove cards from our local state.
    removeCard = toBeRemoved => {
        let newArray = this.state.cards.filter((_, i) => i !== toBeRemoved);
        console.log(
            "Inside removeCard...",
            "tobeRemoved",
            toBeRemoved,
            newArray
        );
        this.setState({ cards: newArray });
    };

    //
    // These two functions below are just responsible for changing our cards order.
    //
    moveCardDown = index => {
        let newArray = this.state.cards;

        // If our element is not the lastone.
        if (index < this.state.cards.length - 1) {
            let aux = newArray[index];
            newArray[index] = newArray[index + 1];
            newArray[index + 1] = aux;
        }

        this.setState({
            cards: newArray
        });
    };

    moveCardUp = index => {
        let newArray = this.state.cards;

        // If our element is not the lastone.
        if (index > 0) {
            let aux = newArray[index];
            newArray[index] = newArray[index - 1];
            newArray[index - 1] = aux;
        }

        this.setState({
            cards: newArray
        });
    };

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value
        });
    };

    render() {
        const { classes } = this.props;

        return (
            <div>
                <Button
                    className={classes.button}
                    onClick={() =>
                        this.props.newStudy(
                            this.state.name,
                            this.state.objective,
                            this.state.cards
                        )
                    }
                    fullWidth={true}
                    variant="contained"
                    color="primary"
                >
                    {this.props.firstButton} <span> </span>
                    <AddIcon className={classes.leftIcon} />
                </Button>

                <form
                    className={classes.container}
                    noValidate
                    autoComplete="off"
                >
                    <Grid
                        container
                        direction="row"
                        justify="center"
                        alignItems="center"
                    >
                        <Grid item>
                            <h1 className="centerTitles">
                                Insira os dados do estudo
                            </h1>
                        </Grid>
                    </Grid>

                    <TextField
                        id="outlined-name"
                        label="Nome do estudo"
                        style={{ margin: 8 }}
                        className={classes.textField}
                        value={this.state.name}
                        onChange={this.handleChange("name")}
                        fullWidth
                        margin="normal"
                        required={true}
                        variant="outlined"
                        autoFocus={true}
                        error={this.state.name.length === 0}
                    />

                    <TextField
                        id="outlined-name"
                        label="Objetivo"
                        style={{ margin: 8 }}
                        className={classes.textField}
                        value={this.state.objective}
                        onChange={this.handleChange("objective")}
                        fullWidth
                        margin="normal"
                        variant="outlined"
                    />

                    <Grid
                        container
                        direction="row"
                        justify="center"
                        alignItems="center"
                    >
                        <Grid item>
                            <h1>Adicione os cartões</h1>
                        </Grid>
                    </Grid>

                    <TextField
                        id="outlined-name"
                        label="Nome do cartão"
                        style={{ margin: 8 }}
                        className={classes.textField}
                        value={this.state.currentCard}
                        onChange={this.handleChange("currentCard")}
                        fullWidth
                        margin="normal"
                        variant="outlined"
                    />

                    <TextField
                        id="outlined-name"
                        label="Descrição do cartão"
                        style={{ margin: 8 }}
                        className={classes.textField}
                        value={this.state.currentCardDescription}
                        onChange={this.handleChange("currentCardDescription")}
                        fullWidth
                        margin="normal"
                        variant="outlined"
                    />
                </form>

                <Button
                    className={classes.button}
                    fullWidth={true}
                    variant="contained"
                    color="primary"
                    onClick={() => this.addCard()}
                >
                    <AddIcon />
                </Button>

                {/* <List className={classes.root}>
                    {this.state.cards.map((card, index, cards) => (
                        <ListItem key={index} divider={true}>
                            <ListItemText
                                primary={cards[index].name}
                                secondary={
                                    <React.Fragment>
                                        {cards[index].description}
                                    </React.Fragment>
                                }
                            />
                            <ListItemSecondaryAction>
                                <IconButton
                                    aria-label="Delete"
                                    color="secondary"
                                    onClick={() => this.removeCard(index)}
                                >
                                    <DeleteIcon />
                                </IconButton>
                                <IconButton
                                    disabled={index === cards.length - 1}
                                    aria-label="Move card down"
                                    color="primary"
                                    onClick={() => this.moveCardDown(index)}
                                >
                                    <KeyboardArrowDownIcon />
                                </IconButton>
                                <IconButton
                                    disabled={index === 0}
                                    aria-label="Move card up"
                                    color="primary"
                                    onClick={() => this.moveCardUp(index)}
                                >
                                    <KeyboardArrowUpIcon />
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                    ))}
                </List> */}

                <div className={classes.cardList}>
                    <DragAndDropCardCreation
                        removeCard={this.removeCard}
                        cards={this.state.cards}
                    ></DragAndDropCardCreation>
                </div>
            </div>
        );
    }
}

NewStudyForm.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(NewStudyForm);
