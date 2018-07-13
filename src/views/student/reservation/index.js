import React from 'react';
import 'antd/dist/antd.css';
import './style.css';
import {weblocation} from '../../../config'
import NotificationSystem from 'react-notification-system';

import $ from "jquery";

import {Steps, Form, Select, Radio, Upload, Icon, Button, Input} from 'antd';
// import {Button} from  'reactstrap'
const {TextArea} = Input;
const FormItem = Form.Item;
const Option = Select.Option;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const Step = Steps.Step;
const ViewHeader = () => (
    <div className="view-header">
        <header className="title text-white">
            <h1 className="h4 text-uppercase">免测申请</h1>
            <p className="mb-0">您需要上传您的病历照片或者其他可以证明因故不能参加考试的照片</p>
        </header>
    </div>
);
var notification;
var uploadimage;
var pass = -1;

function beforeUpload(file) {
    const isJPG = file.type === 'image/jpeg';
    const isPNG = file.type === 'image/png';

    if (!(isJPG || isPNG)) {
        let message = {
            title: '消息',
            message: "请上传以jpg或jpeg或png结尾的图片",
            level: 'error',
            position: 'bc',
            dismissible: true
        };
        notification.addNotification(message);
        return false
    }
    const isLt2M = file.size / 1024 / 1024 < 1;
    if (!isLt2M) {
        let message = {
            title: '消息',
            message: "上传的图像大小请不要大于1M",
            level: 'error',
            position: 'bc',
            dismissible: true
        };
        notification.addNotification(message);
        return false
        // message.error('Image must smaller than 2MB!');
    }
    return true;
}

class UploadImage extends React.Component {
    constructor(props) {
        super(props);
        console.log(this.props.uploadidcard)
        this.state = {
            imgcard: this.props.imgcard,
            uploadidcard: "正在加载...",
            uploadself: "正在加载..."
        }
        // this.beforeUpload = this.beforeUpload.bind(this)
        this.parent = this.props.parent;
        this.handleButtonClick = this.handleButtonClick.bind(this);
        this.handleonChangeidcard = this.handleonChangeidcard.bind(this);
    }

    handleButtonClick() {
        var obj = this;
        this.refs.myTextInput.focus()
        console.log(this.refs.myTextInput)
        var postbody = {
            reason: this.refs.myTextInput.textAreaRef.value
        }
        $.ajax({
            type: "POST",
            url: weblocation + "/freetest/apply",
            cache: false,
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            data: {json: JSON.stringify(postbody)},
            success: function (data) {
                var json = JSON.parse(data);
                if (json["condition"] == 510) {
                    let message = {
                        title: '消息',
                        message: "申请提交成功",
                        level: 'success',
                        position: 'bc',
                        dismissible: true
                    };
                    notification.addNotification(message);
                    var refreshIntervalId = setInterval(function () {
                        obj.parent.reloadStatus();
                        clearInterval(refreshIntervalId);

                    }, 1000);
                    return;
                }
                let message = {
                    title: '消息',
                    message: json["message"],
                    level: 'error',
                    position: 'bc',
                    dismissible: true
                };
                notification.addNotification(message);

            }
        });
    }

    handleonChangeidcard(info) {
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            this.setState({
                uploadidcard: "点击修改",
                imgcard: weblocation + "/freetest/download?&rand=" + Math.random()
            });
        }
    }

    render() {
        return (
            <div className="section">
                <span className="section-title">上传图片</span>
                <br/>
                <Upload name="image" action={weblocation + "/freetest/upload"}
                        onChange={this.handleonChangeidcard} listType="text"
                        beforeUpload={beforeUpload} withCredentials={true} parent={this}>
                    <Button type="primary">
                        <Icon type="upload"/> {this.state.uploadidcard}
                    </Button>
                </Upload>
                <br/>
                <img src={this.state.imgcard} height="100" width="100"
                     style={this.state.imgcard === "" ? {display: 'none'} : {}}/>
                <br/>
                <div style={{margin: '24px 0'}}>
                    <TextArea placeholder="请在此输入您的免测理由,字数不超过200字" autosize={{minRows: 2, maxRows: 6}}
                              ref="myTextInput"/>
                </div>
                <Button type="primary" onClick={this.handleButtonClick}>
                    提交认证
                </Button>
            </div>
        )
    }
}

