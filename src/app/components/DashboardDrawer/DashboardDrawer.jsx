import React , { Fragment, useState } from 'react';
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
import { makeStyles, createMuiTheme } from '@material-ui/core/styles';

const drawerWidth = 240;

let theme = createMuiTheme();

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexGrow: 1
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
        padding: theme.spacing(3),
    },
}));


export default function DashboardDrawer (props) {

    const [mobileOpen, setMobileOpen] = useState(false);

    const classes = useStyles(theme);

    const handleDrawerToggle = () => {
        setMobileOpen(true);
    };

    const drawer = (
        <div>
            <Hidden xsDown implementation="css">
                <div className={classes.toolbar} />
            </Hidden>
            <ListItem button key={"Logout"} onClick={() => props.logoutClick()}>
                <ListItemIcon>{<InputOutlinedIcon />}</ListItemIcon>
                <ListItemText primary={"Logout"} />
            </ListItem>
            <Divider />
            
            <List>
                {props.elements.map((element, index) => (
                    
                    <ListItem button key={element.tabName} selected={props.active === index} onClick={() => props.clickHandler(index)}>
                        <ListItemIcon>{props.elements[index].tabIcon}</ListItemIcon>
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
                    <Toolbar>
                        <IconButton
                        color="inherit"
                        aria-label="Open drawer"
                        onClick={handleDrawerToggle}
                        className={classes.menuButton}>

                            <MenuIcon />
                        </IconButton>
                        
                        <Typography variant="h6" color="inherit" className={classes.grow}>
                            {props.elements[props.active].tabName}
                        </Typography>
                        
                    </Toolbar>
                </AppBar>
            
                <nav className={classes.drawer}>
                    {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                    <Hidden smUp implementation="css">
                        <Drawer
                            container={props.container}
                            variant="temporary"
                            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                            open={mobileOpen}
                            onClose={handleDrawerToggle}
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
