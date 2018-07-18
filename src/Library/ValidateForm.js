import React from "react";
// import {
//     Input, Label, FormGroup, FormFeedback,
// } from 'reactstrap';
import {Form, Input, DatePicker, Col, TimePicker, Select, Cascader} from 'antd';

const FormItem = Form.Item;

export function IdentityCheck(idcode) {
    if (idcode.length !== 18) return false;
    var weight_factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
    var check_code = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
    var code = idcode + "";
    var last = idcode[17];//最后一个
    var seventeen = code.substring(0, 17);
    var arr = seventeen.split("");
    var len = arr.length;
    var num = 0;
    for (var i = 0; i < len; i++) {
        num = num + arr[i] * weight_factor[i];
    }
    var resisue = num % 11;
    var last_no = check_code[resisue];
    var idcard_patter = /^[1-9][0-9]{5}([1][9][0-9]{2}|[2][0][0|1][0-9])([0][1-9]|[1][0|1|2])([0][1-9]|[1|2][0-9]|[3][0|1])[0-9]{3}([0-9]|[X])$/;

    var format = idcard_patter.test(idcode);
    return (last === last_no && format) ? true : false;
}

export function EmailCheck(value) {
    var b = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
    if (b.test(value) === false)
        return false
    return true
}

export class ValidateForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {value: (props.value) ? props.value : '', inputed: false, correct: false};
        this.handleBlur = this.handleBlur.bind(this);
        this.handleFocus = this.handleFocus.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.seterror = this.seterror.bind(this);
        this.clear = this.clear.bind(this);
    }

    clear() {
        this.setState({value: ''});
    }

    seterror(status, error) {
        this.error = error
        this.setState({correct: status});
    }
    componentDidUpdate(nextProps) {
        this.state = {value: (this.props.value) ? this.props.value : '', inputed: false, correct: false};


    }

    handleBlur(event) {
        if (typeof this.props.form !== "undefined") {
            var value=this.props.form.getFieldsValue()
            var res = this.props.vadlidate(this, value[this.props.fieldtname])
        }else{
            var res = this.props.vadlidate(this, event.target.value)
        }
        this.error = res[1]
        if (res[0] === true) {
            this.setState({inputed: true, correct: true,value:event.target.value});
            return
        }
        this.setState({inputed: true, correct: false,value:event.target.value});
    }

    handleFocus(event) {
        // alert("wzq");
        this.setState({inputed: false});
    }

    handleChange(event) {
        this.setState({value: event.target.value, correct: false});
    }

    render() {
        // const {getFieldDecorator} = this.props.form!==undefined?this.props.form:undefined;
        // alert(typeof this.props.form !=="undefined")
        //console.log(typeof this.props.form.getFieldDecorator)
        if (this.state.inputed === false) {
            return (
                <FormItem
                    label={this.props.title}
                    hasFeedback>
                    {(typeof this.props.form !== "undefined") ? (this.props.form.getFieldDecorator(this.props.fieldtname)(
                        <Input placeholder={this.props.hint}
                               onBlur={this.handleBlur} onFocus={this.handleFocus} onChange={this.handleChange}/>
                    )) : (<Input placeholder={this.props.hint} id="validating" value={this.state.value}
                                 onBlur={this.handleBlur} onFocus={this.handleFocus} onChange={this.handleChange}/>)}
                </FormItem>
            )

        }
        if (this.state.correct === true && this.state.inputed === true) {
            return (
                <FormItem
                    label={this.props.title}
                    hasFeedback
                    validateStatus="success"
                >
                    {typeof this.props.form !== "undefined" ? this.props.form.getFieldDecorator(this.props.fieldtname)(
                        <Input placeholder={this.props.hint}
                               onBlur={this.handleBlur} onFocus={this.handleFocus} onChange={this.handleChange}/>
                    ) : <Input placeholder={this.props.hint} value={this.state.value}
                               onBlur={this.handleBlur} onFocus={this.handleFocus} onChange={this.handleChange}/>}
                </FormItem>

            )
        }
        if (this.state.correct === false && this.state.inputed === true) {

            return (
                <FormItem
                    label={this.props.title}
                    hasFeedback
                    validateStatus="error"
                    help={this.error}
                >
                    {typeof this.props.form !== "undefined" ? this.props.form.getFieldDecorator(this.props.fieldtname)(
                        <Input placeholder={this.props.hint}
                               onBlur={this.handleBlur} onFocus={this.handleFocus} onChange={this.handleChange}/>
                    ) : <Input placeholder={this.props.hint} id="validating" value={this.state.value}
                               onBlur={this.handleBlur} onFocus={this.handleFocus} onChange={this.handleChange}/>}
                </FormItem>
            )
        }

    }

}

export default () => {
}
