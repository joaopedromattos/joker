// Modularized binary dialog component. 
// Props: denial, confirmation, text, denialButton, grantedButton
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

    permissionGranted = () => {
        this.props.confirmation()
        this.handleClose()
    }

    permissionDenied = () => {
        this.props.denial()
        this.handleClose()
    }

    

    render() {
        const { fullScreen } = this.props;

        return (
            <div>                
                <Dialog
                    fullScreen={fullScreen}
                    open={true}
                    onClose={this.handleClose}
                    aria-labelledby="responsive-dialog-title"
                >
                    <DialogTitle id="responsive-dialog-title">{"Use Google's location service?"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {this.props.text}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => this.permissionDenied()} color="primary">
                            {this.props.denialButton}
                        </Button>
                        <Button onClick={() => this.permissionGranted()} color="primary" autoFocus>
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
