import React, {Component} from "react";
import Card from "@material-ui/core/Card";

class OAuth extends Component{

    // We store user's current status, if he/she is logged or not
    state = {
        user: {},
        disabled: ''
    }

    // When the component is mounted, it automatically sets user's state and takes his/her data.
    componentDidMount(){
        const {socket, provider } = this.props

        socket.on(provider, user => {
            this.popup.close()
            this.setState({user})
        })
    }


    // Checking continuously user's state to update login button state.
    checkPopup() {
        const check = setInterval(() => {
            const { popup } = this
            if (!popup || popup.closed || popup.closed === undefined) {
                clearInterval(check)
                this.setState({ disabled: ''})
            }
        }, 1000)
    }

    // When the popup is opened, we pass the socket id to the request, making the user receive the correct data.
    openPopup() {
        const { provider, socket } = this.props
        const width = 600, height = 600
        const left = (window.innerWidth / 2) - (width / 2)
        const top = (window.innerHeight / 2) - (height / 2)
        const url = `${API_URL}/${provider}?socketId=${socket.id}`

        return window.open(url, '',       
            `toolbar=no, location=no, directories=no, status=no, menubar=no, 
            scrollbars=no, resizable=no, copyhistory=no, width=${width}, 
            height=${height}, top=${top}, left=${left}`
        )
    }

    // Disables login button while popup is open
    startAuth(e) {
        if (!this.state.disabled) {
            e.preventDefault()
            this.popup = this.openPopup()  
            this.checkPopup()
            this.setState({disabled: 'disabled'})
        }
    }

    // Closes the card.
    closeCard() {
        this.setState({user: {}})
    }
    

    // render(){
    //     // Taking user's data to show.
    //     const {name, photo} = this.state.user
    //     const { provider } = this.props
    //     const { disabled } = this.state

    //     return (
    //         <div>{
    //             name?
                
    //             // 
    //         }</div>
    //     )
    // }

}

export default OAuth;