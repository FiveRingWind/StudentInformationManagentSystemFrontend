import React from 'react';
import {
    Card, CardBlock
} from 'reactstrap';
import $ from "jquery";
import {
    Table, Icon, Divider, Popconfirm, Button, Modal, Input, Select, Upload, Row, InputNumber, DatePicker,
    Col, Form
} from 'antd';
import {type, weblocation} from "../../../config";
import {Link, IndexLink} from 'react-router';
import {notification} from "antd/lib/index";
import {ValidateForm, IdentityCheck, EmailCheck} from '../../../Library/ValidateForm.js'
import styles from './TableList.less';

const InputGroup = Input.Group;
const Option = Select.Option;
const Search = Input.Search;
const FormItem = Form.Item;

var Class;


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

    componentDidUpdate(nextProps) {
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

    componentDidUpdate(nextProps) {

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
        this.componentDidUpdate = this.componentDidUpdate.bind(this)
    }

    componentDidUpdate() {
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

const CreateForm = Form.create()(props => {
    const {modalVisible, form, handleAdd, handleModalVisible} = props;
    const okHandle = () => {
        form.validateFields((err, fieldsValue) => {
            if (err) return;
            form.resetFields();
            handleAdd(fieldsValue);
        });
    };
    return (
        <Modal
            title="新建规则"
            visible={modalVisible}
            onOk={okHandle}
            onCancel={() => handleModalVisible()}
        >
            <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="描述">
                {form.getFieldDecorator('desc', {
                    rules: [{required: true, message: 'Please input some description...'}],
                })(<Input placeholder="请输入"/>)}
            </FormItem>
        </Modal>
    );
});

// @Form.create()
class AdminUser extends React.Component {
    constructor(props) {
        super(props)
        //this.handleSearch=this.handleOnchange.bind(this)
        this.state = {
            datasource: [],
            loading: true,
            pagination: {},
            searchtype: '',
            keyword: '',
            expandForm: false,
            modalVisible: false
        }
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
            condition: {}
        };

        var condition_raw = this.props.form.getFieldsValue();
        for (var key in condition_raw) {
            if (condition_raw[key] === undefined||condition_raw[key]==="")
                continue
            postbody["condition"][key] = {
                "data": condition_raw[key], "fuzzy": true
            }
        }


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
                pagination.pageSize = json['sep'];
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
    toggleForm = () => {
        const {expandForm} = this.state;
        this.setState({
            expandForm: !expandForm,
        });
    };
    handleSearch = (e) => {

        e.preventDefault();


        // this.state.keyword = value;
        this.componentDidMount();
    }
    handleFormReset = () => {
        const { form, dispatch } = this.props;
        form.resetFields();
        this.setState({
            formValues: {},
        });

    };
    renderSimpleForm() {
        const {form} = this.props;
        const {getFieldDecorator} = form;
        return (
            <Form onSubmit={this.handleSearch} layout="inline">
                <Row gutter={{md: 8, lg: 24, xl: 48}}>
                    <Col md={8} sm={24}>
                        <FormItem label="姓名">
                            {getFieldDecorator('name')(<Input placeholder="请输入"/>)}
                        </FormItem>
                    </Col>
                    <Col md={8} sm={24}>
                        <FormItem label="身份证">
                            {getFieldDecorator('identity')(<Input placeholder="请输入"/>)}
                        </FormItem>
                    </Col>
                    <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{marginLeft: 8}} onClick={this.handleFormReset}>
                重置
              </Button>
              <a style={{marginLeft: 8}} onClick={this.toggleForm}>
                展开 <Icon type="down"/>
              </a>
            </span>
                    </Col>
                </Row>
            </Form>
        );
    }

    renderAdvancedForm() {
        const {form} = this.props;
        const {getFieldDecorator} = form;
        return (
            <Form onSubmit={this.handleSearch} layout="inline">
                <Row gutter={{md: 8, lg: 24, xl: 48}}>
                    <Col md={8} sm={24}>
                        <FormItem label="姓名">
                            {getFieldDecorator('name')(<Input placeholder="请输入"/>)}
                        </FormItem>
                    </Col>
                    <Col md={8} sm={24}>
                        <FormItem label="性别">
                            {getFieldDecorator('sex',{
                                initialValue: ""
                            })(
                                <Select value="">
                                    <Option value="">任意</Option>
                                    <Option value="0">女</Option>
                                    <Option value="1">男</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col md={8} sm={24}>
                        <FormItem label="身份证">
                            {getFieldDecorator('identity')(<Input placeholder="请输入"/>)}
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={{md: 8, lg: 24, xl: 48}}>
                    <Col md={8} sm={24}>
                        <FormItem label="籍贯">
                            {getFieldDecorator('nativeplace')(<Input placeholder="请输入"/>)}
                        </FormItem>
                    </Col>
                    <Col md={8} sm={24}>
                        <FormItem label="用户类型">
                            {getFieldDecorator('type',{
                                initialValue: ""
                            })(
                                <Select value="">
                                    <Option value="">任意</Option>
                                    <Option value="1">学生</Option>
                                    <Option value="2">辅导员</Option>
                                    <Option value="3">管理员</Option>

                                </Select>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <div style={{overflow: 'hidden'}}>
          <span style={{float: 'right', marginBottom: 24}}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{marginLeft: 8}} onClick={this.handleFormReset}>
              重置
            </Button>
            <a style={{marginLeft: 8}} onClick={this.toggleForm}>
              收起 <Icon type="up"/>
            </a>
          </span>
                </div>
            </Form>
        );
    }

    renderForm() {
        const {expandForm} = this.state;
        return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
    }

    render() {
        const {selectedRows, modalVisible} = this.state;

        const parentMethods = {
            handleAdd: this.handleAdd,
            handleModalVisible: this.handleModalVisible,
        };
        return (
            <div className="view">
                <ViewHeader/>
                <ViewContent>
                    <CreateForm {...parentMethods} modalVisible={modalVisible}/>

                    <Card className="mb-4">
                        <CardBlock className="table-responsive">
                            <h6 className="mb-4 text-uppercase">Data Table</h6>
                            <Add/><br/>
                            <div className={styles.tableListForm}>{this.renderForm()}</div>

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

AdminUser = Form.create({})(AdminUser);

export default AdminUser;