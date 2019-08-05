import React from 'react';
import PropTypes from 'prop-types';
import { compose } from "redux";
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import PhotoIcon from "@material-ui/icons/Photo";
import ArrowDownward from "@material-ui/icons/ArrowDownwardRounded";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown"
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp"
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import Button from "@material-ui/core/Button";

const drawerWidth = 240

const styles = theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
        flexGrow: 1,
        // padding: theme.spacing.unit * 3,
        // width: 10000

    },
    textField: {
        marginLeft: theme.spacing(1),
        // marginRight: theme.spacing.unit,
    },
    dense: {
        marginTop: 16,
    },
    menu: {
        // width: theme.zIndex.drawer,
    },
    root: {
        width: '100%',
        flexGrow: 1,
        // maxWidth: 360,

        // backgroundColor: theme.palette.background.paper,
    },
    image: {
        marginRight: 'auto',
        marginLeft: 'auto',
        display: 'block'
    },
    button: {
        marginRight: 'auto',
        marginLeft: 'auto',
        display: 'block'
        // margin: theme.spacing.unit,
    },

    rightIcon: {
        marginLeft: theme.spacing(1),
    },

});


class ResultExhibition extends React.Component {
    state = {
        name: this.props.name,
        objective: this.props.objective,
        currentCard: '',
        currentCardDescription: '',
        cards: this.props.cards,


    };


    render() {
        const { classes } = this.props;

        return (
            <div>

                <img src={this.props.imageSrc} alt="Logo" className={classes.image}/>

                <Grid container direction="row" justify="center" alignItems="center" >



                    <Button variant="contained" color="primary" >
                        Baixar Dendograma
                        <span></span>
                        <PhotoIcon className={classes.rightIcon} />
                    </Button>




                    <Button variant="contained" color="primary">
                        Baixar amostras
                        <span></span>

                        <ArrowDownward className={classes.rightIcon} />
                    </Button>



                </Grid>

                <div className={classes.button}>

                    <span></span>

                </div>
            </div>
        );
    }
}

ResultExhibition.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ResultExhibition);
