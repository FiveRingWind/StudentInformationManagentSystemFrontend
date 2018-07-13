import React from 'react';
import {Link} from 'react-router';
import {
    Card, CardBlock, CardGroup,
    ListGroup, ListGroupItem
} from 'reactstrap';
import $ from "jquery";
import {Table,Select,Button} from 'antd'
import {weblocation,type} from '../../../config';
import img from '../../../logo.png';

const Option = Select.Option;
function timeConverter(UNIX_timestamp){
    var a = new Date(UNIX_timestamp * 1000);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = a.getFullYear();
    var month = a.getMonth()+1;
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time=year+"/"+month+"/"+date+" "+hour+":"+(min<10?"0"+min:min);
    // var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
    return time;
}
const columns = [{
    title: 'score',
    dataIndex: 'final',
    key: 'final',
}];

function getCurrentTime() {
    var time = (new Date()).valueOf();
    return (timeConverter(time/1000))
}
function scoreConverter(msd) {
    var time='';
    msd = parseInt(msd);
    if(msd/1000>60){
        time = Math.floor(msd/(1000 * 60)) + "分钟";
    }
    time = time + Math.floor(msd/1000)%60 + "秒" + Math.floor((msd%1000)/10);
    return time;
}
function dataProcess(json) {
    if(json===undefined)
        return json;
    for(var i = 0 ;i<json.length;i++){
        if(json[i]["type"]===4||json[i]["type"]===5||json[i]["type"]===6){
            json[i]["score"] = scoreConverter(json[i]["score"]);
        }
        json[i]['time'] = timeConverter(json[i]['time']);
        json[i]["type"] = type[json[i]["type"]-1];
        json[i]['final']=json[i]['type']+json[i]['score']+json[i]['time'];
    }
    return json;
}
export default class StuScore extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            datasource: [],
            loading:true,
            provinceOptions:undefined,
            options:undefined
            //options.map(province => <Option key={province["id"]}>{province["planname"]}</Option>)
        }
        this.getStatusList();
        this.firstGet();
    }
    getStatusList(){//获取年份列表
        var obj = this;
        $.ajax({
            type: "GET",
            url: weblocation + "/stu/score/status",
            cache: false,
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            success: function (data) {
                var json = JSON.parse(data);
                if(json["condition"]==610){
                    obj.setState({options:json["data"],loading:false});
                    obj.setState({provinceOptions:obj.state.options.map(province => <Option key={province["id"]}>{province["planname"]}</Option>)});
                }
            }
        })
    }
    handleChange = (value) => {
        var obj = this;
        obj.setState({loading:true});
        $.ajax({
            type: "GET",
            url: weblocation + "/stu/score/final?planid="+value,
            cache: false,
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            success: function (data) {
                var json = JSON.parse(data);
                if(json["condition"]==500){
                    json['finalscore']=dataProcess(json['finalscore']);
                    obj.setState({datasource:json,loading:false});
                }
            }
        })
    }
    firstGet(){
        var obj = this;
        obj.setState({loading:true});
        $.ajax({
            type: "GET",
            url: weblocation + "/stu/score/final",
            cache: false,
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            success: function (data) {
                var json = JSON.parse(data);
                if(json["condition"]==500){
                    json['finalscore']=dataProcess(json['finalscore']);
                    obj.setState({datasource:json,loading:false});
                }
            }
        })
    }
    render() {
        return (
            <div className="view">
                <div className="view-content view-pages view-invoice view d-flex justify-content-center align-items-center flex-column">
                    <Card className="mb-3 invoice-card">
                        <CardBlock>
                            <div className="d-flex justify-content-between flex-wrap">
                                <Link to="/">
                                    <img src={img} style={{width:60,height:40}}/>
                                    <strong className="h2 text-uppercase" style={{color: '#212121'}}>五环风科技</strong>
                                </Link>
                                <div>
                                    <h4 className="text-uppercase">成绩单</h4>
                                    <h6>学号 No - #{(this.state.datasource)['stuid']}</h6>
                                    <small>Date: {getCurrentTime()}</small>
                                </div>
                            </div>
                            <hr/>
                            <div>
                                <Select defaultValue="请选择搜索时间" style={{ width: 300 }} onChange={this.handleChange}>
                                    {this.state.provinceOptions}
                                </Select>
                            </div>
                            <div className=" table-responsive">
                                <Table className="table-bordered" loading={this.state.loading} pagination={false} columns={columns} dataSource={(this.state.datasource)['finalscore']}></Table>
                            </div>
                            <hr/>
                            <p className="text-warning small text-center"><strong>Note:</strong>如对成绩有疑问请及时联系代课老师</p>
                        </CardBlock>
                    </Card>

                </div>
            </div>
        )
    }
}
