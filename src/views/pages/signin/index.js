import React from 'react';
import 'antd/dist/antd.css';

import {Link} from 'react-router';
import {
    Form, Input, Label, FormGroup, Button, FormText,
    Card, CardBlock
} from 'reactstrap';
import '../style.css';
import {Radio} from 'antd';
import NotificationSystem from 'react-notification-system';

import {ValidateForm, IdentityCheck, EmailCheck} from '../../../Library/ValidateForm.js'
import config from '../../../config'
import Captcha from '../../../Library/Captcha.js'
import $ from "jquery";
import img from '../signin/logo.png';
var weblocation = config["weblocation"]


const RadioGroup = Radio.Group;

class FormLogin extends React.Component {
    constructor(props) {
        super(props);
        this.handleCheckChange = this.handleCheckChange.bind(this);
        this.handleSubmitClick = this.handleSubmitClick.bind(this);
        this.updateloginname = this.updateloginname.bind(this);
        this.logintype = 0;
        this.form = {
            username: '',
            type: '',
            password: '',
            captcha: '',
        };
        this.state = {
            captchaaddress: weblocation + "/common/captcha?seed=" + Math.random(),
        };
        this.handleCaptchaClick = this.handleCaptchaClick.bind(this);

        // this.logintype=this.state.checkvalue
    }


    handleCaptchaClick(event) {
        this.setState({captchaaddress: weblocation + "/common/captcha?seed=" + Math.random()});

    }

    componentDidMount() {
        this.updateloginname();
        this.notificationSystem = this.refs.notificationSystem;

    }

    updateloginname() {
        switch (this.logintype) {
            case 1:
                this.setState({logintype: "学号", loginhint: "201301060223", typeid: 1})
                break
            case 2:
                this.setState({logintype: "登录账户", loginhint: "admin", typeid: 2})
                break
            case 3:
                this.setState({logintype: "登录账户", loginhint: "admin", typeid: 3})
                break
        }
        this.form.username = '';
        this.userinput.clear();
    }

    handleCheckChange(event) {
         // event.preventDefault();
        this.logintype = event.target.value;
        this.updateloginname();

        // return true;

    }

    handleSubmitClick(event) {
        event.preventDefault();
        if (this.form.username === '' || this.form.password === '' || this.form.captcha === '') {
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
        var postbody = {
            username: this.form.username,
            password: this.form.password,
            captcha: this.form.captcha,
            type: this.logintype
        };
        var obj = this;
        $.ajax({
            type: "POST",
            data: JSON.stringify(postbody),
            url: weblocation + "/common/login",
            cache: false,
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            success: function (data) {

                var json = JSON.parse(data);
                if (json["code"] === 100) {
                    let notification = {
                        title: '消息',
                        message: '登录成功，即将跳转到主界面',
                        level: 'success',
                        position: 'bc',
                        dismissible: true
                    };
                    obj.notificationSystem.addNotification(notification);
                    var refreshIntervalId = setInterval(function () {
                        obj.props.router.push('/')
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
                }

            }
        })
    }

    render() {

        return (
            <Form>
                <FormGroup className="mb-4">
                    <Label>登陆方式</Label>
                    <RadioGroup onChange={this.handleCheckChange} value={this.state.typeid}>
                        <Radio value={1}>学生</Radio>
                        <Radio value={2}>辅导员</Radio>
                        <Radio value={3}>管理员</Radio>
                    </RadioGroup>
                </FormGroup>
                <ValidateForm type="text" title={this.state.logintype} hint={this.state.loginhint} ref={(userinput) => {
                    this.userinput = userinput
                }}
                              vadlidate={(obj, value) => {
                                  this.form.username = '';
                                  if (value.length === 0) {
                                      return [false, "用户名未输入"];
                                  }
                                  this.form.username = value;
                                  return [true, ""]
                              }}/>
                <ValidateForm type="password" title="密码" hint="用户登录密码" ref={(passwordinput) => {
                    this.passwordinput = passwordinput
                }}
                              vadlidate={(obj, value) => {
                                  this.form.password = '';
                                  if (value.length === 0) {
                                      return [false, "密码未输入"];
                                  }
                                  this.form.password = value;
                                  return [true, ""];
                              }}/>
                <FormText className="text-right"><Link to="/pages/forget">忘了密码?</Link></FormText>
                <ValidateForm type="text" title="验证码" hint="请输入验证码" vadlidate={(obj, value) => {
                    this.form.captcha = '';
                    if (value === '') {
                        return [false, "没有输入验证码"];
                    }
                    this.form.captcha = value;
                    return [true, '']
                }}/>
                <Captcha ref={(captcha) => {
                    this.captcha = captcha;
                }}/>
                <FormGroup className="text-right">
                    <Button color="primary" onClick={this.handleSubmitClick}>登陆</Button>
                </FormGroup>
                <NotificationSystem ref="notificationSystem"/>

            </Form>
        )
    }
}


export default class SignIn extends React.Component {
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
                                <img src={img} style={{width:60,height:40}}/>
                                <strong className="h3 text-uppercase" style={{color: '#212121'}}>学生信息管理系统</strong>
                            </Link>
                            <p className="lead">用户登陆</p>
                        </header>
                        <FormLogin router={this.props.router}/>
                    </CardBlock>
                </Card>
            </div>
        </div>)
    }
}

