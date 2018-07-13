import React from 'react';
import {
    Card, CardBlock,
} from 'reactstrap';
import $ from "jquery";
import {Table, Icon, Divider, Modal, Input, Button, notification,InputNumber,Popconfirm } from 'antd';
import {weblocation, type} from "../../../config";
import {Task} from '../../upload/index.js'
var Class;
function timeConverter(UNIX_timestamp) {
    var a = new Date(UNIX_timestamp * 1000);
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var year = a.getFullYear();
    var month = a.getMonth() + 1;
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = year + "/" + month + "/" + date + " " + hour + ":" + (min < 10 ? "0" + min : min);
    // var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
    return time;
}

const columns_stu = [{
    title: '学号',
    dataIndex: 'student_id',
    key: 'student_id',
}, {
    title: '姓名',
    dataIndex: 'name',
    key: 'name'
}, {
    title: '身份证号',
    dataIndex: 'identity',
    key: 'identity',
}, {
    title: '学校编号',
    dataIndex: 'college_id',
    key: 'college_id',
}, {
    title: '班级编号',
    dataIndex: 'class_id',
    key: 'class_id'
}, {
    title: '用户编号',
    dataIndex: 'stu_id',
    key: 'stu_id'
}, {
    title: '操作',
    dataIndex: 'handle',
    key: 'handle',
    render(text, record) {
        return (
            <Info userid={record.stu_id} stuid={record.student_id}/>
        )
    }
}];

function scoreConverter(msd) {
    var time = '';
    msd = parseInt(msd);
    if (msd / 1000 > 60) {
        time = Math.floor(msd / (1000 * 60)) + "分钟";
    }
    time = time + Math.floor(msd / 1000) % 60 + "秒" + msd % 1000;
    return time;
}

function dataProcess(json) {
    if (json === undefined)
        return json;
    for (var i = 0; i < json.length; i++) {
        if (json[i].type == '4' || json[i].type == '5' || json[i].type == '6') {
            json[i].score = scoreConverter(json[i].score);
        }
        json[i].type = type[json[i].type - 1];
    }
    return json;
}
const columns_score = [{
    title: '类型',
    dataIndex: 'type',
    key: 'type',
}, {
    title: '成绩',
    dataIndex: 'score',
    key: 'score',
}, {
    title: '地点',
    dataIndex: 'location',
    key: 'location',
}, {
    title: '测试时间',
    dataIndex: 'time',
    key: 'time',
    render: (text) => {
        return (timeConverter(text))
    }
}, {
    title: '最终成绩id',
    dataIndex: 'fscoreid',
    key: 'fscoreid'
}, {
    title: '用户编号',
    dataIndex: 'stuid',
    key: 'stuid'
}, {
    title: '操作',
    dataIndex: 'handle',
    key: 'handle',
    render(text, record) {
        if(record.type=='50米(时间)'||record.type=='800米(时间)'||record.type=='1000米(时间)'){
            return (
                <div>
                <ChangeTime stuid={record.stuid} fscoreid={record.fscoreid} type={record.type}/><Divider type="vertical" /><Delete fscoreid={record.fscoreid} />
                </div>
            )
        }
        else return (
            <div>
            <Change stuid={record.stuid} fscoreid={record.fscoreid} type={record.type}/><Divider type="vertical" /><Delete fscoreid={record.fscoreid} />
            </div>
        )
    }
}];
const ViewContent = ({children}) => (
    <div className="view-content view-components">
        {children}
    </div>
);
const ViewHeader = () => (
    <div className="view-header">
        <header className="title text-white">
            <h1 className="h4 text-uppercase">修改成绩</h1>
            <p className="mb-0">教师可以在此提交修改成绩的申请</p>

        </header>
    </div>
);

function scoreConverter(msd) {
    var time = '';
    msd = parseInt(msd);
    if (msd / 1000 > 60) {
        time = Math.floor(msd / (1000 * 60)) + "分钟";
    }
    time = time + Math.floor(msd / 1000) % 60 + "秒" + msd % 1000;
    return time;
}

