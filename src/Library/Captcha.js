import React from 'react';
import config from '../config'
import $ from "jquery";

var weblocation = config["weblocation"]

class Captcha extends React.Component {
    constructor(props) {
        super(props)
        this.handleOnClick = this.handleOnClick.bind(this);
        this.updateimage = this.updateimage.bind(this);

        this.handleOnClick()
        this.state = {imgb64: ""}
    }
    updateimage(image){
        this.setState({imgb64: "data:image/jpeg;base64," + image}) ;

    }
    handleOnClick() {
        var temp = this;

        $.ajax({
            type: "GET",
            url: weblocation + "/common/captcha?seed=" + Math.random(),
            cache: false,
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            success: function (data) {
                data=JSON.parse(data)
                temp.updateimage(data["data"])
            }
        });
        // this.setState({address: weblocation + "/user/captcha?seed="+Math.random()})

    }

    render() {
        return (
            <img onClick={this.handleOnClick} src={this.state.imgb64} data={this.props.refresh}/>
        )
    }
}

export default Captcha