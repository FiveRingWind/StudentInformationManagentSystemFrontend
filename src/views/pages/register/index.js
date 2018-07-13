import React from 'react';
import Mock from 'mockjs';

import $ from 'jquery';

import {Link, IndexLink} from 'react-router';

import {
    Form, Input, Label, FormGroup, Button, FormText, FormFeedback,
    Card, CardBlock
} from 'reactstrap';
import NotificationSystem from 'react-notification-system';
import Captcha from '../../../Library/Captcha.js'
import '../style.scss';
import config from '../../../config'
import {ValidateForm, IdentityCheck, EmailCheck} from '../../../Library/ValidateForm.js'

var weblocation = config["weblocation"]
// var Mock = require('mockjs');
// var data = Mock.mock(weblocation + "/user/vadliidateidentity", function (option) {
//     return ({"condition": 0, "message": "wzq"})
// }).mock(weblocation + "/user/vadlidateuser", function (option) {
//     return ({"condition": 0, "message": "wzq"})
// });
//
// data.mock(weblocation + "/user/register", function (option) {
//     return ({"condition": 130, "message": "注册成功"})
//
// })
//
// data.mock(weblocation + "/user/register", function (option) {
//     return ({"condition": 131, "message": "验证码错误"})
//
// })


class FormFinal extends React.Component {
    constructor(props) {
        super(props);
        this.form = {
            name: '',
            identity: '',
            loginname: '',
            password: '',
            repassword: '',
            captcha: '',
            telephone: '',
            email: ''
        };

        this.state = {
            captchaaddress: weblocation + "/user/captcha?seed=" + Math.random(),
        };
        this.handleCaptchaClick = this.handleCaptchaClick.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

    }

    componentDidMount() {
        this.notificationSystem = this.refs.notificationSystem;

    }

    handleCaptchaClick(event) {
        this.setState({captchaaddress: weblocation + "/user/captcha?seed=" + Math.random()});

    }