function dataProcess(json) {
    if (json === undefined)
        return json;
    for (var i = 0; i < json.length; i++) {
        if (json[i].type == '4' || json[i].type == '5' || json[i].type == '6') {
            json[i].score = scoreConverter(json[i].score);
        }
        json[i].type = type[json[i].type - 1];
    }
    return json;
}
class Delete extends React.Component{
    constructor(props){
        super(props)
        this.state = {fscoreid:props.fscoreid}
    }
    onConfirm(){
        var obj=this;
        var postbody={
            fscoreid:obj.state.fscoreid,
        }
        $.ajax({
            type: "POST",
            url: weblocation + "/admin/score/delete",
            cache: false,
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            data:{json: JSON.stringify(postbody)},
            success: function (data) {
                var json = JSON.parse(data);
                if(json['condition']==680){
                    notification.open({
                        message: '成功',
                        description: json['message'],
                        icon: <Icon type="check" style={{color: '#108ee9'}}/>,
                    });
                    Class.componentDidMount();
                    obj.setState({
                        visible: false,
                    });
                }else{
                    notification.open({
                        message: '失败',
                        description: json['message'],
                        icon: <Icon type="colse" style={{color: '#FF0000'}}/>,
                    });
                    Class.componentDidMount();
                    obj.setState({
                        visible: false,
                    });
                }
            }
        })
    }
    render(){
        return (
            <Popconfirm title="您是否要删除该条最终成绩" okText="Yes" cancelText="No" onConfirm={()=>this.onConfirm()}>
                <a href="#">删除</a>
            </Popconfirm>
        )
    }
}
class Change extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false,
            confirmLoading: false,
            stuid: props.stuid,
            fscoreid: props.fscoreid,
            type: props.stuid
        };
        this.showModal = this.showModal.bind(this);
    }

    showModal = () => {
        var obj = this;
        obj.setState({
            visible: true,
            new_score: ''
        });

    }
    handleOk = () => {
        this.setState({
            confirmLoading: true,
        });
        var obj = this;
        //提交修改成绩的接口
        var postbody = {
            fscoreid: obj.state.fscoreid,
            stuid: obj.state.stuid,
            new_score: obj.state.new_score
        }
        $.ajax({
                type: "POST",
                url: weblocation + "/teacher/score/edit",
                cache: false,
                crossDomain: true,
                xhrFields: {
                    withCredentials: true
                },
                data: {json: JSON.stringify(postbody)},
                success: function (data) {
                    var json = JSON.parse(data);
                    if (json['condition'] == 620) {
                        notification.open({
                            message: '成功',
                            description: json['message'],
                            icon: <Icon type="check" style={{color: '#108ee9'}}/>,
                        });
                    }
                    else {
                        notification.open({
                            message: '失败',
                            description: json['message'],
                            icon: <Icon type="close" style={{color: '#FF4040'}}/>,
                        });
                    }
                    obj.setState({
                        visible: false,
                        confirmLoading: false,
                    });
                }
            }
        )

    }

    handleCancel = () => {
        this.setState({
            visible: false,
        });
    }
    onChange = (e) => {
        this.setState({
            new_score: e
        })
    }

    render() {
        return (
            <span>
                <a color="primary" href="#" onClick={this.showModal}>修改</a>
                <Modal title="Title"
                       visible={this.state.visible}
                       onOk={this.handleOk}
                       confirmLoading={this.state.confirmLoading}
                       onCancel={this.handleCancel}
                       footer={[
                           <Button key="submit" type="primary" loading={this.state.confirmLoading}
                                   onClick={this.handleOk}>提交申请</Button>,
                           <Button key="back" type="danger" onClick={this.handleCancel}>取消</Button>,
                       ]}
                >
                    <label>新成绩</label>{" "}<InputNumber min={0} max={20000} onChange={this.onChange}/>
                </Modal>
            </span>
        );
    }
}
class ChangeTime extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false,
            confirmLoading: false,
            stuid: props.stuid,
            fscoreid: props.fscoreid,
            type: props.stuid,
            score0:'0',
            score1:'0',
            score2:'0'
        };
        this.showModal = this.showModal.bind(this);
    }

    showModal = () => {
        var obj = this;
        obj.setState({
            visible: true,
            new_score: ''
        });

    }
    handleOk = () => {
        this.setState({
            confirmLoading: true,
        });
        var obj = this;
        //提交修改成绩的接口
        var postbody = {
            fscoreid: obj.state.fscoreid,
            stuid: obj.state.stuid,
            new_score: parseInt(obj.state.score0) * 1000 * 60 + parseInt(obj.state.score1) * 1000 + parseInt(obj.state.score1),
        }
        $.ajax({
                type: "POST",
                url: weblocation + "/teacher/score/edit",
                cache: false,
                crossDomain: true,
                xhrFields: {
                    withCredentials: true
                },
                data: {json: JSON.stringify(postbody)},
                success: function (data) {
                    var json = JSON.parse(data);
                    if (json['condition'] == 620) {
                        notification.open({
                            message: '成功',
                            description: json['message'],
                            icon: <Icon type="check" style={{color: '#108ee9'}}/>,
                        });
                    }
                    else {
                        notification.open({
                            message: '失败',
                            description: json['message'],
                            icon: <Icon type="close" style={{color: '#FF4040'}}/>,
                        });
                    }
                    obj.setState({
                        visible: false,
                        confirmLoading: false,
                    });
                }
            }
        )

    }

    handleCancel = () => {
        this.setState({
            visible: false,
        });
    }
    onChange0 = (e) => {
        this.setState({
            score0: e
        })
    }
    onChange1 = (e) => {
        this.setState({
            score1: e
        })
    }
    onChange2 = (e) => {
        this.setState({
            score2: e
        })
    }


    render() {
        return (
            <span>
                <a color="primary" href="#" onClick={this.showModal}>修改</a>
                <Modal title="Title"
                       visible={this.state.visible}
                       onOk={this.handleOk}
                       confirmLoading={this.state.confirmLoading}
                       onCancel={this.handleCancel}
                       footer={[
                           <Button key="submit" type="primary" loading={this.state.confirmLoading}
                                   onClick={this.handleOk}>提交申请</Button>,
                           <Button key="back" type="danger" onClick={this.handleCancel}>取消</Button>,
                       ]}
                >
                    <label>新成绩:</label>{" "}<InputNumber min={0} max={60} onChange={this.onChange0}/>{"分"}<InputNumber min={0} max={60} onChange={this.onChange1}/>{"秒"}<InputNumber min={0} max={1000} onChange={this.onChange2}/>
                </Modal>
            </span>
        );
    }
}
class Info extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            datasource: '',
            visible: false,
            confirmLoading: false,
            userid: props.userid,
            stuid: props.stuid

        };
        Class = this;
        this.showModal = this.showModal.bind(this);
    }
    componentDidMount(){
        var obj = this;
        $.ajax({
            type: "GET",
            url: weblocation + "/teacher/score/view?stuid=" + obj.state.userid,
            cache: false,
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            success: function (data) {
                var json = JSON.parse(data);
                json["finalscore"] = dataProcess(json["finalscore"]);
                if (json["condition"] == 640) {
                    obj.setState({
                        datasource: json["finalscore"],
                        //visible: true,
                    });
                }
            }
        })
    }
    showModal = () => {
        var obj = this;
        $.ajax({
            type: "GET",
            url: weblocation + "/teacher/score/view?stuid=" + obj.state.userid,
            cache: false,
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            success: function (data) {
                var json = JSON.parse(data);
                json["finalscore"] = dataProcess(json["finalscore"]);
                if (json["condition"] == 640) {
                    obj.setState({
                        datasource: json["finalscore"],
                        visible: true,
                    });
                }
            }
        })
    }
    handleCancel = () => {
        this.setState({
            visible: false,
        });
    }

    render() {
        return (
            <div>
                <Button type="primary" onClick={this.showModal}>查看详情</Button>
                <Modal title="Title"
                       visible={this.state.visible}
                       confirmLoading={this.state.confirmLoading}
                       onCancel={this.handleCancel}
                       footer={[
                           <Button key="back" type="danger" onClick={this.handleCancel}>关闭</Button>,
                       ]}
                       width="1000px"
                >
                    <label>学号:{this.state.stuid}</label>
                    <Table columns={columns_score}
                           dataSource={this.state.datasource}
                    />
                </Modal>
            </div>
        );
    }
}

