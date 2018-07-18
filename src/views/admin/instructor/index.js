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
import {notification} from "antd/lib/index";
import {ValidateForm, IdentityCheck,} from '../../../Library/ValidateForm.js'
import {RemoteSelect} from '../../../Library/RemoteSelect.js'

import styles from './TableList.less';
import debounce from 'lodash/debounce';

const Option = Select.Option;
const FormItem = Form.Item;

var Class;

function dataProcess(json) {
    if (json === undefined)
        return json;
    for (var i = 0; i < json.length; i++) {
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
        title: '辅导员编号',
        dataIndex: 'id',
        key: 'id'
    }, {
        title: '用户名',
        dataIndex: 'username',
        key: 'username'
    }, {
        title: '姓名',
        dataIndex: 'peoplename',
        key: 'peoplename'
    }, {
        title: '管理班级',
        dataIndex: 'classname',
        key: 'classname'
    },
    {
        title: '操作',
        render(text, record) {
            return (
                <div>
                    <Change record={record} id={record.id}/><Divider type='vertrical'/>
                    <Delete id={record.id}/><Divider type='vertrical'/>
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
            <h1 className="h4 text-uppercase">辅导员管理</h1>
            <p className="mb-0">在此页面进行对辅导员信息的增删改查</p>
        </header>
    </div>
);

class Change extends React.Component {
    constructor(props) {
        super(props);
        this.handleOk = this.handleOk.bind(this);
        this.state = {
            id: this.props.id,
            visible: false,
            confirmLoading: false
        };
        this.form = {
            id: this.props.id,
            classid:this.props.classid
        }
    }

    componentDidUpdate(nextProps) {


    }

    componentDidMount() {
        this.state = {
            id: this.props.id,
            visible: false,
            confirmLoading: false
        };

        this.form = {
            id: this.props.id,
            uid: this.props.record.uid,
            classid: this.props.record.classid,

        };
    }

    showModal = () => {
        var obj = this;
        obj.setState({
            visible: true,
        });
    }
    handleOk = () => {
        var raw_form = this.props.form.getFieldsValue();

        if(this.form.uid===''||this.form.classid==='' ){
            return
        }
        this.setState({
            confirmLoading: true,
        });
        var obj = this;
        if(raw_form.classid!==undefined){
            this.form.classid=parseInt(raw_form.classid.key)
        }
        if(raw_form.uid!==undefined){
            this.form.uid=parseInt(raw_form.uid.key)
        }
        var postbody = {
            id: this.form.id,
            uid:this.form.uid,
            classid:this.form.classid,
        }
        $.ajax({
                type: "POST",
                url: weblocation + "/manager/instructor/edit",
                cache: false,
                crossDomain: true,
                xhrFields: {
                    withCredentials: true
                },
                data: JSON.stringify(postbody),
                success: function (data) {
                    var json = JSON.parse(data);
                    if (json['code'] === 2000) {
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
        const {form} = this.props;
        return (
            <span>
                <a color="primary" href="#" onClick={this.showModal}>修改</a>
                <Modal title="修改辅导员信息"
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
                        <RemoteSelect placeholder="请输入用户名" url="manager/user/search" fieldtname="uid" condition={{type:{data:2,fuzzy:false}}} form={form} searchkey="username" id="uid" name="username"
                                               />
                        <RemoteSelect placeholder="输入班级名称" url="manager/class/search" fieldtname="classid" form={form}
                        />
                    </form>
                </Modal>
            </span>
        )
    }
}

Change = Form.create({})(Change);


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
            url: weblocation + "/manager/instructor/delete",
            cache: false,
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            data: JSON.stringify(postbody),
            success: function (data) {
                var json = JSON.parse(data);
                if (json['code'] === 1900) {
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
            <Popconfirm title="您是否要删除该辅导员管理信息" okText="Yes" cancelText="No" onConfirm={() => this.onConfirm()}>
                <a>删除</a>
            </Popconfirm>
        )
    }
}


class Add extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    showModal = () => {
        var obj = this;
        obj.setState({
            visible: true,
        });
    }
    handleOk = () => {
        var raw_form = this.props.form.getFieldsValue();
        if (raw_form.classid === undefined || raw_form.uid === undefined) {
            console.log(this.form)
            return;
        }
        this.setState({
            confirmLoading: true,
        });


        var obj = this;
        var postbody = {
            uid: parseInt(raw_form.uid.key),
            classid: parseInt(raw_form.classid.key),
        };
        $.ajax({
                type: "POST",
                url: weblocation + "/manager/instructor/add",
                cache: false,
                crossDomain: true,
                xhrFields: {
                    withCredentials: true
                },
                data: JSON.stringify(postbody),
                success: function (data) {
                    var json = JSON.parse(data);
                    if (json['code'] === 1800) {
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

    }

    render() {
        const {form} = this.props;
        const {getFieldDecorator} = form;
        return (
            <div>
                <Button type="primary" href="#" onClick={this.showModal}>添加</Button>
                <Modal title="添加辅导员"
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

                        <RemoteSelect placeholder="请输入用户名" url="manager/user/search" fieldtname="uid" condition={{type:{data:2,fuzzy:false}}} form={form} searchkey="username" id="uid" name="username"
                        />
                        <RemoteSelect placeholder="输入班级名称" url="manager/class/search" fieldtname="classid" form={form}
                        />

                    </form>
                </Modal>
            </div>
        )
    }
}

Add = Form.create({})(Add);


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
class AdminStuent extends React.Component {
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
            url: weblocation + "/manager/instructor/search",
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
                        <FormItem label="姓名">
                            {getFieldDecorator('peoplename')(<Input placeholder="请输入"/>)}
                        </FormItem>
                    </Col>
                    <Col md={8} sm={24}>
                        <FormItem label="班级名称">
                            {getFieldDecorator('classname')(<Input placeholder="请输入"/>)}
                        </FormItem>
                    </Col>
                    <Col md={8} sm={24}>
                        <FormItem label="用户名">
                            {getFieldDecorator('enrollyear')(<Input placeholder="请输入"/>)}
                        </FormItem>
                    </Col>
                    {/*<Col md={8} sm={24}>*/}
                    {/*<FormItem label="身份证">*/}
                    {/*{getFieldDecorator('identity')(<Input placeholder="请输入"/>)}*/}
                    {/*</FormItem>*/}
                    {/*</Col>*/}
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

    renderForm() {
        const {expandForm} = this.state;
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

AdminStuent = Form.create({})(AdminStuent);

export default AdminStuent;