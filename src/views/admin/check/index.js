import React from "react";
import $ from "jquery";
import {
    Card, CardBlock
} from 'reactstrap';
import { Table, Icon, Divider ,notification,Button,Popconfirm, message,Progress ,Upload} from 'antd';
import {weblocation,type} from "../../../config";
//import {Task} from '../upload/index.js'
var Class;
const ViewContent = ({children}) => (
    <div className="view-content view-components">
        {children}
    </div>
);
const ViewHeader = () => (
    <div className="view-header">
        <header className="title text-white">
            <h1 className="h4 text-uppercase">成绩修改审核</h1>
            <p className="mb-0">对教师修改成绩的申请进行审核</p>
            <div style={{display:'none'}}><Progress percent={30} /></div>
        </header>
    </div>
);
function scoreConverter(msd) {
    var time = '';
    msd = parseInt(msd);
    if (msd / 1000 > 60) {
        time = Math.floor(msd / (1000 * 60)) + "分";
    }
    time = time + Math.floor(msd / 1000) % 60 + "秒" + msd % 1000;
    return time;
}

function dataProcess(json) {
    if (json === undefined)
        return json;
    for (var i = 0; i < json.length; i++) {
        if (json[i].type == '4' || json[i].type == '5' || json[i].type == '6') {
            json[i].new_score = scoreConverter(json[i].new_score);
            json[i].old_score = scoreConverter(json[i].old_score);
        }
        json[i].type = type[json[i].type - 1];
    }
    return json;
}
const columns = [{
    title:'成绩id',
    dataIndex:'fscoreid',
    key:'fscoreid'
},{
    title:'类型',
    dataIndex:'type',
    key:'type'
},{
    title:'申请教师',
    dataIndex:'teachername',
    key:'teachername'
},{
    title:'教师联系方式',
    dataIndex:'telephone',
    key:'telephone'
},{
    title:'学生姓名',
    dataIndex:'studentname',
    key:'studentname'
},{
    title:'学号',
    dataIndex:'student_id',
    key:'student_id'
},{
    title:'旧成绩',
    dataIndex:'old_score',
    key:'old_score'
},{
    title:'新成绩',
    dataIndex:'new_score',
    key:'new_score'
},{
    title:'操作',
    dataIndex:'action',
    key:'action',
    width:'250px',
    render(text,record){
        return (
            <div>
                <Confirm record={record.fscoreid}/><Divider type="vertrical"/><Cancel record={record.fscoreid}/>
            </div>

        )
    }
}];
class Confirm extends React.Component{
    constructor(props){
        super(props)
        this.state={fscoreid:props.record}
    }
    onConfirm(){
        var obj=this;
        var postbody={
            fscoreid:obj.state.fscoreid,
            type:1
        }
        $.ajax({
            type: "POST",
            url: weblocation + "/admin/score/check",
            cache: false,
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            data:{json: JSON.stringify(postbody)},
            success: function (data) {
                var json = JSON.parse(data);
                if(json['condition']==630){
                    notification.open({
                        message: '成功',
                        description: json['message'],
                        icon: <Icon type="check" style={{color: '#108ee9'}}/>,
                    });
                    Class.componentDidMount();
                }else{
                    notification.open({
                        message: '失败',
                        description: json['message'],
                        icon: <Icon type="colse" style={{color: '#ff4040'}}/>,
                    });
                    Class.componentDidMount();
                }
            }
        })
    }
    render(){
        return (
                <Popconfirm title="您是否要通过审核" okText="Yes" cancelText="No" onConfirm={()=>this.onConfirm()}>
                    <a href="#">通过</a>
                </Popconfirm>
        )
    }
}
class Cancel extends React.Component{
    constructor(props){
        super(props)
        this.state = {fscoreid:props.record}
    }
    onConfirm(){
        var obj=this;
        var postbody={
            fscoreid:obj.state.fscoreid,
            type:0
        }
        $.ajax({
            type: "POST",
            url: weblocation + "/admin/score/check",
            cache: false,
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            data:{json: JSON.stringify(postbody)},
            success: function (data) {
                var json = JSON.parse(data);
                if(json['condition']==634){
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
                <Popconfirm title="您是否要拒绝审核" okText="Yes" cancelText="No" onConfirm={()=>this.onConfirm()}>
                    <a href="#">拒绝</a>
                </Popconfirm>
        )
    }
}
export default class AdminCheck extends React.Component{
    constructor(props) {
        super(props)
        this.state = {datasource: [], loading: true}
        Class = this;
    }

    componentDidMount() {
        var obj = this;
        $.ajax({
            type: "GET",
            url: weblocation + "/admin/check/view",
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

    render() {
        return (
            <div className="view">
                <ViewHeader/>
                <ViewContent>
                    <Card className="mb-4">
                        <CardBlock className="table-responsive">
                            <h6 className="mb-4 text-uppercase">Data Table</h6>
                            {/*<Upload name="excel" action={weblocation + "/admin/import?type=10"}*/}
                                    {/*withCredentials={true} parent={this}>*/}
                                {/*<Button type="primary" onClick={()=>{console.log(1)}}>*/}
                                    {/*<Icon type="upload"/>上传学籍信息*/}
                                {/*</Button>*/}
                            {/*</Upload>*/}
                            {/*<Task/>*/}
                            <Table columns={columns}
                                   dataSource={this.state.datasource}
                                   ref="table"
                            />
                        </CardBlock>
                    </Card>
                </ViewContent>
            </div>
        )
    }
}