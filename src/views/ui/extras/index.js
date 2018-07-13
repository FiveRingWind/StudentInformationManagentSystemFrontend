import React from 'react';
import {
    Card, CardBlock
} from 'reactstrap';
import TooltipExampleMulti from './tooltip';
import PopoverExampleMulti from './popover';
import ProgressExample from './progress';
import BadgeExample from './badge';
import PaginationExample from './pagination';
import ListGroupExample from './listgroup';
import BreadcrumbExample from './breadcrumb';
// Extras: Breadcrumb, Badge, Pagination, Tooltip, Popovers, Progress, ListGroup

const ViewHeader = () => (
    <div className="view-header">
        <header className="title text-white">
            <h1 className="h4 text-uppercase">Extras</h1>
            <p className="mb-0">Some other ui components</p>
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
            <Card>
                <CardBlock>
                    <h6 className="text-uppercase mb-4">Tooltips</h6>
                    <TooltipExampleMulti/>
                    <h6 className="text-uppercase">Popovers</h6>
                    <div className="small mb-4">Click on the button to activate popover</div>
                    <PopoverExampleMulti/>
                    <h6 className="text-uppercase mb-3">Progress Bars</h6>
                    <ProgressExample/>
                    <h6 className="text-uppercase mb-3">Badges</h6>
                    <BadgeExample/>
                    <h6 className="text-uppercase mb-3">Pagination</h6>
                    <PaginationExample/>
                    <h6 className="text-uppercase mb-3">Breadcrumbs</h6>
                    <BreadcrumbExample/>
                    <h6 className="text-uppercase mb-3">List Groups</h6>
                    <ListGroupExample/>
                </CardBlock>
            </Card>
        </ViewContent>
    </div>
);