class Sensoring extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div style={{marginLeft:"50%",marginTop:"20%"}}>
                <Icon type="check-circle" style={{fontSize: 35, color: '#4ba72f'}}/>
                <span className='sensor-title'>
                    正在等待老师进行审核
                </span>
            </div>
        )
    }
}

class Result extends React.Component {
    constructor(props) {
        super(props)

    }

    render() {
        if (pass === 1) {
            return (
                <div style={{marginLeft:"50%",marginTop:"20%"}}>
                    <Icon type="check-circle" style={{fontSize: 35, color: '#4ba72f'}}/>
                    <span className='sensor-title'>
                        恭喜您已成功通过审核
                        </span>
                </div>
            )
        }
        else if (pass === 2) {
            return (
                <div style={{marginLeft:"50%",marginTop:"20%"}}>
                    <Icon type="close-circle" style={{fontSize: 35, color: '#FF4040'}}/>
                    <span className='sensor-title'>
                        很遗憾,您未能通过审核
                        </span>
                </div>
            )
        }
        else {
            return (<div className="section">
                <div>
                    <label>未知错误 :{pass}</label>
                </div>
            </div>)
        }
    }
}

export default class Certification extends React.Component {
    constructor(props) {
        super(props)
        this.reloadStatus = this.reloadStatus.bind(this);

        this.state = {step: -1}
    }

    componentDidMount() {
        this.reloadStatus();
        notification = this.refs.notificationSystem;
        uploadimage = this.refs.uploadimage;
    }

    reloadStatus() {
        var obj = this;
        $.ajax({
                type: "GET",
                url: weblocation + "/freetest/status",
                cache: false,
                crossDomain: true,
                xhrFields: {
                    withCredentials: true
                },
                success: function (data) {

                    var json = JSON.parse(data);
                    if (json["condition"] == 542) {
                        obj.setState({step: 1});//审核中
                        return
                    } else if (json["condition"] == 543 || json["condition"] == 544) {
                        pass = json["condition"] - 542;
                        obj.setState({step: 2});//审核结果  1为成功 2为失败
                    } else {
                        obj.setState({step: 0});//未提交审核
                        if (json["condition"] == 541) {
                            obj.refs.uploadimage.setState({
                                uploadidcard: "点击修改",
                                imgcard: weblocation + "/freetest/download?&rand=" + Math.random()
                            });
                        }
                        else {
                            obj.refs.uploadimage.setState({uploadidcard: "点击上传", imgcard: ""});
                        }
                    }
                }
            }
        )

    }

    render() {
        return (
            <div className="view">
                <ViewHeader/>
                <NotificationSystem ref="notificationSystem"/>
                <h1 className="main-title">
                    <span>获取准考证</span>
                </h1>
                <div className="beian-flow">
                    <div className="beian-flow-guide">
                        <div className="guide-box">
                            <Steps direction="vertical" current={this.state.step}>
                                <Step title="上传资料" description="上传病历照片或者其他能够证明不能按要求参加测试的图片"/>
                                <Step title="资料审核" description="等待任课老师审核"/>
                                <Step title="审核结果" description=""/>
                            </Steps>
                        </div>
                    </div>
                    <div className="tc-panel">
                        {this.state.step === 0 && (<UploadImage ref="uploadimage" parent={this}/>)}
                        {this.state.step === 1 && (<Sensoring/>)}
                        {this.state.step === 2 && (<Result/>)}
                    </div>
                </div>
            </div>
        )
    }
}
