import React from 'react';
import {
    LineChart, Line,
    BarChart, Bar,
    Tooltip
} from 'recharts';

let tinyChartData = [
    {day: '01', growth: 44, traffic: 1440},
    {day: '02', growth: 22, traffic: 3320},
    {day: '03', growth: 58, traffic: 7743},
    {day: '04', growth: 82, traffic: 2280},
    {day: '05', growth: 54, traffic: 4480}
];



const IncomeGrowthTooltip = (props) => {
     const { payload, active } = props;
    if(active) {
        return (
            <div style={{'padding': '3px 7px', background: 'rgba(60,70,75,.9)', 'fontSize': 9, color: '#fff', borderRadius: 2}}>
                {payload[0].value}%
            </div>
        );
    }
    return null;
};

export default () => (
    <div className="view-header d-flex align-items-center">
        <header className="text-white">
            <h1 className="h5 title text-uppercase">欢迎登录学生信息管理系统</h1>

        </header>
        {/*<div className="ml-auto d-flex mt-2">*/}
            {/*<div className="hidden-sm-down">*/}
                {/*<LineChart width={100} height={35} data={tinyChartData}>*/}
                    {/*<Line type='monotone' dataKey='growth' stroke='#FFEA00' strokeWidth={1} dot={{strokeWidth: 0, r: 2}}/>*/}
                    {/*<Tooltip content={<IncomeGrowthTooltip/>}/>*/}
                {/*</LineChart>*/}
                {/*<p className="small text-uppercase text-white">Income Growth</p>*/}
            {/*</div>*/}
            {/*<div className="ml-5">*/}
                {/*<BarChart width={100} height={35} data={tinyChartData}>*/}
                    {/*<Bar type='monotone' dataKey='traffic' fill='#FFEA00'/>*/}
                {/*</BarChart>*/}
                {/*<p className="small text-uppercase text-white text-nowrap">Weekly Traffic</p>*/}
            {/*</div>*/}
        {/*</div>*/}
    </div>
);
