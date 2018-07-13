import React from 'react';
import {
    Card, CardBlock
} from 'reactstrap';
import $ from "jquery";
import {Table, Icon, Divider, Popconfirm, Button, Modal, Input, Select,Upload} from 'antd';
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
    if(json===undefined)
        return json;
    for(var i = 0 ;i<json.length;i++){
        if(json[i]["role_id"]===1){
            json[i]["role_id"]='管理员';
        }
        else if(json[i]["role_id"]===5){
            json[i]["role_id"]='学生';
        }
        else if(json[i]["role_id"]===6){
            json[i]["role_id"]='教师';
        }
    }
    return json;
}
const columns = [{
    title: '姓名',
    dataIndex: 'peoplename',
    key: 'peoplename'
}, {
    title: '权限',
    dataIndex: 'role_id',
    key: 'role_id'
}, {
    title: '用户名',
    dataIndex: 'loginname',
    key: 'loginname'
}, {
    title: '身份证号',
    dataIndex: 'identity',
    key: 'identity'
}, {
    title: '邮箱',
    dataIndex: 'email',
    key: 'email'
}, {
    title: '联系方式',
    dataIndex: 'telephone',
    key: 'telephone'
}, {
    title: '用户编号',
    dataIndex: 'userid',
    key: 'userid'
}, {
    title: '操作',
    render(text, record) {
        return (
            <div>
                <Change record={record} userid={record.userid}/><Divider type='vertrical'/><Delete
                userid={record.userid}/>
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
        this.state = {
            userid: props.userid,
            visible: false,
            confirmLoading: false
        }
        this.form = {
            peoplename: '',
            identity: '',
            loginname: '',
            telephone: '',
            password: '',
            repassword: '',
            email: '',
            roleid: '',
        }
        this.old = {
            peoplename: this.props.record.peoplename,
            identity: this.props.record.identity,
            loginname: this.props.record.loginname,
            telephone: this.props.record.telephone,
            email: this.props.record.email
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
            userid:this.state.userid,
            peoplename: this.form.peoplename,
            identity: this.form.identity,
            password: this.form.password,
            telephone: this.form.telephone,
            email: this.form.email,
            roleid: this.form.roleid
        };
        $.ajax({
                type: "POST",
                url: weblocation + "/admin/user/edit",
                cache: false,
                crossDomain: true,
                xhrFields: {
                    withCredentials: true
                },
                data: {json: JSON.stringify(postbody)},
                success: function (data) {
                    var json = JSON.parse(data);
                    if (json['condition'] == 350) {
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

    handleChange=(e)=>{
        this.form.roleid = e;
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
                        <ValidateForm type="text" title="姓名" hint={this.old.peoplename} vadlidate={(obj, value) => {
                            this.form.peoplename = '';
                            if (value.length === 0) {
                                return [false, "请输入姓名"]
                            } else if (value.length > 10) {
                                return [false, "姓名长度不能超过10"]
                            }
                            this.form.peoplename = value;
                            return [true, ""];
                        }}/>
                        <ValidateForm type="text" title="身份证号码" hint={this.old.identity} value={this.old.identity}
                                      vadlidate={(obj, value) => {
                                          this.form.identity = '';
                                          if (!IdentityCheck(value))
                                              return [false, "身份证非法,请检查"];
                                          var temp = this;
                                          $.post(weblocation + "/user/vadliidateidentity", {
                                              json: JSON.stringify({
                                                  identity: value,
                                              }),
                                          }, function (data) {
                                              var json = JSON.parse(data);

                                              if (json["condition"] !== 0) {
                                                  obj.seterror(false, json["message"]);
                                              } else {
                                                  temp.form.identity = value
                                                  obj.seterror(true, json["message"]);
                                              }
                                          });
                                          return [true, ""];
                                      }}/>
                        <ValidateForm type="text" title="手机号码" hint="11位手机号码" value={this.old.telephone}
                                      vadlidate={(obj, value) => {
                                          this.form.telephone = ''
                                          if (value.length === 0) {
                                              return [false, "手机号码未输入"]
                                          } else if (value.length !== 11) {
                                              return [false, "手机号码长度不正确"]
                                          }
                                          var b = /^1[3|4|5|7|8][0-9]{9}$/g

                                          if (b.test(value) === false)
                                              return [false, "手机号码输入不合法"]
                                          this.form.telephone = value
                                          return [true, ""]
                                      }}/>
                        <ValidateForm type="text" title="电子邮箱" hint="example@example.com" value={this.old.email}
                                      vadlidate={(obj, value) => {
                                          this.form.email = ''

                                          if (value.length === 0) {
                                              return [false, "电子邮箱未输入"]
                                          } else if (value.length > 35) {
                                              return [false, "电子邮箱不能超过35"]
                                          }
                                          if (EmailCheck(value) === false)
                                              return [false, "电子邮箱输入不合法"]
                                          this.form.email = value
                                          return [true, ""]
                                      }}/>
                        <ValidateForm type="password" title="密码" hint="不修改则不填" vadlidate={(obj, value) => {
                            this.form.password = ''

                            if (value.length < 8) {
                                return [false, "密码长度不能小于8位"]
                            } else if (value.length > 20) {
                                return [false, "密码长度不能超过20位"]
                            }
                            var b = new RegExp(/[A-Za-z].*[0-9]|[0-9].*[A-Za-z]/);
                            if (b.test(value) === false)
                                return [false, "密码需要包含字母和数字"]
                            this.form.password = value
                            return [true, ""]
                        }}/>
                        <ValidateForm type="password" title="确认密码" hint="与上面输入的密码相同" vadlidate={(obj, value) => {
                            this.form.repassword = ''
                            if (value === '') {
                                return [false, "没有输入确认密码"]
                            }
                            if (this.form.password !== value) {
                                return [false, "两次密码输入不一致"]
                            }
                            this.form.repassword = this.form.password
                            return [true, '']
                        }}/>
                        <Select defaultValue="请选择用户角色" style={{width: 240}} onChange={this.handleChange}>
                            <Option value="5">学生</Option>
                            <Option value="6">教师</Option>
                            <Option value="1">管理员</Option>
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
        this.state = {
            userid: props.userid
        }
    }

    onConfirm() {
        var obj = this;
        var postbody = {
            userid: [obj.state.userid]
        }
        $.ajax({
            type: "POST",
            url: weblocation + "/admin/user/delete",
            cache: false,
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            data: {json: JSON.stringify(postbody)},
            success: function (data) {
                var json = JSON.parse(data);
                if (json[0]['condition'] == 340) {
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

class Add extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
        this.form = {
            peoplename: '',
            identity: '',
            loginname: '',
            telephone: '',
            password: '',
            repassword: '',
            email: '',
            roleid: '',
        }
    }

    showModal = () => {
        var obj = this;
        obj.setState({
            visible: true,
        });
    }
    handleOk = () => {
        if (this.form.roleid==='' || this.form.peoplename === '' || this.form.identity === '' || this.form.loginname === '' || this.form.password === '' || this.form.repassword === ''|| this.form.telephone === '' || this.form.email === '') {
            console.log(this.form)
            return;
        }
        this.setState({
            confirmLoading: true,
        });
        var obj = this;
        var postbody = {
            loginname: this.form.loginname,
            peoplename: this.form.peoplename,
            identity: this.form.identity,
            password: this.form.password,
            telephone: this.form.telephone,
            email: this.form.email,
            roleid: this.form.roleid
        };
        $.ajax({
                type: "POST",
                url: weblocation + "/admin/user/add",
                cache: false,
                crossDomain: true,
                xhrFields: {
                    withCredentials: true
                },
                data: {json: JSON.stringify(postbody)},
                success: function (data) {
                    var json = JSON.parse(data);
                    if (json['condition'] == 330) {
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
        this.form.roleid = e;
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
                        <ValidateForm type="text" title="姓名" hint="张三" vadlidate={(obj, value) => {
                            this.form.peoplename = '';
                            if (value.length === 0) {
                                return [false, "请输入姓名"]
                            } else if (value.length > 10) {
                                return [false, "姓名长度不能超过10"]
                            }
                            this.form.peoplename = value;
                            return [true, ""];
                        }}/>
                        <ValidateForm type="text" title="身份证号码" hint="18位身份证号码" vadlidate={(obj, value) => {
                            this.form.identity = '';
                            if (value.length === 0) {
                                return [false, "身份证未输入"];
                            }
                            if (!IdentityCheck(value))
                                return [false, "身份证非法,请检查"];
                            var temp = this;
                            $.post(weblocation + "/user/vadliidateidentity", {
                                json: JSON.stringify({
                                    identity: value,
                                }),
                            }, function (data) {
                                var json = JSON.parse(data);

                                if (json["condition"] !== 0) {
                                    obj.seterror(false, json["message"]);
                                } else {
                                    temp.form.identity = value
                                    obj.seterror(true, json["message"]);

                                }
                            });
                            return [true, ""];

                        }}/>
                        <ValidateForm type="text" title="用户名" hint="长度6-20" vadlidate={(obj, value) => {
                            this.form.loginname = ''

                            if (value.length === 0) {
                                return [false, "用户名未输入"]
                            } else if (value.length > 20) {
                                return [false, "用户名长度不能超过20"]
                            } else if (value.length < 6) {
                                return [false, "用户名长度不能小于6"]
                            }
                            var b = /^[0-9a-zA-Z]*$/g;
                            if (b.test(value) === false)
                                return [false, "用户名只能为英文和数字组合"]
                            var temp = this

                            $.post(weblocation + "/user/vadlidateuser", {
                                json: JSON.stringify({
                                    loginname: value,
                                }),
                            }, function (data) {
                                var json = JSON.parse(data);
                                if (json["condition"] != 0) {
                                    obj.seterror(false, json["message"]);
                                } else {
                                    temp.form.loginname = value
                                    obj.seterror(true, json["message"]);
                                }
                            });

                            return [true, ""]
                        }}/>
                        <ValidateForm type="text" title="手机号码" hint="11位手机号码" vadlidate={(obj, value) => {
                            this.form.telephone = ''
                            if (value.length === 0) {
                                return [false, "手机号码未输入"]
                            } else if (value.length !== 11) {
                                return [false, "手机号码长度不正确"]
                            }
                            var b = /^1[3|4|5|7|8][0-9]{9}$/g

                            if (b.test(value) === false)
                                return [false, "手机号码输入不合法"]
                            this.form.telephone = value
                            return [true, ""]
                        }}/>
                        <ValidateForm type="text" title="电子邮箱" hint="example@example.com" vadlidate={(obj, value) => {
                            this.form.email = ''

                            if (value.length === 0) {
                                return [false, "电子邮箱未输入"]
                            } else if (value.length > 35) {
                                return [false, "电子邮箱不能超过35"]
                            }
                            if (EmailCheck(value) === false)
                                return [false, "电子邮箱输入不合法"]
                            this.form.email = value
                            return [true, ""]
                        }}/>
                        <ValidateForm type="password" title="密码" hint="长度应在8-16位之间，且包含数字与字母"
                                      vadlidate={(obj, value) => {
                                          this.form.password = ''

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
                                          this.form.password = value

                                          return [true, ""]
                                      }}/>
                        <ValidateForm type="password" title="确认密码" hint="与上面输入的密码相同" vadlidate={(obj, value) => {
                            this.form.repassword = ''
                            if (value === '') {
                                return [false, "没有输入确认密码"]
                            }
                            if (this.form.password !== value) {
                                return [false, "两次密码输入不一致"]
                            }
                            this.form.repassword = this.form.password
                            return [true, '']
                        }}/>
                        <Select defaultValue="请选择用户角色" style={{width: 240}} onChange={this.handleChange}>
                            <Option value="5">学生</Option>
                            <Option value="6">教师</Option>
                            <Option value="1">管理员</Option>
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
            type: "POST",
            url: weblocation + "/admin/user/view",
            cache: false,
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            data: {json: JSON.stringify(postbody)},
            success: function (data) {
                const pagination = {...obj.state.pagination};
                var json = JSON.parse(data);
                json['data']=dataProcess(json['data']);
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
        this.state.searchtype=e;
    }
    handleSearch = (value) => {
        this.state.keyword=value;
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
                                    <Option value="1">身份证号</Option>
                                    <Option value="0">姓名</Option>
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