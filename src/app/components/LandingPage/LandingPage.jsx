import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
// import "./LandingPage.scss";
import "./LandingPageOnly.scss";

import classnames from "classnames";
import slugify from "slugify";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";


const useStyles = makeStyles(theme => ({
    root: {
        margin: "auto",
        backgroundColor: "#0f0f0f"
    },
    icon: {
        marginRight: theme.spacing(2)
    },
    heroContent: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(8, 0, 6),
        boxShadow: "2px 2px 14px -4px rgba(0,0,0,0.72)"
    },
    heroButtons: {
        marginTop: theme.spacing(4)
    },
    menuButton: {
        // marginRight: theme.spacing(2)
    },
    title: {
        flexGrow: 1
    },
    footer: {
        padding: theme.spacing(2),
        marginTop: "auto",
        backgroundColor: "white",
        width: "100%",
        position: "sticky"
    },
    fapesp: {
        paddingTop: "12px",
        maxWidth: "70px"
    },
    usp: {
        maxWidth: "70px"
    }
}));

function LandingPage(props) {
    const propTypes = {
        // boards: PropTypes.arrayOf(
        //   PropTypes.shape({
        //     _id: PropTypes.string.isRequired,
        //     color: PropTypes.string.isRequired,
        //     title: PropTypes.string.isRequired
        //   }).isRequired
        // ).isRequired,
        listsById: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        dispatch: PropTypes.func.isRequired
    };

    const classes = useStyles();

    const enterAsGuest = () => {
        this.props.dispatch({ type: "ENTER_AS_GUEST" });
    };

    const { boards, listsById, history } = props;

    return (
        <React.Fragment>
            <Helmet>
                <title>Joker - An Open Source Card Sorting Application</title>
            </Helmet>
            <CssBaseline />

            <main className={classes.root}>
                {/* Hero unit */}

                <div className="landing-page-info-wrapper">
                    <div className={classes.heroContent}>
                        <Container maxWidth="sm">
                            <Typography
                                component="h1"
                                variant="h2"
                                align="center"
                                color="textPrimary"
                                gutterBottom
                            >
                                Joker
                            </Typography>
                            <Typography
                                variant="h5"
                                align="center"
                                color="textSecondary"
                                paragraph
                            >
                                An Open Source Card Sorting Application.
                            </Typography>
                            <div className={classes.heroButtons}>
                                <Grid container spacing={2} justify="center">
                                    <Grid item>
                                        <Button
                                            variant="contained"
                                            href="/boardAccess"
                                            color="primary"
                                        >
                                            Área do participante
                                        </Button>
                                    </Grid>
                                    <Grid item>
                                        <Button
                                            variant="outlined"
                                            // href="/researcherAuth"
                                            color="primary"
                                        >
                                            <Link
                                                to="/researcherAuth"
                                                style={{
                                                    color: "inherit",
                                                    textDecoration: "inherit"
                                                }}
                                            >
                                                Área do pesquisador
                                            </Link>
                                        </Button>
                                    </Grid>
                                </Grid>
                            </div>
                            <div className={classes.heroButtons}>
                                <Typography
                                    variant="caption"
                                    display="block"
                                    align="justify"
                                >
                                    Agradecimentos aos processos nº
                                    2018/19323-8, nº 2017/15239 - 0 e nº
                                    2015/24525 - 0, da Fundação de Amparo à
                                    Pesquisa do Estado de São Paulo (FAPESP),
                                    que financiaram esta pesquisa e o
                                    desenvolvimento deste projeto. Feito por:
                                    <span
                                        style={{ textDecoration: "underline" }}
                                    >
                                        Anderson Canale Garcia, André de Lima
                                        Salgado, Felipe Silva Dias, João Pedro
                                        R. Mattos e Renata P. M. Fortes.
                                    </span>
                                </Typography>
                            </div>
                            <br />
                            <div className={classes.heroButtons}>
                                <Grid
                                    container
                                    spacing={2}
                                    justify="space-evenly"
                                >
                                    <Grid item>
                                        <img
                                            src={
                                                "http://blog.institutocidadejardim.com.br/wp-content/uploads/2018/07/Logotipo-Fapesp-atualizado.png"
                                            }
                                            className={classes.fapesp}
                                        ></img>
                                    </Grid>
                                    <Grid item>
                                        <img
                                            src={
                                                "http://www.scs.usp.br/identidadevisual/wp-content/uploads/2013/08/usp-logo-png.png"
                                            }
                                            alt="Logotipo Universidade de São Paulo"
                                            className={classes.usp}
                                        />
                                    </Grid>
                                </Grid>
                            </div>
                        </Container>
                    </div>
                </div>
            </main>
            {/* <footer position="relative" className={classes.footer}>
                <Container maxWidth="sm">
                    <Typography variant="body1">
                        My sticky footer can be found here.
                    </Typography>
                </Container>
            </footer> */}
        </React.Fragment>
    );
}

const mapStateToProps = state => ({
    boards: Object.values(state.boardsById),
    listsById: state.listsById
});

export default connect(mapStateToProps)(LandingPage);

/*

*/
