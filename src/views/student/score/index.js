import React from 'react';
import {
    Card, CardBlock,Button
} from 'reactstrap';
import $ from "jquery";
import { Table, Icon, Divider } from 'antd';
import {weblocation,type} from "../../../config";
import {Link, IndexLink} from 'react-router';

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
    title: '类型',
    dataIndex: 'type',
    key: 'type',
}, {
    title: '成绩',
    dataIndex: 'score',
    key: 'score',
}, {
    title: '测试时间',
    dataIndex: 'time',
    key: 'time',
    render:(text)=>{
        return(timeConverter(text))

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
            <h1 className="h4 text-uppercase">测试成绩</h1>
            <p className="mb-0">此处展示的为测试成绩并非最终成绩</p>

        </header>
    </div>
);

function scoreConverter(msd) {
    var time='';
    msd = parseInt(msd);
    if(msd/1000>60){
        time = Math.floor(msd/(1000 * 60)) + "分钟";
    }
    time = time + Math.floor(msd/1000)%60 + "秒" + msd%1000 ;
    return time;
}
function dataProcess(json) {
    if(json===undefined)
        return json;
    for(var i = 0 ;i<json.length;i++){
        if(json[i].type=='4'||json[i].type=='5'||json[i].type=='6'){
            json[i].score = scoreConverter(json[i].score);
        }
        json[i].type = type[json[i].type-1];
    }
    return json;
}
export default class StuScore extends React.Component {
    constructor(props) {
        super(props)
        this.state = {datasource: [],loading: true,pagination: {}}

    }
    handleTableChange = (pagination) => {
        const pager = { ...this.state.pagination };
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
        this.setState({ loading: true });
        $.ajax({
            type: "GET",
            url: weblocation + "/stu/score/view?num="+params.num+"&pos="+params.pos,
            cache: false,
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            success: function (data) {
                const pagination = { ...obj.state.pagination };
                var json = JSON.parse(data);
                json["testscore"]=dataProcess(json["testscore"]);
                pagination.total = json["count"];
                obj.setState({datasource:json["testscore"],loading:false,pagination});

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

    render() {
        return (
            <div className="view">
                <ViewHeader/>
                <ViewContent>
                    <Card className="mb-4">
                        <CardBlock className="table-responsive">
                            <h6 className="mb-4 text-uppercase">Data Table</h6>
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