    handleSubmit(event) {
        event.preventDefault();


        if (this.form.name === '' || this.form.identity === '' || this.form.loginname === '' || this.form.password === '' || this.form.repassword === '' || this.form.captcha === '' || this.form.telephone === '' || this.form.email === '') {
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
            identity: this.form.identity,
            loginname: this.form.loginname,
            password: this.form.password,
            captcha: this.form.captcha,
            telephone: this.form.telephone,
            email: this
                .form.email
        };
        var obj = this;
        $.ajax({
            type: "POST",
            data: {json: JSON.stringify(postbody)},
            url: weblocation + "/user/register",
            cache: false,
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            success: function (data) {

                var json = JSON.parse(data);
                if (json["condition"] === 130) {
                    let notification = {
                        title: '消息',
                        message: '注册成功，即将跳转到登陆界面',
                        level: 'success',
                        position: 'bc',
                        dismissible: true
                    };
                    obj.notificationSystem.addNotification(notification);
                    var refreshIntervalId = setInterval(function () {
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

        // $.post(weblocation + "/user/register", {json: JSON.stringify(postbody),}, function (data) {
        //
        // });

    }

    render() {
        return (
            <form>
                <ValidateForm type="text" title="姓名" hint="张三"  vadlidate={(obj, value) => {
                    this.form.name = '';
                    if (value.length === 0) {
                        return [false, "请输入姓名"]
                    } else if (value.length > 10) {
                        return [false, "姓名长度不能超过10"]
                    }
                    this.form.name = value;
                    return [true, ""];
                }}/>
                <ValidateForm type="text" title="身份证号码" hint="18位身份证号码" vadlidate={(obj, value) => {
                    this.form.identity = '';
                    if (value.length === 0) {
                        return [false, "身份证未输入"];
                    }
                    if (!IdentityCheck(value))
                        return [false, "身份证非法,请检查"];
                    var temp = this;
                    $.post(weblocation + "/user/vadliidateidentity", {
                        json: JSON.stringify({
                            identity: value,
                        }),
                    }, function (data) {
                        var json = JSON.parse(data);

                        if (json["condition"] !== 0) {
                            obj.seterror(false, json["message"]);
                        } else {
                            temp.form.identity = value
                            obj.seterror(true, json["message"]);

                        }
                    });
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
                    var temp = this

                    $.post(weblocation + "/user/vadlidateuser", {
                        json: JSON.stringify({
                            loginname: value,
                        }),
                    }, function (data) {
                        var json = JSON.parse(data);
                        if (json["condition"] != 0) {
                            obj.seterror(false, json["message"]);
                        } else {
                            temp.form.loginname = value
                            obj.seterror(true, json["message"]);
                        }
                    });

                    return [true, ""]
                }}/>
                <ValidateForm type="text" title="手机号码" hint="11位手机号码" vadlidate={(obj, value) => {
                    this.form.telephone = ''
                    if (value.length === 0) {
                        return [false, "手机号码未输入"]
                    } else if (value.length !== 11) {
                        return [false, "手机号码长度不正确"]
                    }
                    var b = /^1[3|4|5|7|8][0-9]{9}$/g

                    if (b.test(value) === false)
                        return [false, "手机号码输入不合法"]
                    this.form.telephone = value
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
                <ValidateForm type="password" title="密码" hint="长度应在8-16位之间，且包含数字与字母" vadlidate={(obj, value) => {
                    this.form.password = ''

                    if (value.length === 0) {
                        return [false, "密码未输入"]
                    } else if (value.length < 8) {
                        return [false, "密码长度不能小于8位"]
                    } else if (value.length > 20) {
                        return [false, "密码长度不能超过20位"]
                    }
                    var b = new RegExp(/[A-Za-z].*[0-9]|[0-9].*[A-Za-z]/);
                    if (b.test(value) === false)
                        return [false, "密码需要包含字母和数字"]
                    this.form.password = value

                    return [true, ""]
                }}/>
                <ValidateForm type="password" title="确认密码" hint="与上面输入的密码相同" vadlidate={(obj, value) => {
                    this.form.repassword = ''
                    if (value === '') {
                        return [false, "没有输入确认密码"]
                    }
                    if (this.form.password !== value) {
                        return [false, "两次密码输入不一致"]
                    }
                    this.form.repassword = this.form.password
                    return [true, '']
                }}/>
                <ValidateForm type="text" title="验证码" hint="请输入验证码" vadlidate={(obj, value) => {
                    this.form.captcha = ''
                    if (value === '') {
                        return [false, "没有输入验证码"]
                    }
                    this.form.captcha = value
                    return [true, '']
                }}/>
                <Captcha ref={(captcha) => {
                    this.captcha = captcha;
                }}/>
                {/*<img src={this.state.captchaaddress} onClick={this.handleCaptchaClick}/>*/}
                <FormGroup className="text-right">
                    <Button color="success" block size="lg" onClick={this.handleSubmit}>注册</Button>
                </FormGroup>
                <NotificationSystem ref="notificationSystem"/>
                {/*<Image src={weblocation+"/user/captcha"} rounded />*/}
            </form>
        );
    }
}

export default class Register extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="view">
                <div
                    className="view-content view-pages view-session d-flex justify-content-center align-items-center flex-column">
                    <Card className="mb-3 form-card">
                        <CardBlock>
                            <header className="mb-5">
                                <Link>
                                    <svg width="32px" height="44px" viewBox="11 6 50 42" style={{'marginLeft': '-4px'}}
                                         version="1.1" xmlns="http://www.w3.org/2000/svg">
                                        {/* <polyline id="Path" stroke="#4CAF50" strokeWidth="11" fill="none" points="21 36.6942904 49.6837349 30.667532 51.5974407 16 31.3353728 16 29.3402961 16 21 36.6942904 29.3402958 55.1487999 53.5974407 52.415905"></polyline> */}
                                        <path id="Path" stroke="#2962FF" strokeWidth="12" fill="none"
                                              d="M26.5282909,38.9526768 C26.5282909,38.9526768 49.3408202,31.7856836 49.3408202,28.3647852 C49.3408202,24.9438868 49.5702829,11.7001695 37.0898141,17.411107 C24.6093454,23.1220444 24.821289,23.6064453 24.821289,23.6064453 C24.821289,23.6064453 22.8105177,47.2876359 26.528291,53.5093155 C30.2460643,59.7309951 52.7998045,53.5093155 54.7998045,53.5093155"></path>
                                    </svg>
                                    <strong className="h3 text-uppercase" style={{color: '#212121'}}>五环风科技</strong>
                                </Link>
                                <p className="lead">用户注册</p>
                            </header>
                            <FormFinal router={this.props.router}/>
                        </CardBlock>
                        {/*<NotificationSystem ref="notificationSystem"/>*/}

                    </Card>
                </div>
            </div>)
    }
}
