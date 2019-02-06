import React , { Fragment } from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import Grid from "@material-ui/core/Grid";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MailIcon from '@material-ui/icons/Mail';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import InputOutlinedIcon from '@material-ui/icons/InputOutlined'
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

const drawerWidth = 240;

const styles = theme => ({
    root: {
        display: 'flex',
        // flexGrow: 1
    },
    grow: {
        flexGrow: 1,
    },
    drawer: {
        [theme.breakpoints.up('sm')]: {
            width: drawerWidth,
            flexShrink: 0,
        },
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        // marginLeft: drawerWidth,
        // [theme.breakpoints.up('sm')]: {
        //     width: `calc(100% - ${drawerWidth}px)`,
        // },
    },
    menuButton: {
        marginLeft: -12,
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
    },
});

class DashboardDrawer extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            mobileOpen: false,
        };
    }

    handleDrawerToggle = () => {
        this.setState(state => ({ mobileOpen: !this.state.mobileOpen }));
    };

    render() {
        const { classes, theme } = this.props;

        const drawer = (
            <div>
                <Hidden xsDown implementation="css">
                    <div className={classes.toolbar} />
                </Hidden>
                <ListItem button key={"Logout"} onClick={() => this.props.logoutClick()}>
                    <ListItemIcon>{<InputOutlinedIcon />}</ListItemIcon>
                    <ListItemText primary={"Logout"} />
                </ListItem>
                <Divider />
                
                <List>
                    {this.props.elements.map((element, index) => (
                        
                        <ListItem button key={element.tabName} selected={this.props.active === index} onClick={() => this.props.clickHandler(index)}>
                            <ListItemIcon>{this.props.elements[index].tabIcon}</ListItemIcon>
                            <ListItemText primary={element.tabName} />
                        </ListItem>
                    ))}
                </List>                
            </div>
        );

        return (
            
            <Fragment>
                <div className={classes.root}>
                    {/* <CssBaseline /> */}
                    <AppBar position="absolute" className={classes.appBar}>
                        
                        
                        <Toolbar >
                            
                            <IconButton
                                color="inherit"
                                aria-label="Open drawer"
                                onClick={this.handleDrawerToggle}
                                className={classes.menuButton}
                            >
                                <MenuIcon />
                            </IconButton>
                                
                            <Typography variant="h6" color="inherit" className={classes.grow}>
                                {this.props.elements[this.props.active].tabName}
                            </Typography>
                            
                                
                            
                        </Toolbar>
                    </AppBar>
                
                    <nav className={classes.drawer}>
                        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                        <Hidden smUp implementation="css">
                            <Drawer
                                container={this.props.container}
                                variant="temporary"
                                anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                                open={this.state.mobileOpen}
                                onClose={this.handleDrawerToggle}
                                classes={{
                                    paper: classes.drawerPaper,
                                }}
                            >
                                {drawer}
                            </Drawer>
                        </Hidden>
                        <Hidden xsDown implementation="css">
                            <Drawer
                                classes={{
                                    paper: classes.drawerPaper,
                                }}
                                variant="permanent"
                                open
                                >
                                {drawer}
                            </Drawer>
                        </Hidden>
                    </nav>
                                        
                </div>
            </Fragment>
        );
    }
}

DashboardDrawer.propTypes = {
    classes: PropTypes.object.isRequired,
    // Injected by the documentation to work in an iframe.
    // You won't need it on your project.
    container: PropTypes.object,
    theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(DashboardDrawer);