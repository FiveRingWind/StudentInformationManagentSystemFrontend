import React from 'react';
import {
    Form, Label, FormGroup, FormText,
    Card, CardBlock
} from 'reactstrap';
import $ from "jquery";
import {Table, Icon, Divider, Popconfirm, Button, Modal, Input, Select,Upload} from 'antd';
import {weblocation} from "../../../config";
import {Link, IndexLink} from 'react-router';
import {notification} from "antd/lib/index";
import {Radio} from 'antd';
import {Task} from '../../upload/index.js'
import {ValidateForm, IdentityCheck, EmailCheck} from '../../../Library/ValidateForm.js'

const InputGroup = Input.Group;
const Option = Select.Option;
const Search = Input.Search;
const RadioGroup = Radio.Group;
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

const columns = [{
    title: '设备编号',
    dataIndex: 'deviceid',
    key: 'deviceid'
}, {
    title:'类型',
    dataIndex:'type',
    key:'type'
},{
    title: '生产编号',
    dataIndex: 'productid',
    key: 'productid'
}, {
    title: 'aes密钥',
    dataIndex: 'aeskey',
    key: 'aeskey'
}, {
    title: 'totp密钥',
    dataIndex: 'totpkey',
    key: 'totpkey'
},,{
    title: '操作',
    render(text, record) {
        return (
            <div>
                <Change record={record} deviceid={record.deviceid}/><Divider type='vertrical'/><Delete
                deviceid={record.deviceid}/>
            </div>
        )
    }
}];

const ViewContent = ({children}) => (
    <div classproductid="view-content view-components">
        {children}
    </div>
);

const ViewHeader = () => (
    <div className="view-header">
        <header className="title text-white">
            <h1 className="h4 text-uppercase">设备管理</h1>
            <p className="mb-0">在此页面进行对设备信息的增删改查</p>
        </header>
    </div>
);

class Change extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            deviceid: props.deviceid,
            visible: false,
            confirmLoading: false
        }
        this.form = {
            productid: '',

        }
        this.old = {
            productid: this.props.record.productid,
        }
    }

    showModal = () => {
        var obj = this;
        obj.setState({
            visible: true,
        });
    }
    handleOk = () => {
        this.setState({
            confirmLoading: true,
        });
        var obj = this;
        var postbody = {
            deviceid: this.state.deviceid,
            productid: this.form.productid,
        };
        $.ajax({
                type: "POST",
                url: weblocation + "/admin/device/edit",
                cache: false,
                crossDomain: true,
                xhrFields: {
                    withCredentials: true
                },
                data: {json: JSON.stringify(postbody)},
                success: function (data) {
                    var json = JSON.parse(data);
                    if (json['condition'] == 440) {
                        notification.open({
                            message: '成功',
                            description: json['message'],
                            icon: <Icon type="check" style={{color: '#108ee9'}}/>,
                        });
                        Class.componentDidMount();
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
    handleCheckChange = (e) => {
        this.form.sex = e.value;
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
                                   onClick={this.handleOk}>修改</Button>,
                           <Button key="back" type="danger" onClick={this.handleCancel}>取消</Button>,
                       ]}
                >
                    <form>
                        <ValidateForm type="text" title="生产编号" hint={this.old.productid} value={this.old.productid}
                                      vadlidate={(obj, value) => {
                                          this.form.productid = '';
                                          if (value.length > 10) {
                                              return [false, "设备名称长度不能超过10"]
                                          }
                                          this.form.productid = value;
                                          return [true, ""];
                                      }}/>
                    </form>
                </Modal>
            </span>
        )
    }
}

class Delete extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            deviceid: props.deviceid
        }
    }

    onConfirm() {
        var obj = this;
        var postbody = {
            deviceid: [obj.state.deviceid]
        }
        $.ajax({
            type: "POST",
            url: weblocation + "/admin/device/delete",
            cache: false,
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            data: {json: JSON.stringify(postbody)},
            success: function (data) {
                var json = JSON.parse(data);
                if (json[0]['condition'] == 450) {
                    notification.open({
                        message: '成功',
                        description: json['message'],
                        icon: <Icon type="check" style={{color: '#108ee9'}}/>,
                    });
                    Class.componentDidMount();
                } else {
                    notification.open({
                        message: '失败',
                        description: json['message'],
                        icon: <Icon type="colse" style={{color: '#ff4040'}}/>,
                    });
                }
            }
        })
    }

    render() {
        return (
            <Popconfirm title="您是否要删除该条设备信息" okText="Yes" cancelText="No" onConfirm={() => this.onConfirm()}>
                <a>删除</a>
            </Popconfirm>
        )
    }
}

