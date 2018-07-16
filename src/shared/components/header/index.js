import React from 'react';
import {
    UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem,
    Progress, ModalHeader, ModalBody, ModalFooter
} from 'reactstrap';

import $ from 'jquery';

// icons
import {Modal, Button} from 'antd';

import IconFace from 'react-icons/lib/md/face';
import IconLogout from 'react-icons/lib/md/power-settings-new';
import IconMenu from 'react-icons/lib/md/menu';

// style
import './style.css';
import config from '../../../config'

var weblocation = config["weblocation"]

export default class SiteHead extends React.Component {
    state = {
        ModalText: '是否确认注销?',
        visible: false,
        confirmLoading: false,
    }

    constructor(props) {
        super(props);
        this.toggle = this.toggle.bind(this);

    }

    showModal = () => {
        this.setState({
            visible: true,
        });
    }
    handleCancel = () => {
        console.log('Clicked cancel button');
        this.setState({
            visible: false,
        });
    }
    handleOk = () => {
        var obj=this
        this.setState({
            ModalText: '注销成功后将会返回登录页面',
            confirmLoading: true,
        });
        $.ajax({
            type: "GET",
            url: weblocation + "/common/logout",
            cache: false,
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            success: function (data) {
                obj.setState({
                    visible: false,
                    confirmLoading: false,
                });
                obj.props.router.push('/pages/signin');

            }
        });
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
                var json = JSON.parse(data)
                if (json['code'] === 0) {
                    obj.time = window.setTimeout(() => {
                        obj.props.router.push('/pages/signin')
                    }, 100);
                }
                else {
                    obj.setState({name: json['data']['name']});
                }
            }
        });
    }

    toggle = (e, str) => {
        //alert("wzq")
        this.showModal();
    }



    render() {
        return (
            <header className="site-head d-flex align-items-center justify-content-between">
                <div className="wrap mr-4">
                    <IconMenu size="24" color="#fff" onClick={this.props.toggleNav} style={{cursor: 'pointer'}}/>
                </div>
                <Modal title="Title"
                       visible={this.state.visible}
                       onOk={this.handleOk}
                       confirmLoading={this.state.confirmLoading}
                       onCancel={this.handleCancel}
                >
                    <p>{this.state.ModalText}</p>
                </Modal>
                {/*<form className="col-7 col-sm-8 col-md-7 p-0 site-search">*/}
                {/*<IconSearch color="#515151" size="22"/>*/}
                {/*<input type="text" placeholder="Type your search ..." className="form-control"/>*/}
                {/*</form>*/}
                <div className="right-elems ml-auto d-flex">
                    {/*<div className="wrap hidden-sm-down">*/}
                    {/*<IconFullScreen size="22" color="#fff" onClick={() => screenfull.toggle()}/>*/}
                    {/*</div>*/}
                    <div className="wrap profile">
                        <UncontrolledDropdown>
                            <DropdownToggle tag="div">
                                <img src="http://i.imgur.com/0rVeh4A.jpg" alt="avatar"/>
                            </DropdownToggle>
                            <DropdownMenu right style={{minWidth: '12rem'}}>
                                <DropdownItem header>姓名:{this.state.name}</DropdownItem>
                                <DropdownItem divider/>
                                <DropdownItem onClick={() => this.props.router.push('/user/info')}><IconFace
                                    size="16"/>&emsp;<a href="#na">个人信息</a></DropdownItem>
                                {/*<DropdownItem><IconMail size="16"/>&emsp;<a href="#na">收件箱</a></DropdownItem>*/}
                                <div className="text-right ml-3 mr-3 mt-2"><Button block color="success" size="sm"
                                                                                   onClick={this.toggle}><IconLogout
                                    size="15"/>&emsp;注销</Button></div>
                            </DropdownMenu>
                        </UncontrolledDropdown>
                    </div>
                </div>
            </header>
        )
    }

}

