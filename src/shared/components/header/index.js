import React from 'react';
import screenfull from 'screenfull';
import {
    UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem,
    Button, Progress, Modal, ModalHeader, ModalBody, ModalFooter
} from 'reactstrap';
import $ from 'jquery';

// icons
import IconNotification from 'react-icons/lib/md/notifications-none';
import IconFullScreen from 'react-icons/lib/md/crop-free';
import IconSearch from 'react-icons/lib/md/search';
import IconFace from 'react-icons/lib/md/face';
import IconMail from 'react-icons/lib/md/mail';
import IconSecurity from 'react-icons/lib/md/security';
import IconHelp from 'react-icons/lib/md/help';
import IconLogout from 'react-icons/lib/md/power-settings-new';
import IconDownload from 'react-icons/lib/md/cloud-download';
import IconCake from 'react-icons/lib/md/cake';
import IconMenu from 'react-icons/lib/md/menu';

// style
import './style.css';
import config from '../../../config'

var weblocation = config["weblocation"]

export default class SiteHead extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            modalClass: '',
            name: ''
        };
        this.toggle = this.toggle.bind(this);
        this.logout = this.logout.bind(this);

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
        alert("wzq")
        this.setState({
            modal: !this.state.modal,
            modalClass: str
        })
    }

    logout() {
        var obj = this;
        this.toggle();
        $.ajax({
            type: "GET",
            url: weblocation + "/common/logout",
            cache: false,
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            success: function (data) {
                obj.props.router.push('/pages/signin');

            }
        });

    }

    render() {
        return (
            <header className="site-head d-flex align-items-center justify-content-between">
                <div className="wrap mr-4">
                    <IconMenu size="24" color="#fff" onClick={this.props.toggleNav} style={{cursor: 'pointer'}}/>
                </div>
                <Modal isOpen={this.state.modal} toggle={this.toggle} className="modalRapid">
                    <ModalHeader toggle={this.toggle}>提示</ModalHeader>
                    <ModalBody>
                        是否确认注销?
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.logout}>确认</Button>{' '}
                        <Button color="secondary" onClick={this.toggle}>取消</Button>
                    </ModalFooter>
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

