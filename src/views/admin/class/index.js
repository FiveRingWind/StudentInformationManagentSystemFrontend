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
        title: '班级编号',
        dataIndex: 'id',
        key: 'id'
    }, {
        title: '班级名称',
        dataIndex: 'name',
        key: 'name'
    }, {
        title: '操作',
        render(text, record) {
            return (
                <div>
                    <Change record={record} id={record.id}/><Divider type='vertrical'/>
                    <Delete uid={record.id}/><Divider type='vertrical'/>
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
            <h1 className="h4 text-uppercase">班级管理</h1>
            <p className="mb-0">在此页面进行对班级信息的增删改查</p>
        </header>
    </div>
);

class Change extends React.Component {
    constructor(props) {
        super(props)
        this.handleOk = this.handleOk.bind(this);
        this.state = {
            id: props.id,
            visible: false,
            confirmLoading: false
        }
        this.form = {
            id: props.id,
        }
        this.old = {
            name: this.props.record.name,
        }
    }

    componentDidUpdate(nextProps) {
        this.state = {
            uid: this.props.uid,
            visible: false,
            confirmLoading: false
        }
        this.form = {
            id: this.props.id,
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
                url: weblocation + "/manager/class/edit",
                cache: false,
                crossDomain: true,
                xhrFields: {
                    withCredentials: true
                },
                data: JSON.stringify(obj.form),
                success: function (data) {
                    var json = JSON.parse(data);
                    if (json['code'] == 1200) {
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
                <Modal title="修改班级信息"
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
                        <ValidateForm type="text" title="班级名称" hint="请输入班级名称" value={this.old.name}
                                      vadlidate={(obj, value) => {
                                          this.form.name = '';
                                          if (value.length === 0) {
                                              return [false, "请输入班级名称"]
                                          } else if (value.length > 100) {
                                              return [false, "用户名长度不能超过100"]
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
    }

    componentDidUpdate(nextProps) {

    }

    onConfirm() {
        var obj = this;
        var postbody = {
            id: obj.props.id
        }
        $.ajax({
            type: "POST",
            url: weblocation + "/manager/class/delete",
            cache: false,
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            data: JSON.stringify(postbody),
            success: function (data) {
                var json = JSON.parse(data);
                if (json['code'] === 1100) {
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
            <Popconfirm title="您是否要删除班级" okText="Yes" cancelText="No" onConfirm={() => this.onConfirm()}>
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
                url: weblocation + "/manager/class/add",
                cache: false,
                crossDomain: true,
                xhrFields: {
                    withCredentials: true
                },
                data: JSON.stringify(obj.form),
                success: function (data) {
                    var json = JSON.parse(data);
                    if (json['code'] === 1000) {
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
                <Modal title="添加班级"
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
                        <ValidateForm type="text" title="班级名称" hint="请输入班级名称"
                                      vadlidate={(obj, value) => {
                                          this.form.name = '';
                                          if (value.length === 0) {
                                              return [false, "请输入班级名称"]
                                          } else if (value.length > 100) {
                                              return [false, "用户名长度不能超过100"]
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
class AdminClass extends React.Component {
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
            if (condition_raw[key] === undefined || condition_raw[key] === "")
                continue
            postbody["condition"][key] = {
                "data": condition_raw[key], "fuzzy": true
            }
        }


        $.ajax({
            type: "POST",
            url: weblocation + "/manager/class/search",
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
        const {form, dispatch} = this.props;
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
                        <FormItem label="班级名称	">
                            {getFieldDecorator('name')(<Input placeholder="请输入"/>)}
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
            </span>
                    </Col>
                </Row>
            </Form>
        );
    }

    renderForm() {
        return this.renderSimpleForm();
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

AdminClass = Form.create({})(AdminClass);

export default AdminClass;