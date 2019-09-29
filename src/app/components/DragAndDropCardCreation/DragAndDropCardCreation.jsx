import React, { useState, useEffect } from "react";
import {
    sortableContainer,
    sortableElement,
    sortableHandle
} from "react-sortable-hoc";
import arrayMove from "array-move";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
import DragHandle from "@material-ui/icons/DragHandle";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles({
    root: {
        display: "flex",
        flexWrap: "wrap",
        flexGrow: 1,
        width: "100%"
    },
    studiesList: {
        width: "100%",
        flexGrow: 1
    }
});

const DragHandler = sortableHandle(() => <DragHandle></DragHandle>);

const SortableItem = sortableElement(({ card, index, key, removeCard }) => {
    return (
        <ListItem divider={true}>
            <ListItemIcon>
                <IconButton>
                    <DragHandler />
                </IconButton>
            </ListItemIcon>

            <ListItemText
                primary={card.name}
                secondary={<React.Fragment>{card.description}</React.Fragment>}
            ></ListItemText>
            <ListItemSecondaryAction>
                <IconButton
                    aria-label="Delete"
                    color="secondary"
                    onClick={removeCard}
                >
                    <DeleteIcon />
                </IconButton>
            </ListItemSecondaryAction>
        </ListItem>
    );
});

const SortableContainer = sortableContainer(({ children }) => {
    const classes = useStyles();
    return <List className={classes.studiesList}>{children}</List>;
});

export default function DragAndDropCardCreation(props) {
    const { cards } = props;

    const classes = useStyles();

    const [items, setItems] = useState(cards);

    useEffect(() => {
        setItems(cards);
    }, [cards]);

    const onSortEnd = ({ oldIndex, newIndex }) => {
        setItems(arrayMove(items, oldIndex, newIndex));
    };

    return (
        <div className={classes.root}>
            <SortableContainer
                useDragHandle={true}
                onSortEnd={onSortEnd}
                lockAxis={"y"}
                style={{"list-style-type": "none"}}
            >
                {items.map((card, index) => (
                    <SortableItem
                        removeCard={() => props.removeCard(index)}
                        key={`item-${index}`}
                        index={index}
                        card={card}
                    />
                ))}
            </SortableContainer>
        </div>
    );
}
