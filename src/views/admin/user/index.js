import React from 'react';
import {
    Card, CardBlock
} from 'reactstrap';
import $ from "jquery";
import {Table, Icon, Divider, Popconfirm, Button, Modal, Input, Select, Upload} from 'antd';
import {type, weblocation} from "../../../config";
import {Link, IndexLink} from 'react-router';
import {notification} from "antd/lib/index";
import {ValidateForm, IdentityCheck, EmailCheck} from '../../../Library/ValidateForm.js'

const InputGroup = Input.Group;
const Option = Select.Option;
const Search = Input.Search;
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

function dataProcess(json) {
    if (json === undefined)
        return json;
    for (var i = 0; i < json.length; i++) {
        if (json[i]["type"] === 1) {
            json[i]["type"] = '学生';
        } else if (json[i]["type"] === 2) {
            json[i]["type"] = '辅导员';
        } else if (json[i]["type"] === 3) {
            json[i]["type"] = '管理员';
        }
        if (json[i]["sex"] == 0) {
            json[i]["sex"] = '女';
        } else {
            json[i]["sex"] = '男';
        }
    }
    return json;
}

const columns = [
    {
        title: '用户编号',
        dataIndex: 'uid',
        key: 'uid'
    }, {
        title: '用户名',
        dataIndex: 'username',
        key: 'username'
    }, {
        title: '角色',
        dataIndex: 'type',
        key: 'type'
    }, {
        title: '姓名',
        dataIndex: 'name',
        key: 'name'
    }, {
        title: '性别',
        dataIndex: 'sex',
        key: 'sex'
    }, {
        title: '生日',
        dataIndex: 'birthday',
        key: 'birthday'
    }, {
        title: '身份证号',
        dataIndex: 'identity',
        key: 'identity'
    }, {
        title: '籍贯',
        dataIndex: 'nativeplace',
        key: 'nativeplace'
    }, {
        title: '爱好',
        dataIndex: 'hobby',
        key: 'hobby'
    }, {
        title: '操作',
        render(text, record) {
            return (
                <div>
                    <Change record={record} uid={record.uid}/><Divider type='vertrical'/>
                    <Delete uid={record.uid}/><Divider type='vertrical'/>
                    <ResetPassword uid={record.uid}/>
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
            <h1 className="h4 text-uppercase">用户管理</h1>
            <p className="mb-0">在此页面进行对用户信息的增删改查</p>
        </header>
    </div>
);

class Change extends React.Component {
    constructor(props) {
        super(props)
        this.handleOk = this.handleOk.bind(this);
        this.state = {
            uid: props.uid,
            visible: false,
            confirmLoading: false
        }
        this.form = {
            uid: props.uid,
        }
        this.old = {
            username: this.props.record.username,
            identity: this.props.record.identity,
            name: this.props.record.name,
            type: this.props.record.type,
            nativeplace: this.props.record.nativeplace,
            hobby: this.props.record.hobby,

        }
    }
    componentDidUpdate(nextProps){
        this.state = {
            uid: this.props.uid,
            visible: false,
            confirmLoading: false
        }
        this.form = {
            uid: this.props.uid,
        }
        this.old = {
            username: this.props.record.username,
            identity: this.props.record.identity,
            name: this.props.record.name,
            type: this.props.record.type,
            nativeplace: this.props.record.nativeplace,
            hobby: this.props.record.hobby,

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
        // var postbody = {
        //     uid: this.state.uid,
        //     name: this.form.name,
        //     username: this.form.username,
        //     nativeplace: this.form.nativeplace,
        //     identity: this.form.identity,
        //     hobby: this.form.hobby,
        //     type: this.form.type
        // };
        $.ajax({
                type: "POST",
                url: weblocation + "/manager/user/edit",
                cache: false,
                crossDomain: true,
                xhrFields: {
                    withCredentials: true
                },
                data: JSON.stringify(obj.form),
                success: function (data) {
                    var json = JSON.parse(data);
                    if (json['code'] == 900) {
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
        this.form.type = e;
    }

    render() {
        return (
            <span>
                <a color="primary" href="#" onClick={this.showModal}>修改</a>
                <Modal title="修改用户资料"
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
                        <ValidateForm type="text" title="用户名" hint="请输入用户名" value={this.old.username}
                                      vadlidate={(obj, value) => {
                                          this.form.username = '';
                                          if (value.length === 0) {
                                              return [false, "请输入用户名"]
                                          } else if (value.length > 16) {
                                              return [false, "用户名长度不能超过16"]
                                          }
                                          this.form.username = value;
                                          return [true, ""];
                                      }}/>
                        <ValidateForm type="text" title="姓名" hint="请输入姓名" value={this.old.name}
                                      vadlidate={(obj, value) => {
                                          this.form.name = '';
                                          if (value.length === 0) {
                                              return [false, "请输入姓名"]
                                          } else if (value.length > 10) {
                                              return [false, "姓名长度不能超过10"]
                                          }
                                          this.form.name = value;
                                          return [true, ""];
                                      }}/>
                        <ValidateForm type="text" title="身份证号码" hint="请输入身份证" value={this.old.identity}
                                      vadlidate={(obj, value) => {
                                          this.form.identity = '';
                                          if (!IdentityCheck(value))
                                              return [false, "身份证非法,请检查"];
                                          this.form.identity = value;

                                          return [true, ""];
                                      }}/>
                        <ValidateForm type="text" title="籍贯" hint="请输入籍贯"
                                      value={this.old.nativeplace}
                                      vadlidate={(obj, value) => {
                                          this.form.nativeplace = '';
                                          if (value.length > 20)
                                              return [false, "籍贯长度不能超过20,请检查"];
                                          this.form.nativeplace = value;

                                          return [true, ""];
                                      }}/>
                        <ValidateForm type="text" title="爱好" hint="用户爱好，可空"
                                      value={this.old.hobbyy}
                                      vadlidate={(obj, value) => {
                                          this.form.hobby = '';
                                          if (value.length > 100)
                                              return [false, "爱好长度不能超过100,请检查"];
                                          this.form.hobby = value;

                                          return [true, ""];
                                      }}/>
                        <Select defaultValue={this.old.type} style={{width: 240}} onChange={this.handleChange}>
                            <Option value="1">学生</Option>
                            <Option value="2">教师</Option>
                            <Option value="3">管理员</Option>
                        </Select>
                    </form>
                </Modal>
            </span>
        )
    }
}

class Delete extends React.Component {
    constructor(props) {
        super(props)
    }
    componentDidUpdate(nextProps){

    }
    onConfirm() {
        var obj = this;
        var postbody = {
            uid: obj.props.uid
        }
        $.ajax({
            type: "POST",
            url: weblocation + "/manager/user/delete",
            cache: false,
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            data: JSON.stringify(postbody),
            success: function (data) {
                var json = JSON.parse(data);
                if (json['code'] == 600) {
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
            <Popconfirm title="您是否要删除用户" okText="Yes" cancelText="No" onConfirm={() => this.onConfirm()}>
                <a>删除</a>
            </Popconfirm>
        )
    }
}

class ResetPassword extends React.Component {
    constructor(props) {
        super(props)
        this.componentDidUpdate=this.componentDidUpdate.bind(this)
    }
    componentDidUpdate(){
    }
    onConfirm() {
        var obj = this;
        var postbody = {
            uid: obj.props.uid
        }
        $.ajax({
            type: "POST",
            url: weblocation + "/manager/user/resetpassword",
            cache: false,
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            data: JSON.stringify(postbody),
            success: function (data) {
                var json = JSON.parse(data);
                if (json['code'] == 400) {
                    notification.open({
                        message: '成功',
                        description: json['message'],
                        icon: <Icon type="check" style={{color: '#108ee9'}}/>,
                    });
                    //Class.componentDidMount();
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
            <Popconfirm title="您是否要将该用户密码重置为身份证号码" okText="Yes" cancelText="No" onConfirm={() => this.onConfirm()}>
                <a>重置密码</a>
            </Popconfirm>
        )
    }
}

class Add extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
        this.form = {
            username: '',
            name: '',
            identity: '',
            nativeplace: '',
            type: 1,
        }
    }

    showModal = () => {
        var obj = this;
        obj.setState({
            visible: true,
        });
    }
    handleOk = () => {
        if (this.form.username === '' || this.form.name === '' || this.form.identity === '' || this.form.nativeplace === '' || this.form.type === '') {
            console.log(this.form)
            return;
        }
        this.setState({
            confirmLoading: true,
        });
        var obj = this;
        // var postbody = {
        //     username: this.form.username,
        //     peoplename: this.form.peoplename,
        //     identity: this.form.identity,
        //     password: this.form.password,
        //     telephone: this.form.telephone,
        //     email: this.form.email,
        //     roleid: this.form.roleid
        // };
        $.ajax({
                type: "POST",
                url: weblocation + "/manager/user/add",
                cache: false,
                crossDomain: true,
                xhrFields: {
                    withCredentials: true
                },
                data: JSON.stringify(obj.form),
                success: function (data) {
                    var json = JSON.parse(data);
                    if (json['code'] == 500) {
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
        this.form.type = e;
    }

    render() {
        return (
            <div>
                <Button type="primary" href="#" onClick={this.showModal}>添加</Button>
                <Modal title="添加用户"
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
                        <ValidateForm type="text" title="用户名" hint="长度6-20" vadlidate={(obj, value) => {
                            this.form.username = ''
                            if (value.length === 0) {
                                return [false, "用户名未输入"]
                            } else if (value.length > 16) {
                                return [false, "姓名长度不能超过16"]
                            }
                            this.form.username = value

                            return [true, ""]
                        }}/>
                        <ValidateForm type="text" title="姓名" hint="张三" vadlidate={(obj, value) => {
                            this.form.name = '';
                            if (value.length === 0) {
                                return [false, "请输入姓名"]
                            } else if (value.length > 16) {
                                return [false, "姓名长度不能超过16"]
                            }
                            this.form.name = value;
                            return [true, ""];
                        }}/>
                        <ValidateForm type="text" title="身份证号码" hint="18位身份证号码" vadlidate={(obj, value) => {
                            this.form.identity = '';
                            if (value.length === 0) {
                                return [false, "身份证未输入"];
                            }
                            if (!IdentityCheck(value))
                                return [false, "身份证非法,请检查"];
                            this.form.identity = value;
                            return [true, ""];

                        }}/>
                        <ValidateForm type="text" title="籍贯" hint="请输入籍贯"
                                      vadlidate={(obj, value) => {
                                          this.form.nativeplace = '';
                                          if (value.length > 20)
                                              return [false, "籍贯长度不能超过20,请检查"];
                                          this.form.nativeplace = value;

                                          return [true, ""];
                                      }}/>

                        <Select defaultValue="1" style={{width: 240}} onChange={this.handleChange}>
                            <Option value="1">学生</Option>
                            <Option value="2">辅导员</Option>
                            <Option value="3">管理员</Option>
                        </Select>
                    </form>
                </Modal>
            </div>
        )
    }
}

export default class AdminUser extends React.Component {
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
            currentpage: pagination.current,
            sep: pagination.pageSize
        });
    }
    fetch = (params = {}) => {
        var obj = this;
        this.setState({loading: true});
        var postbody = {
            currentpage: params.currentpage,
            sep: params.sep,
            searchtype: obj.state.searchtype,
            keyword: obj.state.keyword
        };
        $.ajax({
            type: "POST",
            url: weblocation + "/manager/user/search",
            cache: false,
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            data: JSON.stringify(postbody),
            success: function (data) {
                const pagination = {...obj.state.pagination};
                var json = JSON.parse(data);
                json['data'] = dataProcess(json['data']);
                pagination.total = json["total"];
                pagination.pageSize=json['sep'];
                obj.setState({datasource: json["data"], loading: false, pagination});
            }
        })
    }

    componentDidMount() {
        this.fetch(
            {
                currentpage: 1,
                sep: 50,
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
                            <Add/><br/>
                            <InputGroup compact>

                                <Select defaultValue="请选择查询方式" onChange={this.handleOnchange}>
                                    <Option value="identity">身份证号</Option>
                                    <Option value="name">姓名</Option>
                                    <Option value="name">姓名</Option>

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