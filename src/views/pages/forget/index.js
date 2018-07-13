import React from 'react';
import {Link} from 'react-router';
import {
    Form, Input, Label, FormGroup,Button,
    Card, CardBlock
} from 'reactstrap';

import '../style.scss';
import $ from "jquery";
import NotificationSystem from 'react-notification-system';
import {ValidateForm,EmailCheck} from '../../../Library/ValidateForm.js'
import config from "../../../config";
var weblocation = config["weblocation"]

export default class ForgetPass extends React.Component {
    constructor(props){
        super(props);
        this.form = {
            name: '',
            loginname: '',
            email: ''
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleSubmit(event) {
        event.preventDefault();


        if (this.form.name === '' ||this.form.loginname === '' || this.form.email === '') {
            let notification = {
                title: '消息',
                message: "请检测上述表单是否填写正确，然后再进行提交",
                level: 'error',
                position: 'bc',
                dismissible: true
            };
            this.notificationSystem.addNotification(notification);
            return
        }
        var router = this.context.router;
        var postbody = {
            peoplename: this.form.name,
            loginname: this.form.loginname,
            email: this.form.email
        };
        var obj = this;
        $.ajax({
            type: "POST",
            data: {json: JSON.stringify(postbody)},
            url: weblocation + "/user/resettoken",
            cache: false,
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            success: function (data) {

                var json = JSON.parse(data);
                if (json["condition"] === 160) {
                    let notification = {
                        title: '消息',
                        message: '密码重置邮件已发送至您的邮件,请注意查收,即将跳转到登陆界面',
                        level: 'success',
                        position: 'bc',
                        dismissible: true
                    };
                    obj.notificationSystem.addNotification(notification);
                    var refreshIntervalId =setInterval(function () {
                        obj.props.router.push('/pages/signin')
                        clearInterval(refreshIntervalId);
                    }, 2000);
                    //
                    //obj.setState({jump: true});

                    return
                } else {
                    obj.captcha.handleOnClick();
                    let notification = {
                        title: '消息',
                        message: json["message"],
                        level: 'error',
                        position: 'bc',
                        dismissible: true
                    };
                    obj.notificationSystem.addNotification(notification);
                    //alert(json["message"]);
                }

            }
        });

    }
    render() {
        return (
            <div className="view">
                <div
                    className="view-content view-pages view-session d-flex justify-content-center align-items-center flex-column">
                    <Card className="mb-3 form-card">
                        <CardBlock>
                            <header className="mb-5">
                                <Link to="/">
                                    <svg width="32px" height="44px" viewBox="11 6 50 42" style={{'marginLeft': '-4px'}}
                                         version="1.1" xmlns="http://www.w3.org/2000/svg">
                                        {/* <polyline id="Path" stroke="#4CAF50" strokeWidth="11" fill="none" points="21 36.6942904 49.6837349 30.667532 51.5974407 16 31.3353728 16 29.3402961 16 21 36.6942904 29.3402958 55.1487999 53.5974407 52.415905"></polyline> */}
                                        <path id="Path" stroke="#2962FF" strokeWidth="12" fill="none"
                                              d="M26.5282909,38.9526768 C26.5282909,38.9526768 49.3408202,31.7856836 49.3408202,28.3647852 C49.3408202,24.9438868 49.5702829,11.7001695 37.0898141,17.411107 C24.6093454,23.1220444 24.821289,23.6064453 24.821289,23.6064453 C24.821289,23.6064453 22.8105177,47.2876359 26.528291,53.5093155 C30.2460643,59.7309951 52.7998045,53.5093155 54.7998045,53.5093155"></path>
                                    </svg>
                                    <strong className="h3 text-uppercase" style={{color: '#212121'}}>WZQ</strong>
                                </Link>
                                <p className="lead">密码重置</p>
                            </header>
                            <Form action="/">
                                <FormGroup className="mb-4">
                                    <ValidateForm type="text" title="姓名" hint="张三" vadlidate={(obj, value) => {
                                        this.form.name = '';
                                        if (value.length === 0) {
                                            return [false, "请输入姓名"]
                                        } else if (value.length > 10) {
                                            return [false, "姓名长度不能超过10"]
                                        }
                                        this.form.name = value;
                                        return [true, ""];
                                    }}/>
                                    <ValidateForm type="text" title="用户名" hint="长度6-20" vadlidate={(obj, value) => {
                                        this.form.loginname = ''

                                        if (value.length === 0) {
                                            return [false, "用户名未输入"]
                                        } else if (value.length > 20) {
                                            return [false, "用户名长度不能超过20"]
                                        } else if (value.length < 6) {
                                            return [false, "用户名长度不能小于6"]
                                        }
                                        var b = /^[0-9a-zA-Z]*$/g;
                                        if (b.test(value) === false)
                                            return [false, "用户名只能为英文和数字组合"]
                                        this.form.loginname = value;
                                        return [true, ""]
                                    }}/>
                                    <ValidateForm type="text" title="电子邮箱" hint="example@example.com" vadlidate={(obj, value) => {
                                        this.form.email = ''

                                        if (value.length === 0) {
                                            return [false, "电子邮箱未输入"]
                                        } else if (value.length > 35) {
                                            return [false, "电子邮箱不能超过35"]
                                        }
                                        if (EmailCheck(value) === false)
                                            return [false, "电子邮箱输入不合法"]
                                        this.form.email = value
                                        return [true, ""]
                                    }}/>
                                </FormGroup>
                                <FormGroup className="text-right">
                                    <Button color='primary' onClick={this.handleSubmit}>重置密码</Button>{" "}
                                </FormGroup>
                                <NotificationSystem ref="notificationSystem"/>
                            </Form>
                            <p>想起来密码了?<Link to="/pages/signin">登录!</Link></p>
                        </CardBlock>
                    </Card>

                </div>
            </div>
        )

    }
}

