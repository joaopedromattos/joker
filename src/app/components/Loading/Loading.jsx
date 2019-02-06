import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';


const styles = theme => ({
    progress: {
        margin: theme.spacing.unit * 2,
    },
});

function Loading(props) {
    const { classes } = props;
    return (
        <div>       
            
            <CircularProgress className={classes.progress} />
            {/* <CircularProgress className={classes.progress} color="secondary" /> */}
        </div>
    );
}

Loading.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Loading);