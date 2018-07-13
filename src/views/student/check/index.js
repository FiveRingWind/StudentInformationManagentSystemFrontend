import React from 'react';
import 'antd/dist/antd.css';
import './style.css';
import {weblocation} from '../../../config'
import NotificationSystem from 'react-notification-system';

import $ from "jquery";

import {Steps, Form, Select, Radio, Upload, Icon, Button} from 'antd';
// import {Button} from  'reactstrap'
const FormItem = Form.Item;
const Option = Select.Option;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

const Step = Steps.Step;
const ViewHeader = () => (
    <div className="view-header">
        <header className="title text-white">
            <h1 className="h4 text-uppercase">身份认证</h1>
            <p className="mb-0">您需要上传您最近的自拍照片(不能使用美颜或PS等技术修改)作为准考证照片，上传身份证照片完成身份对比</p>
        </header>
    </div>
);
var notification='';
var uploadimage='';

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
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        let message = {
            title: '消息',
            message: "上传的图像大小请不要大于2M",
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
            imgself: this.props.imgself,
            imgcard: this.props.imgcard,
            uploadidcard: "正在加载...",
            uploadself: "正在加载..."
        }
        // this.beforeUpload = this.beforeUpload.bind(this)
        this.parent = this.props.parent;
        this.handleButtonClick = this.handleButtonClick.bind(this);
        this.handleonChangeidcard = this.handleonChangeidcard.bind(this);
        this.handleonChangeselfphoto = this.handleonChangeselfphoto.bind(this);
    }

    handleButtonClick() {
        var obj = this;

        $.ajax({
            type: "GET",
            url: weblocation + "/stu/check/verify",
            cache: false,
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            success: function (data) {
                var json = JSON.parse(data);
                if (json["condition"] == 0) {
                    let message = {
                        title: '消息',
                        message: "系统自动审核通过，即将进入下一步下载准考证",
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
                    level: 'success',
                    position: 'bc',
                    dismissible: true
                };
                notification.addNotification(message);

            }
        });
    }

    handleonChangeselfphoto(info) {
        if (info.file.status === 'done') {

            // Get this url from response in real world.
            this.setState({
                uploadself: "点击修改",
                imgself: weblocation + "/stu/check/download/selfphoto?rand=" + Math.random()
            });

        }
    }

    handleonChangeidcard(info) {
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            this.setState({
                uploadidcard: "点击修改",
                imgcard: weblocation + "/stu/check/download/idcardphoto?rand=" + Math.random()
            });

        }
    }
    handleOnClick(event) {
        event.preventDefault();
        window.open(weblocation + "/stu/check/download/adminssioncard");
    }
    render() {

        return (
            <div className="section" style={{marginLeft: "20%", marginTop: "20%"}}>

                <Button type="primary" onClick={this.handleOnClick}>
                    点击下载准考证
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
            <div className="section">
                <Icon type="check-circle" style={{fontSize: 35, color: '#4ba72f'}}/>
                <span className='sensor-title'>
                    身份信息正在审核当中
                </span>
                <br/>
                <span>
                    由于您的证件照与自拍照相差太大，系统未能自动对比，请等待老师进行人工审核
                </span>
            </div>
        )
    }
}

class DownloadCard extends React.Component {
    constructor(props) {
        super(props)
        this.handleOnClick = this.handleOnClick.bind(this)


    }

    handleOnClick(event) {
        event.preventDefault();
        window.open(weblocation + "/stu/check/download/adminssioncard");
    }

    render() {
        return (<div style={{marginLeft: "20%", marginTop: "20%"}}>
            <div>
                <Icon type="info-circle" style={{fontSize: 35, color: '#1E90FF'}}/>
                <span className='sensor-title'>
                    注意
                </span>
                <br/><br/>
                <p>
                    1.下载准考证<br/>

                </p>
                <p>
                    2.打印准考证<br/>
                </p>
                <p>
                    3.携带准考证参加考试<br/>
                </p>
            </div>

            <Button type="primary" onClick={this.handleOnClick}>
                点击下载准考证
            </Button>

        </div>)

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
            url: weblocation + "/stu/check/status",
            cache: false,
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            success: function (data) {

                var json = JSON.parse(data);
                if (json["checked"] == true) {
                    obj.setState({step: 2});
                    return
                } else if (json["count"] > 3) {
                    obj.setState({step: 1});
                } else {
                    obj.setState({step: 0});
                    if (json["identityphoto"] == true) {
                        obj.refs.uploadimage.setState({
                            uploadidcard: "点击修改",
                            imgcard: weblocation + "/stu/check/download/idcardphoto?rand=" + Math.random()
                        });
                    } else {
                        obj.refs.uploadimage.setState({uploadidcard: "点击上传", imgcard: ""});
                    }
                    if (json["selfphoto"] == true) {
                        obj.refs.uploadimage.setState({
                            uploadself: "点击修改",
                            imgself: weblocation + "/stu/check/download/selfphoto?rand=" + Math.random()
                        });
                    } else {
                        obj.refs.uploadimage.setState({uploadself: "点击上传", imgself: ""});
                    }
                }
            }
        })

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
                                <img src={''} style={{width:200,height:300}} alt="" />
                            </Steps>
                        </div>

                    </div>
                    <div className="tc-panel">
                        {this.state.step === 0 && (<UploadImage ref="uploadimage" parent={this}/>)}
                        {this.state.step === 1 && (<Sensoring/>)}
                        {this.state.step === 2 && (<DownloadCard/>)}
                    </div>
                </div>
            </div>
        )
    }
}
