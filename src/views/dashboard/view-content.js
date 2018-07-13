import React from 'react';
import {
    AreaChart, Area,
    PieChart, Pie,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell, Sector,
    ResponsiveContainer
} from 'recharts';
import {
    CardGroup, Card, CardBlock, CardTitle, Row, Button
} from 'reactstrap';

// icons
import IconDollar from 'react-icons/lib/fa/dollar';
import IconTrendUp from 'react-icons/lib/md/trending-up';
import IconLevelUp from 'react-icons/lib/fa/level-up';
import IconLevelDown from 'react-icons/lib/fa/level-down';
import IconAndroid from 'react-icons/lib/fa/android';
import IconCardTravel from 'react-icons/lib/md/card-travel';
import IconDvr from 'react-icons/lib/md/dvr';
import IconBalance from 'react-icons/lib/md/account-balance';
import IconDot from 'react-icons/lib/md/fiber-manual-record';



// Sales Chart
// -----------
const salesData = [
      {name: 'Jun', 申请学生: 4000, 测试学生: 2400},
      {name: 'Jul', 申请学生: 3000, 测试学生: 1398},
      {name: 'Aug', 申请学生: 3000, 测试学生: 2200},
      {name: 'Sep', 申请学生: 3780, 测试学生: 3008},
      {name: 'Oct', 申请学生: 3890, 测试学生: 2800},
      {name: 'Nov', 申请学生: 3390, 测试学生: 3200},
      {name: 'Dec', 申请学生: 3490, 测试学生: 3300},
];

const SalesDataChart = () => (
    <ResponsiveContainer>
        <AreaChart data={salesData} margin={{top: 10, right: 10, left: -15, bottom: 0}}>
            <XAxis dataKey="name" axisLine={false} fontSize={10} tickLine={false} padding={{left: 0, right: 5}}/>
            <YAxis fontSize={10} axisLine={false} tickLine={false}/>
            <CartesianGrid stroke="#eee" vertical={false}/>
            <Tooltip wrapperStyle={{borderColor: '#eee'}}/>
            <Legend />
            <Area type='monotone' dataKey='申请学生' stackId="1" strokeWidth={2} stroke="#448AFF" fill='#448AFF' fillOpacity=".8" />
            <Area type='monotone' dataKey='测试学生' stackId="1" strokeWidth={2} stroke="#69F0AE" fill='#69F0AE'  fillOpacity=".8"/>
        </AreaChart>
    </ResponsiveContainer>
);


// Blocks Chart
// ------------
const blocksData = [
    {'uv': 2034, 'sales': 623, 'br': 56, 'ns': 2343},
    {'uv': 2734, 'sales': 1223, 'br': 43, 'ns': 3200},
    {'uv': 2522, 'sales': 723, 'br': 64, 'ns': 3063},
    {'uv': 2944, 'sales': 1043, 'br': 44, 'ns': 3666},
    {'uv': 1822, 'sales': 433, 'br': 74, 'ns': 1909}
];

const BlocksChart = ({dataKey, stroke, fill}) => (
    <ResponsiveContainer>
        <AreaChart data={blocksData} margin={{top: 0, bottom: 0, right: 0, left: 0}}>
            <Tooltip
                labelStyle={{display: 'none'}}
                itemStyle={{fontSize: 10, color: '#fff'}}
                wrapperStyle={{padding: '0 4px', background: 'rgba(40,70,80, .94)', border: 'none'}}/>
            <Area type='monotone' dataKey={dataKey} stroke={stroke} fill={fill} strokeWidth={2}  fillOpacity=".8"/>
        </AreaChart>
    </ResponsiveContainer>
);


// Traffic Source Chart
// --------------------
const trafficSourceData = [
    {name: 'Direct', value: 23}, {name: 'Referral', value: 8},
    {name: 'Organic', value: 44}, {name: 'Social', value: 25}
];
const trafficSourceColors = ['#448AFF', '#00E676', '#7C4DFF', '#40C4FF'];

const renderActiveShape = (props) => {
    const RADIAN = Math.PI / 180;
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent} = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';

    return (
        <g>
            <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>{payload.name}</text>
            <Sector
                cx={cx}
                cy={cy}
                innerRadius={innerRadius}
                outerRadius={outerRadius}
                startAngle={startAngle}
                endAngle={endAngle}
                fill={fill}
            />
            <Sector
                cx={cx}
                cy={cy}
                startAngle={startAngle}
                endAngle={endAngle}
                innerRadius={outerRadius + 6}
                outerRadius={outerRadius + 10}
                fill={fill}
            />
            <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none"/>
            <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none"/>
            <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{`${payload.name}`}</text>
            <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999" fontSize={12}>
                {`(${(percent * 100).toFixed(2)}%)`}
            </text>
        </g>
    );
};

