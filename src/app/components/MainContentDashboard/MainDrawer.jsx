import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

const drawerWidth = 240;

// const styles = theme => ({
//     root: {
//         // ...theme.mixins.gutters(),
//         display: 'flex',
//         // paddingTop: theme.spacing.unit * 2,
//         // paddingLeft: drawerWidth,
//         // paddingBottom: theme.spacing.unit * 2,
//     },
//     drawer: {
//         [theme.breakpoints.up('sm')]: {
//             width: drawerWidth,
//             flexShrink: 0,
//         },
//     },
//     appBar: {
//         marginLeft: drawerWidth,
//         // [theme.breakpoints.up('sm')]: {
//         //     width: `calc(100% - ${drawerWidth}px)`,
//         // },
//     },
//     menuButton: {
//         marginRight: 20,
//         [theme.breakpoints.up('sm')]: {
//             display: 'none',
//         },
//     },
//     toolbar: theme.mixins.toolbar,
//     drawerPaper: {
//         width: drawerWidth,
//     },
//     content: {
//         flexGrow: 1,
//         padding: theme.spacing.unit * 3,
//         paddingLeft: drawerWidth * 1.15
//     },
// });


const styles = theme => ({
    root: {
        display: 'flex',
    },
    drawer: {
        [theme.breakpoints.up('sm')]: {
            width: drawerWidth,
            flexShrink: 0,
        },
    },
    appBar: {
        marginLeft: drawerWidth,
        [theme.breakpoints.up('sm')]: {
            width: `calc(100% - ${drawerWidth}px)`,
        },
    },
    menuButton: {
        marginRight: 20,
        [theme.breakpoints.up('sm')]: {
            display: 'none',
        },
    },
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
        width: drawerWidth,
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing.unit * 3,
        [theme.breakpoints.up('sm')]: {
            // width: `calc(100% - ${drawerWidth}px)`,
            paddingLeft: drawerWidth * 1.15
        }

    },
});

class MainDrawer extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            
        }
    }
    
    render() {
        const { classes } = this.props;

        
        return (
            <div >
                <main className={classes.content}>
                    <div className={classes.toolbar} />        
                        
                        {
                            this.props.content
                        }
                </main>
            </div>
        );
    }
}

MainDrawer.propTypes = {
    classes: PropTypes.object.isRequired,
    
};

export default withStyles(styles, { withTheme: true })(MainDrawer);