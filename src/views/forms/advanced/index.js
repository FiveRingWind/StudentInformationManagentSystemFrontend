import React from 'react';
import {
    Card, CardBlock, Row
} from 'reactstrap';

import {Editor} from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import SelectStates from './select/simpleSelect';
import AsyncSelect from './select/asyncSelect';


const ViewHeader = () => (
    <div className="view-header">
        <header className="title text-white">
            <h1 className="h4 text-uppercase">Advanced Forms</h1>
            <p className="mb-0">Advanced form like custom select, text editor etc.</p>
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
                    <h6 className="mb-4 text-uppercase">Text Editor</h6>
                    <Editor
                        wrapperStyle={{border: '1px solid #efefef', padding: '1rem'}}
                        editorStyle={{'minHeight': '20em'}}
                        toolbarStyle={{'fontSize': '12px'}}
                    />
                </CardBlock>
            </Card>

            <Card className="mb-4">
                <CardBlock>
                    <h6 className="mb-4 text-uppercase">React Select</h6>
                    <Row>
                        <SelectStates/>
                        <AsyncSelect/>
                    </Row>
                </CardBlock>
            </Card>

        </ViewContent>
    </div>
);