class TrafficSourceChart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {activeIndex: 0}
    }
    onPieEnter = (data, index) => {
        this.setState({
            activeIndex: index,
        });
    }

    render() {
        return (
            <ResponsiveContainer>
                <PieChart>
                    <Pie onMouseEnter={this.onPieEnter}
                        data={trafficSourceData}
                        activeIndex={this.state.activeIndex} activeShape={renderActiveShape}
                        outerRadius={90}
                        dataKey="value"
                        innerRadius={70} paddingAngle={4}>
                        { trafficSourceData.map((entry, index) => <Cell fill={trafficSourceColors[index]} key={index}/>) }
                    </Pie>
                    <Legend/>
                </PieChart>
            </ResponsiveContainer>
        );
    }
}


const TransactionTableData = [
    {date: '22 Mar',  name: 'John Doe','earnings': '$304', status: 'pending'},
    {date: '12 Feb', name: 'Maria Smith','earnings': '$834', status: 'done'},
    {date: '28 Jan', name: 'Sofia Andre',  'earnings': '$943', status: 'done'},
    {date: '03 May', name: 'Jean Wilkinson', 'earnings': '$1234', status: 'pending'},
    {date: '10 Mar', name: 'Alisha Seth', 'earnings': '$534', status: 'done'}
];

const TransactionTable = ({data}) => (
    <table className="table">

        <tbody>
            {data.map((item, i) => <tr key={i}>
                <td className="d-flex flex-column">
                    <strong>{item.name}</strong>
                    <small>{item.date}</small>
                </td>
                <td className="align-middle">{item.earnings}</td>
                <td className="align-middle text-nowrap">
                    <IconDot size="12" color={item.status === 'done' ? '#4CAF50' : '#F44336'}/>&nbsp;{item.status}
                </td>
            </tr>)}
        </tbody>
    </table>
);


// Sales Card
// ----------
const SalesCard = () => (
    <CardGroup className="sales-card mb-4">
        <Card style={{'flex': '3 0 0'}}>
            <CardBlock>
                <div style={{width: '100%', height: '280px'}}>
                    <SalesDataChart/>
                </div>
            </CardBlock>
        </Card>
        <Card>
            <CardBlock>
                <h6 className="text-uppercase title font-weight-bold small">免测人数</h6>
                <h4 className="font-weight-normal mb-0">2350</h4>
            </CardBlock>
            <CardBlock>
                <h6 className="text-uppercase title font-weight-bold small text-nowrap">测试人数</h6>
                <h4 className="font-weight-normal mb-0">8320</h4>
            </CardBlock>
            <CardBlock>
                <h6 className="text-uppercase title font-weight-bold small">未测人数</h6>
                <h4 className="font-weight-normal mb-0">2130</h4>
            </CardBlock>
        </Card>
    </CardGroup>
);


