import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles(theme => ({
    card: props => ({
        maxWidth: "60%",
        marginTop: "2%",
        marginLeft: "auto",
        marginRight: "auto",
        [theme.breakpoints.down("sm")]: {
            maxWidth: "100%"
        }
    })
}));

export default function ResultExhibition(props) {
    const classes = useStyles();
    return (
        <Card className={classes.card}>
            <CardActionArea>
                <CardMedia
                    component="img"
                    alt="Resultado do dendrograma"
                    height="20%"
                    image={props.imageSrc}
                    title="Resultado do dendrograma"
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                        {props.resultsName}
                    </Typography>
                    <Typography
                        variant="body2"
                        color="textSecondary"
                        component="p"
                    >
                        {props.resultsObjective}
                    </Typography>
                </CardContent>
            </CardActionArea>
            <CardActions>
                <Button
                    size="small"
                    color="primary"
                    onClick={() => props.dendrogramDownload()}
                    href={
                        process.env.REACT_APP_ADMIN_API +
                        `/getResults/dendrogram/studyId=${props.studyId}`
                    }
                >
                    Baixar dendrograma
                </Button>
                <Button
                    size="small"
                    color="primary"
                    onClick={() => props.jsonDownload()}
                    href={
                        process.env.REACT_APP_ADMIN_API +
                        `/getResults/json/studyId=${props.studyId}`
                    }
                >
                    Baixar amostras
                </Button>
            </CardActions>
        </Card>
    );
}
