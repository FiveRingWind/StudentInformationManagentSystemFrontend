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
import {ValidateForm,IdentityCheck,EmailCheck} from '../../../Library/ValidateForm.js'

const ViewHeader = () => (
    <div className="view-header">
        <header className="title text-white">
            <h1 className="h4 text-uppercase">修改邮箱</h1>
            <p className="mb-0"></p>
        </header>
    </div>
);

export default class ChangeEmail extends React.Component {
    constructor(props) {
        super(props);
        this.form={
            pwd:'',
            oldemail:'',
            newemail:''
        }
        this.handleSubmit = this.handleSubmit.bind(this);

    }
    componentDidMount() {
        this.notificationSystem = this.refs.notificationSystem;

    }

    handleSubmit(event) {
        event.preventDefault();


        if (this.form.oldemail === '' || this.form.newemail === ''||this.form.pwd === '') {
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
            pwd:this.form.pwd,
            email_old:this.form.oldemail,
            email_new:this.form.newemail
        };
        var obj = this;
        $.ajax({
            type: "POST",
            data: {json: JSON.stringify(postbody)},
            url: weblocation + "/user/changeemail",
            cache: false,
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            success: function (data) {

                var json = JSON.parse(data);
                if (json["condition"] === 150) {
                    let notification = {
                        title: '消息',
                        message: '邮箱修改成功,即将跳转至主界面',
                        level: 'success',
                        position: 'bc',
                        dismissible: true
                    };
                    obj.notificationSystem.addNotification(notification);
                    var refreshIntervalId =setInterval(function () {
                        obj.props.router.push('/')
                        clearInterval(refreshIntervalId);
                    }, 2000);
                    //
                    //obj.setState({jump: true});

                    return
                } else {
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
                        <ValidateForm type="password" title="密码" hint="长度应在8-16位之间，且包含数字与字母" vadlidate={(obj, value) => {
                            this.form.pwd = ''

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
                            this.form.pwd = value

                            return [true, ""]
                        }}/>
                        <ValidateForm type="text" title="原始邮箱" hint="example@example.com" vadlidate={(obj, value) => {
                            this.form.oldemail = ''

                            if (value.length === 0) {
                                return [false, "电子邮箱未输入"]
                            } else if (value.length > 35) {
                                return [false, "电子邮箱不能超过35"]
                            }
                            if (EmailCheck(value) === false)
                                return [false, "电子邮箱输入不合法"]
                            this.form.oldemail = value
                            return [true, ""]
                        }}/>
                        <ValidateForm type="text" title="新邮箱" hint="example@example.com" vadlidate={(obj, value) => {
                            this.form.newemail = ''

                            if (value.length === 0) {
                                return [false, "电子邮箱未输入"]
                            } else if (value!=this.form.oldemail) {
                                return [false, "两次输入不一致"]
                            }else{
                                this.form.newemail=value
                                return [true, ""]
                            }
                        }}/>
                        <Button color="primary" onClick={this.handleSubmit}>确认</Button>
                        <NotificationSystem ref="notificationSystem"/>
                    </form>
                </div>
            </div>

        )
    }
}