class Add extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
        this.form = {
            productid: '',
        }
    }

    showModal = () => {
        var obj = this;
        obj.setState({
            visible: true,
        });
    }
    handleOk = () => {
        if (this.form.productid === '') {
            console.log(this.form)
            return;
        }
        this.setState({
            confirmLoading: true,
        });
        var obj = this;
        var postbody = {
            productid: this.form.productid,
        };
        $.ajax({
                type: "POST",
                url: weblocation + "/admin/device/add",
                cache: false,
                crossDomain: true,
                xhrFields: {
                    withCredentials: true
                },
                data: {json: JSON.stringify(postbody)},
                success: function (data) {
                    var json = JSON.parse(data);
                    if (json['condition'] == 430) {
                        notification.open({
                            message: '成功',
                            description: json['message'],
                            icon: <Icon type="check" style={{color: '#108ee9'}}/>,
                        });
                        Class.componentDidMount();
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

    handleChange = (e) => {
        this.form.sex = e.value;
    }

    render() {
        return (
            <div>
                <Button type="primary" href="#" onClick={this.showModal}>添加</Button>
                <Modal title="Title"
                       visible={this.state.visible}
                       onOk={this.handleOk}
                       confirmLoading={this.state.confirmLoading}
                       onCancel={this.handleCancel}
                       footer={[
                           <Button key="submit" type="primary" loading={this.state.confirmLoading}
                                   onClick={this.handleOk}>添加</Button>,
                           <Button key="back" type="danger" onClick={this.handleCancel}>取消</Button>,
                       ]}
                >
                    <form>

                        <ValidateForm type="text" title="生产编号" hint="" vadlidate={(obj, value) => {
                            this.form.productid = '';
                            if (value.length === 0) {
                                return [false, "请输入生产编号"]
                            } else if (value.length > 10) {
                                return [false, "生产编号长度不能超过10"]
                            }
                            this.form.productid = value;
                            return [true, ""];
                        }}/>
                    </form>
                </Modal>
            </div>
        )
    }
}

export default class AdminDevice extends React.Component {
    constructor(props) {
        super(props)
        this.state = {datasource: [], loading: true, pagination: {}, searchtype: '', keyword: ''}
        Class = this;

    }

    handleTableChange = (pagination) => {
        const pager = {...this.state.pagination};
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
        this.setState({loading: true});
        var postbody = {
            num: params.num,
            pos: params.pos,
            searchtype: obj.state.searchtype,
            keyword: obj.state.keyword
        };
        $.ajax({
            type: "GET",
            url: weblocation + "/admin/device/view",
            cache: false,
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            data: {json: JSON.stringify(postbody)},
            success: function (data) {
                const pagination = {...obj.state.pagination};
                var json = JSON.parse(data);
                pagination.total = json["count"];
                obj.setState({datasource: json["data"], loading: false, pagination});
            }
        })
    }

    componentDidMount() {
        this.fetch(
            {
                pos: 1,
                num: 10,
            });
    }

    handleOnchange = (e) => {
        this.state.searchtype = e;
    }
    handleSearch = (value) => {
        this.state.keyword = value;
        this.componentDidMount();
    }

    render() {
        return (
            <div className="view">
                <ViewHeader/>
                <ViewContent>
                    <Card className="mb-4">
                        <CardBlock className="table-responsive">
                            <h6 className="mb-4 text-uppercase">Data Table</h6>
                            <Add/>
                            <InputGroup compact>
                                <Select defaultValue="请选择查询方式" onChange={this.handleOnchange}>
                                    <Option value="1">设备编号</Option>
                                    <Option value="0">设备名称</Option>
                                </Select>
                                <Search
                                    placeholder="请输入查询关键字"
                                    onSearch={this.handleSearch}
                                    enterButton
                                    style={{width: '300px'}}
                                />
                            </InputGroup>
                            <Table columns={columns} dataSource={this.state.datasource}
                                   pagination={this.state.pagination}
                                   loading={this.state.loading}
                                   onChange={this.handleTableChange}/>
                        </CardBlock>
                    </Card>
                </ViewContent>
            </div>
        )
    }
}