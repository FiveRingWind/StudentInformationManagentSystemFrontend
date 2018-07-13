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
    title: '场地编号',
    dataIndex: 'locationid',
    key: 'locationid'
}, {
    title: '场地名称',
    dataIndex: 'name',
    key: 'name'
}, {
    title: '操作',
    render(text, record) {
        return (
            <div>
                <Change record={record} locationid={record.locationid}/><Divider type='vertrical'/><Delete
                locationid={record.locationid}/>
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
            <h1 className="h4 text-uppercase">场地管理</h1>
            <p className="mb-0">在此页面进行对场地信息的增删改查</p>
        </header>
    </div>
);

class Change extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            locationid: props.locationid,
            visible: false,
            confirmLoading: false
        }
        this.form = {
            name: '',
            
        }
        this.old = {
            name: this.props.record.name,
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
            locationid: this.state.locationid,
            name: this.form.name,
        };
        $.ajax({
                type: "POST",
                url: weblocation + "/admin/location/edit",
                cache: false,
                crossDomain: true,
                xhrFields: {
                    withCredentials: true
                },
                data: {json: JSON.stringify(postbody)},
                success: function (data) {
                    var json = JSON.parse(data);
                    if (json['condition'] == 910) {
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
                        <ValidateForm type="text" title="场地名称" hint={this.old.name} value={this.old.name}
                                      vadlidate={(obj, value) => {
                                          this.form.name = '';
                                          if (value.length > 10) {
                                              return [false, "场地名称长度不能超过10"]
                                          }
                                          this.form.name = value;
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
            locationid: props.locationid
        }
    }

    onConfirm() {
        var obj = this;
        var postbody = {
            locationid: [obj.state.locationid]
        }
        $.ajax({
            type: "POST",
            url: weblocation + "/admin/location/delete",
            cache: false,
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            data: {json: JSON.stringify(postbody)},
            success: function (data) {
                var json = JSON.parse(data);
                if (json[0]['condition'] == 920) {
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
            <Popconfirm title="您是否要删除该条场地信息" okText="Yes" cancelText="No" onConfirm={() => this.onConfirm()}>
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
            name: '',
        }
    }

    showModal = () => {
        var obj = this;
        obj.setState({
            visible: true,
        });
    }
    handleOk = () => {
        if (this.form.name === '') {
            console.log(this.form)
            return;
        }
        this.setState({
            confirmLoading: true,
        });
        var obj = this;
        var postbody = {
            name: this.form.name,
        };
        $.ajax({
                type: "POST",
                url: weblocation + "/admin/location/add",
                cache: false,
                crossDomain: true,
                xhrFields: {
                    withCredentials: true
                },
                data: {json: JSON.stringify(postbody)},
                success: function (data) {
                    var json = JSON.parse(data);
                    if (json['condition'] == 900) {
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

                        <ValidateForm type="text" title="场地名称" hint="排球场" vadlidate={(obj, value) => {
                            this.form.name = '';
                            if (value.length === 0) {
                                return [false, "请输入场地名称"]
                            } else if (value.length > 10) {
                                return [false, "场地名称长度不能超过10"]
                            }
                            this.form.name = value;
                            return [true, ""];
                        }}/>
                    </form>
                </Modal>
            </div>
        )
    }
}

export default class AdminLocation extends React.Component {
    constructor(props) {
        super(props)
        this.state = {datasource: [], loading: true, pagination: {}, searchtype: '', keyword: ''}
        Class = this;
        this.handleDownLoadmodle = this.handleDownLoadmodle.bind(this)
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
            url: weblocation + "/admin/location/view",
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
    handleDownLoadmodle(event) {
        event.preventDefault();
        window.open(weblocation + "/admin/templatedownload?type=4");
    }

    render() {
        return (
            <div className="view">
                <ViewHeader/>
                <ViewContent>
                    <Card className="mb-4">
                        <CardBlock className="table-responsive">
                            <h6 className="mb-4 text-uppercase">Data Table</h6>
                            <Add/><br/>
                            <Upload name="excel" action={weblocation + "/admin/import?type=11"}
                                    withCredentials={true} parent={this}>
                                <Button type="primary" onClick={this.handleDownLoadmodle}>
                                    <Icon type="download" />导出场地模板</Button><br/><br/>
                                <Button type="primary" onClick={() => {
                                    console.log(1)
                                }}>
                                    <Icon type="upload"/>导入场地信息
                                </Button>
                            </Upload><br/>
                            <Task/><br/>
                            <InputGroup compact>
                                <Select defaultValue="请选择查询方式" onChange={this.handleOnchange}>
                                    <Option value="1">场地编号</Option>
                                    <Option value="0">场地名称</Option>
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