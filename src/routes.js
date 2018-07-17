import React from 'react';
import {Route, IndexRoute, Redirect} from 'react-router';
import App from './App';
import Dashboard from './views/dashboard';
import Mail from './views/mail';
import Widgets from './views/widgets';

// ui elements
import Buttons from './views/ui/buttons';
import Typography from './views/ui/typography';
import Cards from './views/ui/cards';
import Modals from './views/ui/modals';
import Notification from './views/ui/notification';
import Extras from './views/ui/extras';

// forms
import FormGeneral from './views/forms/general';
import FormAdvanced from './views/forms/advanced';

// charts
import Charts from './views/charts';

// tables
import Tables from './views/tables';

// pages
import SignIn from './views/pages/signin';
import Register from './views/pages/register';
import Page404 from './views/pages/404';
import PageInvoice from './views/pages/invoice';


import Certification from './views/student/check/index.js'
import StuScore from './views/student/score/index.js'
import UserInfo from './views/user/info/index.js'
import ChangePwd from './views/user/changepwd/index.js'
import ChangeEmail from './views/user/changeemail/index.js'
import StuFinalScore from './views/student/finalscore/index.js'
import ForgetPass from './views/pages/forget/index.js';
import Reservation from "./views/student/reservation/index.js";
import TeacherCheck from "./views/teacher/changescore";
import TeacherAudit from './views/teacher/audit/index.js'
import AdminCheck from "./views/admin/check";
import AdminStuent from './views/admin/student/index'
//import Task from  './views/admin/upload';
import AdminUser from './views/admin/user'
import AdminStuInfo from './views/admin/school'
import AdminLocation from './views/admin/site'
import AdminCollege from './views/admin/college'
import AdminClass from './views/admin/class'
import AdminDevice from './views/admin/device'
import $ from "jquery";
import {weblocation} from "./config";

var currentRole=5;
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
        if (json['code']==800)
            currentRole = json['data']['type'];
        else
            currentRole=0;
    }
});
export default (
    <Route>
        <Route component={App} path='/'>
            <IndexRoute component={Dashboard}/>
            <Route path='widgets' component={Widgets}/>
            <Route path='ui/buttons' component={Buttons}/>
            <Route path='ui/typography' component={Typography}/>
            <Route path='ui/cards' component={Cards}/>
            <Route path='ui/modals' component={Modals}/>
            <Route path='ui/notification' component={Notification}/>
            <Route path='ui/extras' component={Extras}/>
            <Route path='forms/general' component={FormGeneral}/>
            <Route path='forms/advanced' component={FormAdvanced}/>
            <Route path='charts' component={Charts}/>
            <Route path='tables' component={Tables}/>

            <Route path='user/info' component={UserInfo}/>
            <Route path='user/changepwd' component={ChangePwd}/>
            <Route path='user/changeemail' component={ChangeEmail}/>
            <Route path='admin/check' component={AdminCheck}/>
            <Route path='admin/site' component={AdminLocation}/>
            <Route path='admin/college' component={AdminCollege}/>
            <Route path='admin/class' component={AdminClass}/>
            <Route path='admin/device' component={AdminDevice}/>
            <Route path='admin/student' component={AdminStuent}/>
            <Route path='admin/user' component={AdminUser}/>
            <Route path='admin/stuinfo' component={AdminStuInfo}/>
            <Route path='student/certitication' component={Certification}/>
            <Route path='student/score' component={StuScore}/>
            <Route path='student/finalscore' component={StuFinalScore}/>
            <Route path='student/reservation' component={Reservation}/>
            <Route path='teacher/audit' component={TeacherAudit}/>
            <Route path='teacher/changescore' component={TeacherCheck}/>
            {/*/!*管理员*!/*/}
            {/*{currentRole===1?(<Route path='admin/site' component={Site}/>):''}*/}
            {/*{currentRole===1?(<Route path='admin/check' component={AdminCheck}/>):''}*/}
            {/*{currentRole===1?(<Route path='admin/upload' component={Task}/>):''}*/}
            {/*/!*学生*!/*/}
            {/*{currentRole===5?(<Route path='student/certitication' component={Certification}/>):''}*/}
            {/*{currentRole===5?(<Route path='student/score' component={StuScore}/>):''}*/}
            {/*{currentRole===5?(<Route path='student/finalscore' component={StuFinalScore}/>):''}*/}
            {/*{currentRole===5?(<Route path='student/reservation' component={Reservation}/>):''}*/}
            {/*/!*教师*!/*/}
            {/*{currentRole===6?(<Route path='teacher/audit' component={TeacherAudit}/>):''}*/}
            {/*{currentRole===6?(<Route path='teacher/changescore' component={TeacherCheck}/>):''}*/}
        </Route>
        <Route component={ForgetPass} path='pages/forget'/>
        <Route component={Mail} path='mail'/>
        <Route component={SignIn} path='pages/signin'/>
        <Route exact component={Register} path='pages/register'/>
        <Route component={Page404} path='pages/404'/>
        <Route component={PageInvoice} path='pages/invoice'/>
        {/* default */}
        <Route component={Page404} path='404'/>
        <Redirect from="*" to="404"/>
    </Route>
);
