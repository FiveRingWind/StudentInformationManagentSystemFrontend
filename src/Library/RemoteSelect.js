import {Select, Spin} from 'antd';
import debounce from 'lodash/debounce';
import config from '../config'
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


        // fetch(weblocation+"/"+this.props.url)
        //     .then(response => response.json())
        //     .then((body) => {
        //         if (fetchId !== this.lastFetchId) { // for fetch callback order
        //             return;
        //         }
        //         const data = body.data.map(user => ({
        //             text: `${user.name.first} ${user.name.last}`,
        //             value: user.login.username,
        //         }));
        //         this.setState({ data, fetching: false });
        //     });

        var postbody = {
            currentpage: 1,
            sep: 15,
            condition: {
                name: {data: value, fuzzy: true}

            }
        };

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
                    text: each.name,
                    value: each.id,
                }));
                obj.setState({ data, fetching: false });

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
