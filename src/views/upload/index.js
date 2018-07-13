import $ from "jquery";
//import Mock from 'mockjs';
import {weblocation} from "../../config";
import React from "react";
import {Icon, Badge, Menu, Dropdown, Progress, Button, notification} from 'antd';


class MyProcess extends React.Component {
    constructor(props) {
        super(props)
        var obj = this;
        this.state = {
            condition: props.condition,
            taskid: props.taskid,
            percent: 0,
            remark: '',
            download: '',
            tasktype: ''
        }
        this.getProcess();
        this.timer = setInterval(
            () => {
                obj.getProcess()
            }, 3000);
    }

    componentWillUnmount() {
        this.timer && window.clearInterval(this.timer);
    }

    getProcess() {
        var obj = this;
        $.ajax({
            type: "GET",
            url: weblocation + "/admin/task/detail?taskid=" + obj.state.taskid,
            cache: false,
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            success: function (data) {
                var json = JSON.parse(data)
                if (json['condition'] == 820) {
                    obj.setState({condition: json['status']});
                    obj.setState({percent: json['process']});
                    obj.setState({remark: json['taskinfo']===undefined?'':json['taskinfo']});
                    obj.setState({download: json['href']});
                    obj.setState({tasktype: json['task_type']});
                }
            }
        })
        if (obj.state.condition != 1) {
            this.timer && window.clearInterval(this.timer);
        }
        if (obj.state.condition == 2) {
            obj.setState({percent: 100});
        }
    }

    handleOnClick(event) {
        var obj = this;
        if (obj.state.remark != undefined&&obj.state.download==undefined) {
            notification.open({
                description: obj.state.remark,
                icon: <Icon type="close" style={{color: '#FF4040'}}/>
            });
        }
        if (obj.state.download != undefined) {
            window.open(weblocation + obj.state.download);
        }
    }

    render() {
        var obj = this;
        var a;
        if (obj.state.tasktype >= 20) {
            a = (<label>下载:</label>);
        }
        else if (obj.state.tasktype >= 10) {
            a = (<label>上传:</label>);
        }
        if (obj.state.condition == 0) {
            return (
                <div>
                    {a}<br/>
                    <Progress percent={obj.state.percent} style={{width: 150}} size="small"/>
                    <label>暂未执行</label>
                </div>
            )
        }
        else if (obj.state.condition == 1) {
            return (
                <div>
                    {a}<br/>
                    <Progress percent={obj.state.percent} style={{width: 150}} size="small"/>
                    <label>正在执行</label>
                </div>
            )
        }
        else if (obj.state.condition == 2) {
            return (
                <div>
                    {a}<br/>
                    <Progress percent={obj.state.percent} style={{width: 150}} size="small"/>
                    <Button type="primary" onClick={() => this.handleOnClick()}>
                        执行成功
                    </Button>
                </div>
            )
        } else if (obj.state.condition == 3) {
            return (
                <div>
                    {a}<br/>
                    <Progress percent={obj.state.percent} style={{width: 150}} size="small"
                              status='exception'/>
                    <Button type="primary" onClick={() => this.handleOnClick()}>
                        查看详情
                    </Button>
                </div>
            )
        }
    }

}

export class Task extends React.Component {

    constructor(props) {
        super(props)
        //获取数据并添加
        var obj = this;
        obj.state = {
            m_menu: [],
            mm_menu: '',
        };
        this.getInfo = this.getInfo.bind(this)
        this.timer = setInterval(
            () => {
                obj.getInfo()
            }, 3000);
        this.getInfo()
    }

    componentWillUnmount() {
        this.timer && window.clearInterval(this.timer);
    }

    getInfo() {
        var obj = this;
        var json = [];
        obj.state.mm_menu = (<Menu><Menu.Item><a>没有任务</a></Menu.Item></Menu>);
        $.ajax({
            type: "GET",
            url: weblocation + "/admin/task/history",
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            success: function (data) {
                json = JSON.parse(data);
                if (json['condition'] == 810 && json['data'].length!=0) {
                    json = json['data'];
                    obj.state.m_menu = [];
                    var tmp = [];
                    for (var i = 0; i < json.length; i++) {
                        tmp.push(<Menu.Item><MyProcess condition={json[i].status}
                                                       taskid={json[i].taskid}/></Menu.Item>);
                    }
                    //obj.setState({m_menu: tmp});
                    obj.state.m_menu = tmp;
                    obj.setState({mm_menu: (<Menu key='hahaha'>{obj.state.m_menu}</Menu>)});
                }
            }

        })
    }

    render() {
        if (this.state.mm_menu == undefined) {
            return;
        }
        return (
            <div className="view">
                <Dropdown overlay={this.state.mm_menu}>
                    <a className="ant-dropdown-link">
                        任务详情 <Icon type="down"/>
                    </a>
                </Dropdown>
            </div>
        )
    }
}