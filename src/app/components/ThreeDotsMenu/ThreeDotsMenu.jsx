import React from "react";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Fade from "@material-ui/core/Fade";
import MoreVertIcon from "@material-ui/icons/MoreVert";

const ITEM_HEIGHT = 48;

class ThreeDotsMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            anchorEl: null,

            // This state variable will receive an object like this:
            // {lable:"Name of the action", callback: () => yourCallback()}
            options: [...this.props.studyLables],
            callbacks: this.props.callbacks,
            elementIndex: this.props.elementIndex
        };
    }

    handleClick = event => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleClose = () => {
        this.setState({ anchorEl: null });
    };

    clickHandler = action => {
        this.props.callbacks(action, this.state.elementIndex);
        this.handleClose();
    };

    render() {
        const { anchorEl } = this.state;
        const open = Boolean(anchorEl);

        return (
            <div>
                <IconButton
                    aria-label="More"
                    aria-owns={open ? "fade-menu" : undefined}
                    aria-haspopup="true"
                    onClick={this.handleClick}
                >
                    <MoreVertIcon />
                </IconButton>
                <Menu
                    id="fade-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={this.handleClose}
                    PaperProps={{
                        style: {
                            maxHeight: ITEM_HEIGHT * 4.5,
                            width: "100%",
                            maxWidth: 360
                        }
                    }}
                >
                    {this.state.options.map((option, index) => (
                        <MenuItem
                            key={index}
                            onClick={() => this.clickHandler(index)}
                        >
                            <div>{option}</div>
                        </MenuItem>
                    ))}
                </Menu>
            </div>
        );
    }
}

export default ThreeDotsMenu;
