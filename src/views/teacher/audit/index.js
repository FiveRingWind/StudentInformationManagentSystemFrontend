import React from 'react';
import {
    Card, CardBlock
} from 'reactstrap';
import $ from "jquery";
import { Table, Icon, Divider ,notification} from 'antd';
import {weblocation,type} from "../../../config";
import { Modal, Button } from 'antd';
var Class;
const columns = [{
    title:'姓名',
    dataIndex:'peoplename',
    key:'peoplename'
},{
    title:'身份证',
    dataIndex:'identity',
    key:'identity'
},{
    title:'联系方式',
    dataIndex:'telephone',
    key:'telephone'
},{
    title:'学号',
    dataIndex:'studentid',
    key:'studentid'
},{
    title:'班级编号',
    dataIndex:'classid',
    key:'classid'
},{
    dataIndex:'reason',
    key:'reason'
},{
    title:'操作',
    dataIndex:'action',
    key:'action',
    render(text,record){
        return (
            <Info record={record.applyid} userid = {record.userid}/>
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
            <h1 className="h4 text-uppercase">免测申请审核</h1>
            <p className="mb-0">对申请免测的学生进行审核</p>
        </header>
    </div>
);
class Info extends React.Component {

    constructor(props){
        super(props)
        this.state ={
            ModalText:'',
            visible: false,
            confirmLoading: false,
            applyid:props.record,
            imagecard:'',
            userid:props.userid

        };
        this.showModal=this.showModal.bind(this);
    }
    showModal = () => {
        var obj = this;
        $.ajax({
            type: "GET",
            url: weblocation + "/freetest/reason?applyid="+obj.state.applyid,
            cache: false,
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            success: function (data) {
                var json = JSON.parse(data);
                if(json["condition"]==570){
                    console.log(obj.state.userid)
                    obj.setState({
                        imagecard:weblocation+"/freetest/download?userid="+obj.state.userid,
                        ModalText:json["reason"],
                        visible: true,
                    });
                }
            }
        })


    }
    handleOk = () => {
        this.setState({
            ModalText: '',
            confirmLoading: true,
        });
        var obj=this;

        var postbody={
                applyid:obj.state.applyid,
                type:1
            }

        $.ajax({
            type: "POST",
            url: weblocation + "/freetest/check",
            cache: false,
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            data:{json: JSON.stringify(postbody)},
            success:function (data) {
                var json = JSON.parse(data);
                if (json['condition'] == 530) {
                    notification.open({
                        message: '成功',
                        description: json['message'],
                        icon: <Icon type="check" style={{color: '#108ee9'}}/>,
                    });
                }
                else{
                    notification.open({
                        message: '失败',
                        description: json['message'],
                        icon: <Icon type="close" style={{color: '#FF4040'}}/>,
                    });
                }
                Class.handleTableChange(Class.refs.table.state.pagination);
                obj.setState({
                    visible: false,
                    confirmLoading: false,
                });
            }
        })


    }
    handleNo = () => {
        var postbody={
            applyid:this.state.applyid,
            type:0,
        }
        var obj = this;
        $.ajax({
            type: "POST",
            url: weblocation + "/freetest/check",
            cache: false,
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            data:{json: JSON.stringify(postbody)},
            success:function (data) {
                var json = JSON.parse(data);
                if(json['condition']==531){
                    notification.open({
                        message: '成功',
                        description: json['message'],
                        icon: <Icon type="check" style={{color: '#108ee9'}}/>,
                    });
                    Class.handleTableChange(Class.refs.table.state.pagination);
                    obj.setState({
                        visible: false,
                    });
                }else{
                    notification.open({
                        message: '失败',
                        description: json['message'],
                        icon: <Icon type="colse" style={{color: '#ff4040'}}/>,
                    });
                    Class.handleTableChange(Class.refs.table.state.pagination);
                    obj.setState({
                        visible: false,
                    });
                }
            }
        })
    }
    handleCancel = () =>{
        this.setState({
            visible: false,
        });
    }
    render() {
        return (
            <div>
                <Button type="primary" onClick={this.showModal}>点击审核</Button>
                <Modal title="Title"
                       visible={this.state.visible}
                       onOk={this.handleOk}
                       confirmLoading={this.state.confirmLoading}
                       onCancel={this.handleCancel}
                       footer={[
                           <Button key="submit" type="primary" loading={this.state.confirmLoading} onClick={this.handleOk}>同意</Button>,
                           <Button key="back" type="danger" onClick={this.handleNo}>拒绝</Button>,
                       ]}
                >
                    <p ref="reason">{this.state.ModalText}</p>
                    <img src={this.state.imagecard}  ref="img"/>
                </Modal>
            </div>
        );
    }
}
export default class TeacherAudit extends React.Component{
    state = {
        datascore: [],
        pagination: {},
        loading: false,
    };
    constructor(props) {
        super(props)

        this.handleTableChange = this.handleTableChange.bind(this);
    }
    handleTableChange = (pagination) => {
        const pager = { ...this.state.pagination };
        pager.current = pagination.current;
        this.setState({
            pagination: pager,
        });
        this.fetch({
            pos: pagination.current,
            num: pagination.pageSize
        });
    }
    fetch = (params = {}) => {
        var obj = this;
        this.setState({ loading: true });
        $.ajax({
            type: "GET",
            url: weblocation + "/freetest/view?num="+params.num+"&pos="+params.pos,
            cache: false,
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            success: function (data) {
                const pagination = { ...obj.state.pagination };
                var json = JSON.parse(data);
                pagination.total = json["count"];
                obj.setState({datasource:json["data"],loading:false,pagination});

            }
        })
    }
    componentDidMount() {
        this.fetch(
            {
                pos: 1,
                num: 10,
            });
        Class = this;
    }
    render(){
        return (
            <div className="view">
            <ViewHeader/>
            <ViewContent>
                <Card className="mb-4">
                    <CardBlock className="table-responsive">
                        <h6 className="mb-4 text-uppercase">Data Table</h6>
                        <Table columns={columns}
                               //rowKey={record => record.registered}
                               dataSource={this.state.datasource}
                               pagination={this.state.pagination}
                               loading={this.state.loading}
                               onChange={this.handleTableChange}
                               //scroll={{ x: 1500,y:500}}
                                ref="table"
                        />
                    </CardBlock>
                </Card>
            </ViewContent>
        </div>
        )
    }
}