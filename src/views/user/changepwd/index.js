import React from 'react';
import {Table, Icon, Divider} from 'antd';
import {
    Form, Input, Label, FormGroup, Button, FormText,
    Card, CardBlock
} from 'reactstrap';
import $ from "jquery";
import {weblocation} from "../../../config";
import NotificationSystem from 'react-notification-system'
import Captcha from '../../../Library/Captcha.js'
import {ValidateForm} from '../../../Library/ValidateForm.js'

const ViewHeader = () => (
    <div className="view-header">
        <header className="title text-white">
            <h1 className="h4 text-uppercase">修改密码</h1>
            <p className="mb-0"></p>
        </header>
    </div>
);

export default class ChangePwd extends React.Component {
    constructor(props) {
        super(props);
        this.form={
            oldpwd:'',
            newpwd:'',
            renewpwd:'',
            captcha:''
        }
        this.state = {
            captchaaddress: weblocation + "/common/captcha?seed=" + Math.random(),
        };
        this.handleCaptchaClick = this.handleCaptchaClick.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

    }
    componentDidMount() {
        this.notificationSystem = this.refs.notificationSystem;

    }

    handleCaptchaClick(event) {
        this.setState({captchaaddress: weblocation + "/common/captcha?seed=" + Math.random()});

    }

    handleSubmit(event) {
        event.preventDefault();


        if (this.form.newpwd === '' || this.form.renewpwd === ''||this.form.newpwd!=this.form.renewpwd) {
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
            oldpassword:this.form.oldpwd,
            newpassword:this.form.newpwd,
        };
        var obj = this;
        $.ajax({
            type: "POST",
            data: JSON.stringify(postbody),
            url: weblocation + "/common/changespassword?captcha="+this.form.captcha,
            cache: false,
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            success: function (data) {

                var json = JSON.parse(data);
                if (json["code"] === 300) {
                    let notification = {
                        title: '消息',
                        message: '密码修改成功,即将跳转到登录页面',
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

        // $.post(weblocation + "/user/register", {json: JSON.stringify(postbody),}, function (data) {
        //
        // });

    }
    // componentDidMount() {
    //     var obj = this;
    //
    // }
    render() {
        return (
            <div className="view">
                <ViewHeader/>
                <div className="card-block" style={{padding:"10px",width:"500px",margin:"0 auto",marginTop:"50px"}}>
                    <form>
                        <ValidateForm type="password" title="旧密码" hint="当前登录密码" vadlidate={(obj, value) => {
                            this.form.oldpwd = value
                            return [true, ""]
                        }}/>
                        <ValidateForm type="password" title="密码" hint="长度应在8-16位之间，且包含数字与字母" vadlidate={(obj, value) => {
                            this.form.newpwd = ''

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
                            this.form.newpwd = value

                            return [true, ""]
                        }}/>
                        <ValidateForm type="password" title="确认密码" hint="与上面输入的密码相同" vadlidate={(obj, value) => {
                            this.form.renewpwd = ''
                            if(this.form.newpwd!='') {
                                if (value === '') {
                                    return [false, "没有输入确认密码"]
                                }
                                if (this.form.newpwd !== value) {
                                    return [false, "两次密码输入不一致"]
                                }
                            }
                            else{
                                return [false,""]
                            }
                            this.form.renewpwd = this.form.newpwd
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
                        }}/><br/>
                        <Button color="primary" onClick={this.handleSubmit}>确认</Button>
                        <NotificationSystem ref="notificationSystem"/>
                    </form>
                </div>
            </div>

        )
    }
}