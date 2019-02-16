// Modularized binary dialog component. 

import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import withMobileDialog from '@material-ui/core/withMobileDialog';

class BinaryDialog extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            open: false,
        }
        
    }
    

    handleClickOpen = () => {
        this.setState({ open: true });
    };

    handleClose = () => {
        this.setState({ open: false });
    };

    

    render() {
        const { fullScreen } = this.props;

        return (
            <div>                
                <Dialog
                    fullScreen={fullScreen}
                    open={this.props.open}
                    onClose={this.handleClose}
                    aria-labelledby="responsive-dialog-title"
                >
                    <DialogTitle id="responsive-dialog-title">{`${this.props.title}`}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {this.props.text}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => this.props.denial()} color="primary">
                            {this.props.denialButton}
                        </Button>
                        <Button onClick={() => this.props.granted()} color={this.props.changeConfirmationColor ? "secondary" : "primary"} autoFocus>
                            {this.props.grantedButton}
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

BinaryDialog.propTypes = {
    fullScreen: PropTypes.bool.isRequired,
};

export default withMobileDialog()(BinaryDialog);
