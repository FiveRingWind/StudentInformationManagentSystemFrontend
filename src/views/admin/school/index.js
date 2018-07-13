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
    title: '学籍序号',
    dataIndex: 'id',
    key: 'id'
}, {
    title: '姓名',
    dataIndex: 'name',
    key: 'name'
}, {
    title: '身份证号',
    dataIndex: 'identity',
    key: 'identity'
}, {
    title: '性别',
    dataIndex: 'sex',
    key: 'sex'
}, {
    title: '学号',
    dataIndex: 'student_id',
    key: 'student_id'
}, {
    title: '入学年份',
    dataIndex: 'enrollyear',
    key: 'enrollyear'
}, {
    title: '班级编号',
    dataIndex: 'class_id',
    key: 'class_id'
}, {
    title: '操作',
    render(text, record) {
        return (
            <div>
                <Change record={record} /><Divider type='vertrical'/><Delete
                infoid={record.id}/>
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
            <h1 className="h4 text-uppercase">学籍管理</h1>
            <p className="mb-0">在此页面进行对学籍信息的增删改查</p>
        </header>
    </div>
);

class Change extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            infoid: props.record.id,
            visible: false,
            confirmLoading: false
        }
        this.form = {
            infoid:props.record.id,
            name: '',
            identity: '',
            sex: '',
            studentid: '',
            enrollyear: '',
            collegeid: '',
            classid: '',
        }
        this.old = {
            name: this.props.record.name,
            identity: this.props.record.identity,
            sex: this.props.record.sex,
            studentid: this.props.record.studentid,
            enrollyear: this.props.record.enrollyear,
            collegeid: this.props.record.collegeid,
            classid: this.props.record.classid,
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
        console.log(obj.form.infoid)
        var postbody = {
            name: this.form.name,
            identity: this.form.identity,
            sex: this.form.sex,
            studentid: this.form.studentid,
            enrollyear: this.form.enrollyear,
            collegeid: this.form.collegeid,
            classid: this.form.classid,
            infoid:this.form.infoid
        };
        $.ajax({
                type: "POST",
                url: weblocation + "/admin/student/edit",
                cache: false,
                crossDomain: true,
                xhrFields: {
                    withCredentials: true
                },
                data: {json: JSON.stringify(postbody)},
                success: function (data) {
                    var json = JSON.parse(data);
                    if (json['condition'] == 400) {
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
                        <ValidateForm type="text" title="姓名" hint={this.old.name} value={this.old.name}
                                      vadlidate={(obj, value) => {
                                          this.form.name = '';
                                          if (value.length > 10) {
                                              return [false, "姓名长度不能超过10"]
                                          }
                                          this.form.name = value;
                                          return [true, ""];
                                      }}/>
                        <FormGroup className="mb-4">
                            <Label>性别</Label>
                            <RadioGroup onChange={this.handleCheckChange} value={this.state.typeid}>
                                <Radio value={0}>男</Radio>
                                <Radio value={1}>女</Radio>
                            </RadioGroup>
                        </FormGroup>
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
                        <ValidateForm type="text" title="入学年份" hint={this.old.enrollyear} value={this.old.enrollyear}
                                      vadlidate={(obj, value) => {
                                          this.form.enrollyear = ''
                                          this.form.enrollyear = value
                                          return [true, ""]
                                      }}/>
                        <ValidateForm type="text" title="学校编号" hint={this.old.collegeid} value={this.old.collegeid}
                                      vadlidate={(obj, value) => {
                                          this.form.collegeid = ''
                                          this.form.collegeid = value
                                          return [true, ""]
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
            infoid: props.infoid
        }
    }

    onConfirm() {
        var obj = this;
        var postbody = {
            infoid: [obj.state.infoid]
        }
        $.ajax({
            type: "POST",
            url: weblocation + "/admin/student/delete",
            cache: false,
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            data: {json: JSON.stringify(postbody)},
            success: function (data) {
                var json = JSON.parse(data);
                if (json[0]['condition'] == 411) {
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
            <Popconfirm title="您是否要删除该条学籍信息" okText="Yes" cancelText="No" onConfirm={() => this.onConfirm()}>
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
            identity: '',
            sex: '',
            studentid: '',
            enrollyear: '',
            collegeid: '',
            classid: '',
        }
    }

    showModal = () => {
        var obj = this;
        obj.setState({
            visible: true,
        });
    }
    handleOk = () => {
        if (this.form.name === '' || this.form.identity === '' || this.form.sex === '' || this.form.studentid === '' || this.form.enrollyear === '' || this.form.collegeid === '' || this.form.classid === '') {
            console.log(this.form)
            return;
        }
        this.setState({
            confirmLoading: true,
        });
        var obj = this;
        var postbody = {
            name: this.form.name,
            identity: this.form.identity,
            sex: this.form.sex,
            studentid: this.form.studentid,
            collegeid: this.form.collegeid,
            classid: this.form.classid,
        };
        $.ajax({
                type: "POST",
                url: weblocation + "/admin/student/add",
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
                        <FormGroup className="mb-4">
                            <Label>性别</Label>
                            <RadioGroup onChange={this.handleCheckChange} value={this.state.typeid}>
                                <Radio value={0}>男</Radio>
                                <Radio value={1}>女</Radio>
                            </RadioGroup>
                        </FormGroup>
                        <ValidateForm type="text" title="姓名" hint="张三" vadlidate={(obj, value) => {
                            this.form.name = '';
                            if (value.length === 0) {
                                return [false, "请输入姓名"]
                            } else if (value.length > 10) {
                                return [false, "姓名长度不能超过10"]
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
                        <ValidateForm type="text" title="学号" hint="" vadlidate={(obj, value) => {
                            this.form.studentid = '';
                            this.form.studentid = value;
                            return [true, ""];
                        }}/>
                        <ValidateForm type="text" title="入学年份" hint="" vadlidate={(obj, value) => {
                            this.form.enrollyear = '';
                            this.form.enrollyear = value;
                            return [true, ""];
                        }}/>
                        <ValidateForm type="text" title="班级编号" hint="" vadlidate={(obj, value) => {
                            this.form.classid = '';
                            this.form.classid = value;
                            return [true, ""];
                        }}/>
                    </form>
                </Modal>
            </div>
        )
    }
}

export default class Adminstudent extends React.Component {
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
            type: "POST",
            url: weblocation + "/admin/student/view",
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
    handleDownLoad= (e) => {
        var obj = this;
        var postbody = {
            type:22//导出学籍信息
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
    handleDownLoadmodle(event) {
        event.preventDefault();
        window.open(weblocation + "/admin/templatedownload?type=1");
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
                            <Upload name="excel" action={weblocation + "/admin/import?type=10"}
                                    withCredentials={true} parent={this}>
                                <Button type="primary" onClick={this.handleDownLoadmodle}>
                                    <Icon type="download" />导出学籍模板</Button><br/><br/>
                                <Button type="primary" onClick={() => {
                                    console.log(1)
                                }}>
                                    <Icon type="upload"/>导入学籍信息
                                </Button>
                            </Upload><br/><Button type="primary" onClick={() => {this.handleDownLoad()}}>
                            <Icon type="download" />导出学籍信息</Button><Task/><br/>
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