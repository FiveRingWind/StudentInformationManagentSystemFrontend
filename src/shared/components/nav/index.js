import React from 'react';
import {Link, IndexLink} from 'react-router';
import {Collapse} from 'reactstrap';
import img from '../nav/logo.png';

// icons
import IconDashboard from 'react-icons/lib/md/dashboard';
import IconWidgets from 'react-icons/lib/md/extension';
import IconUI from 'react-icons/lib/md/gradient';
import IconPages from 'react-icons/lib/md/filter-none';
import IconChart from 'react-icons/lib/md/landscape';
import IconTable from 'react-icons/lib/md/grid-on';
import IconForm from 'react-icons/lib/md/layers';
import IconDown from 'react-icons/lib/md/chevron-right';
import IconMail from 'react-icons/lib/md/email';
import ScrollArea from '../scrollbar';

import './style.css';
import {weblocation} from "../../../config";
import $ from "jquery";


const NavHead = (props) => (
    <header className="nav-head">
        <Link to="/">
            <img src={img} style={{width:48,height:32}}/>
            <strong className="h4 text-uppercase">WZQ</strong>
        </Link>
        <div className={`toggle-dot ${props.mini ? 'active' : ''}`} onClick={props.toggleNav}></div>
    </header>
);


class NavList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: 0,
            role: ''
        }
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
                obj.setState({role: json['data']['type']});

            }
        });
    }

    handleClick = (index, e) => {
        let c = e.currentTarget.className;
        e.preventDefault();
        e.stopPropagation();
        this.setState({
            selected: (c.indexOf('selected') >= 0) ? '' : index
        })
    }
    handleOpen = (index, e) => {
        e.stopPropagation();
        this.setState({
            selected: index
        })
    }


    render() {
        var currentRole = this.state.role;
        return (
            <ScrollArea className="nav-list-container" horizontal={false}
                        verticalScrollbarStyle={{width: '4px', marginLeft: '10px'}}>
                <ul className="list-unstyled nav-list clearfix">
                    <li>
                        <div className="nav-list-title">Views</div>
                    </li>
                    <li onClick={this.handleClick.bind(this, 0)}
                        className={(this.state.selected === 0) ? 'selected' : ''}
                        style={currentRole === 5 ? {display: 'block'} : {display: 'none'}}>
                        <IndexLink to="/student/certitication" activeClassName="active">
                            <IconDashboard size="18" color="#2962FF" className="icon-dashboard"/>
                            <span className="name">准考证下载</span>
                        </IndexLink>
                    </li>
                    <li onClick={this.handleClick.bind(this, 0)}
                        className={(this.state.selected === 0) ? 'selected' : ''}
                        style={currentRole === 5 ? {display: 'block'} : {display: 'none'}}>
                        <IndexLink to="/student/reservation" activeClassName="active">
                            <IconWidgets size="18" color="#7C4DFF"/>
                            <span className="name">免测申请</span>
                        </IndexLink>
                    </li>
                    {/*<li onClick={this.handleClick.bind(this, 0)}*/}
                        {/*className={(this.state.selected === 0) ? 'selected' : ''}*/}
                        {/*style={currentRole === 5 ? {display: 'block'} : {display: 'none'}}>*/}
                        {/*<IndexLink to="/" activeClassName="active">*/}
                            {/*<IconWidgets size="18" color="#7C4DFF"/>*/}
                            {/*<span className="name">考试预约</span>*/}
                        {/*</IndexLink>*/}
                    {/*</li>*/}
                    <li onClick={this.handleClick.bind(this, 0)}
                        className={(this.state.selected === 0) ? 'selected' : ''}
                        style={currentRole === 5 ? {display: 'block'} : {display: 'none'}}>
                        <IndexLink to="/student/score" activeClassName="active">
                            <IconUI size="18"/>
                            <span className="name">测试成绩</span>
                        </IndexLink>
                    </li>
                    <li onClick={this.handleClick.bind(this, 0)}
                        className={(this.state.selected === 0) ? 'selected' : ''}
                        style={currentRole === 6 || currentRole === 1? {display: 'block'} : {display: 'none'}}>
                        <IndexLink to="/teacher/changescore" activeClassName="active">
                            <IconWidgets size="18" color="#7C4DFF"/>
                            <span className="name">修改成绩</span>
                        </IndexLink>
                    </li>
                    <li onClick={this.handleClick.bind(this, 0)}
                        className={(this.state.selected === 0) ? 'selected' : ''}
                        style={(currentRole === 1 || currentRole === 6)? {display: 'block'} : {display: 'none'}}>
                        <IndexLink to="/teacher/audit" activeClassName="active">
                            <IconWidgets size="18" color="#7C4DFF"/>
                            <span className="name">免测审核</span>
                        </IndexLink>
                    </li>
                    <li onClick={this.handleClick.bind(this, 0)}
                        className={(this.state.selected === 0) ? 'selected' : ''}
                        style={currentRole === 1 ? {display: 'block'} : {display: 'none'}}>
                        <IndexLink to="/admin/check" activeClassName="active">
                            <IconDashboard size="18" color="#2962FF" className="icon-dashboard"/>
                            <span className="name">成绩修改审核</span>
                        </IndexLink>
                    </li>
                    <li onClick={this.handleClick.bind(this, 0)}
                        className={(this.state.selected === 0) ? 'selected' : ''}
                        style={currentRole === 5 ? {display: 'block'} : {display: 'none'}}>
                        <IndexLink to="/student/finalscore" activeClassName="active">
                            <IconDashboard size="18" color="#2962FF" className="icon-dashboard"/>
                            <span className="name">成绩单</span>
                        </IndexLink>
                    </li>
                    <li onClick={this.handleClick.bind(this, 0)}
                        className={(this.state.selected === 0) ? 'selected' : ''}
                        style={currentRole === 1 ? {display: 'block'} : {display: 'none'}}>
                        <IndexLink to="/admin/user" activeClassName="active">
                            <IconWidgets size="18" color="#7C4DFF"/>
                            <span className="name">用户信息管理</span>
                        </IndexLink>
                    </li>
                    <li onClick={this.handleClick.bind(this, 0)}
                        className={(this.state.selected === 0) ? 'selected' : ''}
                        style={currentRole === 1 ? {display: 'block'} : {display: 'none'}}>
                        <IndexLink to="/admin/stuinfo" activeClassName="active">
                            <IconWidgets size="18" color="#7C4DFF"/>
                            <span className="name">学籍信息管理</span>
                        </IndexLink>
                    </li>
                    <li onClick={this.handleClick.bind(this, 0)}
                        className={(this.state.selected === 0) ? 'selected' : ''}
                        style={currentRole === 1 ? {display: 'block'} : {display: 'none'}}>
                        <IndexLink to="/admin/site" activeClassName="active">
                            <IconWidgets size="18" color="#7C4DFF"/>
                            <span className="name">场地信息管理</span>
                        </IndexLink>
                    </li>
                    <li onClick={this.handleClick.bind(this, 0)}
                        className={(this.state.selected === 0) ? 'selected' +
                            '' : ''}
                        style={currentRole === 1 ? {display: 'block'} : {display: 'none'}}>
                        <IndexLink to="/admin/college" activeClassName="active">
                            <IconWidgets size="18" color="#7C4DFF"/>
                            <span className="name">学院信息管理</span>
                        </IndexLink>
                    </li>
                    <li onClick={this.handleClick.bind(this, 0)}
                        className={(this.state.selected === 0) ? 'selected' : ''}
                        style={currentRole === 1 ? {display: 'block'} : {display: 'none'}}>
                        <IndexLink to="/admin/class" activeClassName="active">
                            <IconWidgets size="18" color="#7C4DFF"/>
                            <span className="name">班级信息管理</span>
                        </IndexLink>
                    </li>
                    <li onClick={this.handleClick.bind(this, 0)}
                        className={(this.state.selected === 0) ? 'selected' : ''}
                        style={currentRole === 3 ? {display: 'block'} : {display: 'none'}}>
                        <IndexLink to="/admin/user" activeClassName="active">
                            <IconWidgets size="18" color="#7C4DFF"/>
                            <span className="name">用户信息管理</span>
                        </IndexLink>
                    </li>
                </ul>
            </ScrollArea>
        )
    }
}
export default (props) => (
    <nav className={`site-nav ${props.mini ? 'mini' : ''}`}>
        <NavHead {...props}/>
        <NavList/>
    </nav>
);