export default () => (
    <div className="view-content view-dashboard">
        {/*<SalesCard/>*/}

        {/*<Row>*/}
            {/*/!* blocks *!/*/}
            {/*<div className="col-sm-6 col-md-3">*/}
                {/*<Card className="mb-4">*/}
                    {/*<CardBlock>*/}
                        {/*<CardTitle className="text-uppercase small font-weight-bold">New Visitors</CardTitle>*/}
                        {/*<div className="d-flex align-items-center">*/}
                            {/*<h3 className="mr-2 font-weight-normal">2,544</h3>*/}
                            {/*<div className="small">*/}
                                {/*<IconLevelDown size="14"/><span className="badge badge-danger">-28%</span>*/}
                            {/*</div>*/}
                        {/*</div>*/}
                    {/*</CardBlock>*/}
                    {/*<div style={{width: '100%', height: '60px'}}>*/}
                        {/*<BlocksChart dataKey="uv" stroke="#69F0AE" fill="#69F0AE"/>*/}
                    {/*</div>*/}
                {/*</Card>*/}

                {/*<Card className="mb-4">*/}
                    {/*<CardBlock>*/}
                        {/*<CardTitle className="text-uppercase small font-weight-bold">Bounce Rate</CardTitle>*/}
                        {/*<div className="d-flex align-items-center">*/}
                            {/*<h3 className="mr-2 font-weight-normal">65%</h3>*/}
                            {/*<div className="small">*/}
                                {/*<IconLevelDown size="14"/><span className="badge badge-danger">-12%</span>*/}
                            {/*</div>*/}
                        {/*</div>*/}
                    {/*</CardBlock>*/}
                    {/*<div style={{width: '100%', height: '60px'}}>*/}
                        {/*<BlocksChart dataKey="br" stroke="#7C4DFF" fill="#7C4DFF"/>*/}
                    {/*</div>*/}
                {/*</Card>*/}
            {/*</div>*/}
            {/*<div className="col-sm-6 col-md-3">*/}
                {/*<Card className="mb-4">*/}
                    {/*<CardBlock>*/}
                        {/*<CardTitle className="text-uppercase small font-weight-bold">Purchases</CardTitle>*/}
                        {/*<div className="d-flex align-items-center">*/}
                            {/*<h3 className="mr-2 font-weight-normal">789</h3>*/}
                            {/*<div className="small">*/}
                                {/*<IconLevelUp size="14"/><span className="badge badge-success">+8%</span>*/}
                            {/*</div>*/}
                        {/*</div>*/}
                    {/*</CardBlock>*/}
                    {/*<div style={{width: '100%', height: '60px'}}>*/}
                        {/*<BlocksChart dataKey="sales" stroke="#448AFF" fill="#448AFF"/>*/}
                    {/*</div>*/}
                {/*</Card>*/}

                {/*<Card className="mb-4">*/}
                    {/*<CardBlock>*/}
                        {/*<CardTitle className="text-uppercase small font-weight-bold">New Sessions</CardTitle>*/}
                        {/*<div className="d-flex align-items-center">*/}
                            {/*<h3 className="mr-2 font-weight-normal">2994</h3>*/}
                            {/*<div className="small">*/}
                                {/*<IconLevelUp size="14"/><span className="badge badge-success">+19%</span>*/}
                            {/*</div>*/}
                        {/*</div>*/}
                    {/*</CardBlock>*/}
                    {/*<div style={{width: '100%', height: '60px'}}>*/}
                        {/*<BlocksChart dataKey="ns" stroke="#40C4FF" fill="#40C4FF"/>*/}
                    {/*</div>*/}
                {/*</Card>*/}
            {/*</div>*/}
            {/*/!* traffic source *!/*/}
            {/*<div className="mb-4 col-sm-12 col-md-6">*/}
                {/*<Card>*/}
                    {/*<CardBlock>*/}
                        {/*<CardTitle className="text-uppercase h6">Traffic Sources</CardTitle>*/}
                        {/*<div style={{width: '100%', height: '276px'}}><TrafficSourceChart/></div>*/}
                    {/*</CardBlock>*/}
                {/*</Card>*/}
            {/*</div>*/}
        {/*</Row>*/}

        {/*<Row>*/}
            {/*/!* Recent Activities *!/*/}
            {/*<div className="col-md-5 mb-4">*/}
                {/*<Card>*/}
                    {/*<CardBlock>*/}
                        {/*<CardTitle className="h6 text-uppercase">Recent Activities</CardTitle>*/}
                        {/*<div className="small mb-4 card-subtitle">At a glance</div>*/}
                        {/*<div className="d-flex mb-4 align-items-center">*/}
                            {/*<IconAndroid size="52"  style={{'border': '1px solid #eee'}} className="mr-3 text-success rounded-circle p-3"/>*/}
                            {/*<div>*/}
                                {/*<h6 className="font-weight-semi-bold">Jenna enclosed a doc.</h6>*/}
                                {/*<div className="small">3 min ago</div>*/}
                            {/*</div>*/}
                        {/*</div>*/}

                        {/*<div className="d-flex mb-4 align-items-center">*/}
                            {/*<IconCardTravel size="52" style={{'border': '1px solid #eee'}} className=" text-info mr-3 rounded-circle p-3"/>*/}
                            {/*<div>*/}
                                {/*<h6 className="font-weight-semi-bold">Richard is now out of town.</h6>*/}
                                {/*<div className="small">1 hour ago</div>*/}
                            {/*</div>*/}
                        {/*</div>*/}

                        {/*<div className="d-flex mb-4 align-items-center">*/}
                            {/*<IconDvr size="52" style={{'border': '1px solid #eee'}} className=" text-danger mr-3 rounded-circle p-3"/>*/}
                            {/*<div>*/}
                                {/*<h6 className="font-weight-semi-bold">Your domain will expire in 4 days</h6>*/}
                                {/*<div className="small">5 hours ago</div>*/}
                            {/*</div>*/}
                        {/*</div>*/}

                        {/*<div className="d-flex mb-4 align-items-center">*/}
                            {/*<IconBalance size="52" style={{'border': '1px solid #eee'}} className=" text-primary mr-3 rounded-circle p-3"/>*/}
                            {/*<div>*/}
                                {/*<h6 className="font-weight-semi-bold">Henry just purchased an item</h6>*/}
                                {/*<div className="small">4 days ago</div>*/}
                            {/*</div>*/}
                        {/*</div>*/}

                        {/*<div className="text-right"><button className="btn btn-sm btn-success">View All</button></div>*/}
                    {/*</CardBlock>*/}
                {/*</Card>*/}
            {/*</div>*/}

            {/*/!* Transactions *!/*/}
            {/*<div className="col-md-7 mb-4">*/}
                {/*<Card>*/}
                    {/*<CardBlock className="table-responsive">*/}
                        {/*<CardTitle className="text-uppercase h6">Latest Transactions</CardTitle>*/}
                        {/*<div className="small mb-4 card-subtitle"><Button color="primary" size="sm">View all</Button></div>*/}
                        {/*<TransactionTable data={TransactionTableData}/>*/}
                    {/*</CardBlock>*/}
                {/*</Card>*/}
            {/*</div>*/}

        {/*</Row>*/}

    </div>
)
