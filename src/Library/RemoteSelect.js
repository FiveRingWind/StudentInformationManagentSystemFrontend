import {Select, Spin} from 'antd';
import debounce from 'lodash/debounce';
import config, {type} from '../config'
import React from 'react';
import $ from "jquery";

var weblocation = config["weblocation"]

const Option = Select.Option;

export class RemoteSelect extends React.Component {
    constructor(props) {
        super(props);
        this.lastFetchId = 0;
        this.placeholder = this.props.placeholder;
        this.fetchUser = debounce(this.fetchUser, 800);
    }

    state = {
        data: [],
        value: [],
        fetching: false,
    }

    fetchUser = (value) => {

        console.log('fetching user', value);
        this.lastFetchId += 1;
        const fetchId = this.lastFetchId;
        var obj = this;
        this.setState({data: [], fetching: true});
        var key=((typeof this.props.searchkey ==="undefined")?"name":this.props.searchkey)
        var postbody = {
            currentpage: 1,
            sep: 15,
            condition: {

            }
        };
        postbody["condition"][key]= {data: value, fuzzy: true}
        if(typeof obj.props.condition !=="undefined"){
            postbody["condition"]=$.extend(postbody["condition"], obj.props.condition);
        }
        $.ajax({
            type: "POST",
            url: weblocation + "/" + this.props.url,
            cache: false,
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            data: JSON.stringify(postbody),
            success: function (data) {
                if (fetchId !== obj.lastFetchId) { // for fetch callback order
                    return;
                }
                var json = JSON.parse(data);
                var data = json.data.map(each => ({
                    text: each[typeof obj.props.name ==="undefined"?"name": obj.props.name],
                    value: each[typeof obj.props.id ==="undefined"?"id": obj.props.id],
                }));
                obj.setState({data, fetching: false});

            }
        })
    }

    handleChange = (value) => {
        this.setState({
            value,
            data: [],
            fetching: false,
        });
    }

    render() {
        const {fetching, data, value} = this.state;


        if (typeof this.props.form !== "undefined")
            return (
                this.props.form.getFieldDecorator(this.props.fieldtname)( <Select
                    showSearch
                    labelInValue
                    value={value}
                    placeholder={this.placeholder}
                    notFoundContent={fetching ? <Spin size="small"/> : null}
                    filterOption={false}
                    onSearch={this.fetchUser}
                    onChange={this.handleChange}
                    style={{width: '100%'}}
                >
                    {data.map(d => <Option key={d.value}>{d.text}</Option>)}
                </Select>)
            );
        else
            return (
                <Select
                    showSearch
                    labelInValue
                    value={value}
                    placeholder={this.placeholder}
                    notFoundContent={fetching ? <Spin size="small"/> : null}
                    filterOption={false}
                    onSearch={this.fetchUser}
                    onChange={this.handleChange}
                    style={{width: '100%'}}
                >
                    {data.map(d => <Option key={d.value}>{d.text}</Option>)}
                </Select>
            );
    }
}

export default () => {
}
