import React from 'react';
import {
    Card, CardBlock
} from 'reactstrap';
import TinyCharts from './tinycharts';
import AreaChartExample from './areachart';
import RadarChartExample from './radarchart';
import RadialBarChartExample from './radialbarchart';
import PieChartExample from './piechart';

const ViewHeader = () => (
    <div className="view-header">
        <header className="text-white">
            <h1 className="h5 title text-uppercase">Charts</h1>
            <p className="mb-0 subtitle">React recharts example with both tiny and full width charts</p>
        </header>
    </div>
);

const ViewContent = ({children}) => (
    <div className="view-content view-components">
        {children}
    </div>
);




export default () => (
    <div className="view">
        <ViewHeader/>
        <ViewContent>
            <Card className="mb-4">
                <CardBlock>
                    <h6 className="text-uppercase mb-5">Tiny Charts</h6>
                    <TinyCharts/>
                </CardBlock>
            </Card>
            <div className="row">
                <div className="col-12 col-md-6 mb-4">
                    <AreaChartExample/>
                </div>
                <div className="col-12 col-md-6 mb-4">
                    <RadarChartExample/>
                </div>
                <div className="col-12 col-md-6 mb-4">
                    <RadialBarChartExample/>
                </div>
                <div className="col-12 col-md-6 mb-4">
                    <PieChartExample/>
                </div>
            </div>


        </ViewContent>
    </div>
)
