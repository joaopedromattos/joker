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

function generate(element) {
    return [0, 1, 2].map(value =>
        React.cloneElement(element, {
            key: value,
        }),
    );
}

class MyStudies extends React.Component {

    constructor(props){
        super(props)
        this.state = {

            dense: false,
            secondary: false,

        }
    }


    render() {
        const { classes } = this.props;
        const { secondary } = this.state;


        return (

            
            <div className={classes.root}>
                <div className={classes.demo}>
                    <List >
                        <ListItem>
                            <ListItemText
                                primary="Single-line item"
                                secondary={'Secondary text'}
                            />
                        </ListItem>
                    </List>
                </div>
            </div>
        );
    }
}

MyStudies.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MyStudies);