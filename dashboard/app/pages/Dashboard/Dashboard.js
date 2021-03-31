import React from 'react';
import _ from 'lodash';
import {
    Card,
    CardHeader,
    Container,
    ButtonToolbar,
    ButtonGroup,
    UncontrolledButtonDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    Media,
    CardBody,
    CardFooter,
    Button
} from 'reactstrap';
import Grid, { applyColumn } from './../../components/FloatGrid';

import {
    CPUUsageMontor
} from "./components/CPUUsageMontor";

const LAYOUT = {
    'cpu-load': { h: 9, minH: 7 },
    'cpu-usage': { h: 9, minH: 7 },
}

export class Dashboard extends React.Component {
    state = {
        layouts: _.clone(LAYOUT)
    }

    _resetLayout = () => {
        this.setState({
            layouts: _.clone(LAYOUT)
        })
    }

    render() {
        const { layouts } = this.state;

        return (
            <React.Fragment>
                <Container fluid={ false }>
                    <div className="mt-3 mb-5">
                        <div className="d-flex mt-0 mb-5">
                            <span className="display-4 mr-3 mb-0 align-self-start">
                                CPU Monitor
                            </span>
                        </div>
                        <ButtonToolbar className="ml-auto">
                            <ButtonGroup className="align-self-start mr-2">
                                <UncontrolledButtonDropdown className="ml-auto flex-column">
                                    <DropdownToggle color="link" className="text-left pl-0 text-decoration-none mb-2">
                                        <i className="fa fa-calendar-o text-body mr-2"></i>
                                        Last Month<i className="fa fa-angle-down text-body ml-2" />
                                    </DropdownToggle>
                                    <DropdownMenu>
                                        <DropdownItem header>
                                            Select Period:
                                        </DropdownItem>
                                        <DropdownItem active>
                                            Last Month
                                        </DropdownItem>
                                        <DropdownItem>
                                            Last 3 Months
                                        </DropdownItem>
                                        <DropdownItem>
                                            Last 6 Months
                                        </DropdownItem>
                                        <DropdownItem>
                                            Last Year
                                        </DropdownItem>
                                        <DropdownItem divider />
                                        <DropdownItem>
                                            Custom...
                                        </DropdownItem>
                                    </DropdownMenu>
                                </UncontrolledButtonDropdown>
                            </ButtonGroup>
                            <ButtonGroup className="align-self-start mr-2">
                                <UncontrolledButtonDropdown className="ml-auto flex-column">
                                    <DropdownToggle color="link" className="text-left pl-0 text-decoration-none mb-2">
                                        <i className="fa fa-calendar-o text-body mr-2"></i>
                                        Previous Period<i className="fa fa-angle-down text-body ml-2" />
                                    </DropdownToggle>
                                    <DropdownMenu>
                                        <DropdownItem header>
                                            Select Period:
                                        </DropdownItem>
                                        <DropdownItem active>
                                            Previous Period
                                        </DropdownItem>
                                        <DropdownItem>
                                            Last 3 Months
                                        </DropdownItem>
                                        <DropdownItem>
                                            Last 6 Months
                                        </DropdownItem>
                                        <DropdownItem>
                                            Last Year
                                        </DropdownItem>
                                        <DropdownItem divider />
                                        <DropdownItem>
                                            Custom...
                                        </DropdownItem>
                                    </DropdownMenu>
                                </UncontrolledButtonDropdown>
                            </ButtonGroup>
                            <ButtonGroup className="align-self-start">
                                <Button color="primary" className="mb-2 mr-2 px-3">
                                    Apply
                                </Button>
                            </ButtonGroup>
                            <ButtonGroup>
                                <Button
                                    color="link"
                                    className="mb-2 text-decoration-none align-self-start"
                                    onClick={this._resetLayout}
                                >
                                    Reset
                                </Button>
                            </ButtonGroup>
                        </ButtonToolbar>
                    </div>
                </Container>

                <Grid>
                    <Grid.Row
                        onLayoutChange={ layouts => this.setState({ layouts }) }
                        columnSizes={ this.state.layouts }
                        rowHeight={ 55 }
                    >
                        <Grid.Col { ...(applyColumn('cpu-usage', layouts)) }>
                            <Card>
                                <CardHeader className="bb-0 pt-3 pb-4 bg-none" tag="h6">
                                    <i className="fa fa-ellipsis-v mr-2 text-body"></i> Analytics Audience Metrics
                                </CardHeader>
                                <CardBody className="d-flex flex-column">
                                    <Grid.Ready>
                                        <CPUUsageMontor height="100%" className="flex-fill" />
                                    </Grid.Ready>
                                </CardBody>
                                <CardFooter>
                                    <Media className="small">
                                        <Media left>
                                            <i className="fa fa-fw fa-info-circle mr-2"></i>
                                        </Media>
                                        <Media body>
                                            How do your users (visitors), sessions (visits) and pageviews 
                                            metrics for <abbr title="attribute" className="text-dark">www.webkom.com</abbr> compare to your targets over the last 30 days?
                                        </Media>
                                    </Media>
                                </CardFooter>
                            </Card>
                        </Grid.Col>

                        <Grid.Col { ...(applyColumn('cpu-load', layouts)) }>
                            <Card>
                                <CardHeader className="bb-0 pt-3 pb-4 bg-none" tag="h6">
                                    <i className="fa fa-ellipsis-v mr-2 text-body"></i> Analytics Audience Metrics
                                </CardHeader>
                                <CardBody className="d-flex flex-column">
                                    <Grid.Ready>
                                        <CPUUsageMontor height="100%" className="flex-fill" />
                                    </Grid.Ready>
                                </CardBody>
                                <CardFooter>
                                    <Media className="small">
                                        <Media left>
                                            <i className="fa fa-fw fa-info-circle mr-2"></i>
                                        </Media>
                                        <Media body>
                                            How do your users (visitors), sessions (visits) and pageviews 
                                            metrics for <abbr title="attribute" className="text-dark">www.webkom.com</abbr> compare to your targets over the last 30 days?
                                        </Media>
                                    </Media>
                                </CardFooter>
                            </Card>
                        </Grid.Col>
                    </Grid.Row>
                </Grid>
            </React.Fragment>
        );
    }
}
