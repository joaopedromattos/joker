import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';

const ITEM_HEIGHT = 48;

class ThreeDotsMenu extends React.Component {
    constructor(props){
        super(props)
        state = {
            anchorEl: null,

            // This state variable will receive an object like this:
            // {lable:"Name of the action", callback: () => yourCallback()}
            options: [...this.props.studyActions]
            
        };

    }
    

    handleClick = event => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleClose = () => {
        this.setState({ anchorEl: null });
    };

    clickHandler = (index) => {
        this.state.options[index].callback()
        this.handleClose()
    }
    

    render() {
        const { anchorEl } = this.state;
        const open = Boolean(anchorEl);

        return (
            <div>
                <IconButton
                    aria-label="More"
                    aria-owns={open ? 'long-menu' : undefined}
                    aria-haspopup="true"
                    onClick={this.handleClick}
                >
                    <MoreVertIcon />
                </IconButton>
                <Menu
                    id="long-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={this.handleClose}
                    PaperProps={{
                        style: {
                            maxHeight: ITEM_HEIGHT * 4.5,
                            width: 200,
                        },
                    }}
                >
                    {this.state.options.map((option, index) => (
                        <MenuItem key={index}  onClick={(index) => this.clickHandler(index)}>
                            {option.lable}
                        </MenuItem>
                    ))}
                </Menu>
            </div>
        );
    }
}

export default ThreeDotsMenu;