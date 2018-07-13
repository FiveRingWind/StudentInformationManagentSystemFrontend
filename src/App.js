import React from 'react';
import Nav from './shared/components/nav';
import SiteHead from './shared/components/header';

import './app.css';
import $ from "jquery";
import {weblocation} from "./config";

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {navMini: false,condition :''}
        var obj = this;
        $.ajax({
            type: "GET",
            url: weblocation + "/common/viewinfo",
            cache: false,
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            success: function (data) {
                var json = JSON.parse(data);
                obj.setState({condition:json['code']})
            }
        });
    }
    toggleNav = (e) => {
        e.preventDefault();
        this.setState({navMini: !this.state.navMini});
    }
    hideNav = (e) => {
        e.stopPropagation();
        e.preventDefault();
        this.setState({navMini: false})
    }
    render() {
        var obj = this;
        let navMini = this.state.navMini;
        return (
            <div className="app-wrapper">
                <Nav mini={navMini} toggleNav={this.toggleNav}/>
                <div className={`content-container ${navMini ? 'full' : ''}`}>
                    {/* dropshadow for mobile nav triggering */}
                    <div className="menu-dropshadow" style={{display: (navMini ? 'block': 'none')}} onClick={this.hideNav}></div>
                    <SiteHead toggleNav={this.toggleNav} router={this.props.router}/>
                    {this.props.children}
                </div>
            </div>
        )
    }
}