export default class TeacherCheck extends React.Component {
    constructor(props) {
        super(props)
        this.state = {datasource: [], loading: true}

    }


    componentDidMount() {
        var obj = this;
        $.ajax({
            type: "GET",
            url: weblocation + "/teacher/test/view?type=1",
            cache: false,
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            success: function (data) {
                var json = JSON.parse(data);
                json['data'] = dataProcess(json['data']);
                obj.setState({datasource: json['data'], loading: false});
            }
        })
    }
    handleDownLoadAll= (e) => {
        var obj = this;
        var postbody = {
            type:21//导出所有成绩
        };
        $.ajax({
            type: "POST",
            url: weblocation + "/admin/export",
            cache: false,
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            data: {json: JSON.stringify(postbody)},
            success: function (data) {

            }
        })
    }
    handleDownLoadFinal= (e) => {
        var obj = this;
        var postbody = {
            type:20//导出最终成绩
        };
        $.ajax({
            type: "POST",
            url: weblocation + "/admin/export",
            cache: false,
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            data: {json: JSON.stringify(postbody)},
            success: function (data) {

            }
        })
    }
    render() {
        return (
            <div className="view">
                <ViewHeader/>
                <ViewContent>
                    <Card className="mb-4">
                        <CardBlock className="table-responsive">
                            <h6 className="mb-4 text-uppercase">Data Table</h6>
                            <div>
                                <Button type="primary" onClick={() => {this.handleDownLoadAll()}}>
                                    <Icon type="download" />导出所有成绩</Button><br/><br/>
                            </div>
                            <div>
                                <Button type="primary" onClick={() => {this.handleDownLoadFinal()}}>
                                    <Icon type="download" />导出最终成绩</Button><br/>
                            </div>
                            <Task/>
                            <Table columns={columns_stu}
                                   dataSource={this.state.datasource}
                            />
                        </CardBlock>
                    </Card>
                </ViewContent>
            </div>
        )
    }
}