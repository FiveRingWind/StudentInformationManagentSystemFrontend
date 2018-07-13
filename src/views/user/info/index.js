import React from 'react';
import {Table, Icon, Divider} from 'antd';
import {
    Form, Input, Label, FormGroup, Button, FormText,
    Card, CardBlock
} from 'reactstrap';
import $ from "jquery";
import {weblocation} from "../../../config";



const columns = [{
    title: '用户名',
    dataIndex: 'userid',
    key: 'userid',
}, {
    title: '昵称',
    dataIndex: 'loginname',
    key: 'loginname',
}, {
    title: '姓名',
    dataIndex: 'peoplename',
    key: 'peoplename',
}, {
    title: '身份证号',
    dataIndex: 'identity',
    key: 'identity',
}, {
    title: '邮箱',
    dataIndex: 'email',
    key: 'email',
},{
    title:'学号',
    dataIndex:'studentid',
    key:'studentid',
},{
    title:'性别',
    dataIndex:'sex',
    key:'sex',
},{
    title:'入学年份',
    dataIndex:'enrollyear',
    key:'enrollyear',
},{
    title:'学校编号',
    dataIndex:'collegeid',
    key:'collegeid',
},{
    title:'班级编号',
    dataIndex:'classid',
    key:'classid',
}];


const ViewHeader = () => (
    <div className="view-header">
        <header className="title text-white">
            <h1 className="h4 text-uppercase">个人信息</h1>
            <p className="mb-0"></p>
        </header>
    </div>
);

export default class UserInfo extends React.Component {
    constructor(props) {
        super(props)
        this.state = {classname:undefined,nativeplace:undefined,hobby:undefined,birthday:undefined,datasource:undefined,userid:undefined,loginname:undefined,peoplename:undefined,identity:undefined,email:undefined,studentid:undefined,sex:undefined,enrollyear:undefined,collegeid:undefined,classid:undefined,loading:true}

    }

    componentDidMount() {
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
                if(json["code"]==800){
                    obj.setState({datasource:json,classname:json["data"]["classname"],studentid:json["data"]["studentid"],hobby:json["data"]["hobby"],nativeplace:json["data"]["nativeplace"],birthday:json["data"]["birthday"],username:json["data"]["username"],name:json["data"]["name"],identity:json["data"]["identity"],sex:json["sex"],enrollyear:json["data"]["enrollyear"],loading:false});

                }
            }
        })
    }
    render() {
        return (
            <div className="view" style={{margin:"0 auto"}}>
                <ViewHeader/>
                <div className="card-block" style={{margin:"0 auto",padding:"10px",width:"500px",marginTop:"20px"}}>
                    <label>用户名：{this.state.username}</label><br/>
                    <label>姓名：{this.state.name}</label><br/>
                    <label>身份证号：{this.state.identity}</label><br/>
                    <label>性别：{this.state.sex===0?"女":"男"}</label><br/>
                    <label>生日：{this.state.birthday}</label><br/>
                    <label>籍贯：{this.state.nativeplace}</label><br/>
                    <label>爱好：{this.state.hobby}</label><br/>
                    <label>学号：{this.state.studentid}</label><br/>
                    <label>入学年份：{this.state.enrollyear}</label><br/>
                    <label>班级名称：{this.state.classname}</label><br/>
                    <Button color="primary" onClick={()=>this.props.router.push('/user/changepwd')}>修改密码</Button>{" "}
                </div>
            </div>

        )
    }
}