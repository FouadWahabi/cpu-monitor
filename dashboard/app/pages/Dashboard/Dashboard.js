import React from 'react';
import _ from 'lodash';
import moment from 'moment';
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
    CardBody,
} from 'reactstrap';
import Grid, { applyColumn } from './../../components/FloatGrid';

import {
    CPUUsageMonitor
} from "./components/CPUUsageMonitor";

const LAYOUT = {
    'cpu-load': { h: 9, minH: 7 },
    'cpu-usage': { h: 9, minH: 7 },
}

const PERIODS = {
    LAST_MINUTE: 0,
    LAST_10_MINUTES: 1,
    LAST_HOUR: 2,
    LAST_DAY: 3,
    CUSTOM: 4,
};

const PERIOD_DIFF = [60000, 60000 * 10, 60000 * 60, 60000 * 60 * 24 ];

const PERIOD_LABELS = ['Last Minute', 'Last 10 Minutes', 'Last Hour', 'Last Day'];

export class Dashboard extends React.Component {
    state = {
        layouts: _.clone(LAYOUT),
        loading: false,
        selectedPeriod: 0,
        load: [],
        usage : []
    }

    dataLoadInterval = null;
    maxDataSize = 600;

    _resetLayout = () => {
        this.setState({
            layouts: _.clone(LAYOUT)
        })
    }

    normalizeData(data) {
        if (data && data.length > this.maxDataSize) {
            const normalizedData = [];
            const itemsPerSlot = Math.floor(data.length / this.maxDataSize);
            for(let slot = 0; slot < data.length; slot+=itemsPerSlot) {
                normalizedData.push(data[slot]);
            }
            return normalizedData;
        }
        return data;
    }

    loadCPUUsage = () => {
        const endDate = new Date().getTime();
        const startDate = endDate - PERIOD_DIFF[this.state.selectedPeriod];
        fetch(`${process.env.BACKEND_URL}/cpu_monitor?start=${startDate}&end=${endDate}`)
        .then(res => res.json())
        .then(res => {
            const load = res.load.map(d => ({
                timestamp: moment(parseInt(d[0])).format('YYYY/MM/DD HH:mm:ss'),
                load: parseFloat(d[1]).toFixed(4),
            }));
            this.setState({
                load: this.normalizeData(load),
            });
            const usage = [];
            for (let i = 1; i < res.idle.length; i += 1) {
                const currentIdleValue = res.idle[i];
                const previousIdleValue = res.idle[i - 1];
                const currentTotalValue = res.total[i];
                const previousTotalValue = res.total[i - 1];
                const usagePercentage =
                    (1 - (parseInt(currentIdleValue[1]) - parseInt(previousIdleValue[1])) /
                    parseInt(currentTotalValue[1] - previousTotalValue[1])) * 100;
                usage.push({
                    timestamp: moment(parseInt(currentIdleValue[0])).format(
                    "YYYY/MM/DD HH:mm:ss"
                    ),
                    usage: usagePercentage.toFixed(4),
                });
            }
            this.setState({
                usage: this.normalizeData(usage),
            });
        })
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.selectedPeriod !== this.state.selectedPeriod) {
            this.loadCPUUsage();
        }
    }

    componentDidMount() {
        this.loadCPUUsage();
        this.dataLoadInterval = setInterval(this.loadCPUUsage, 10000);
    }

    componentWillUnmount() {
        clearInterval(this.dataLoadInterval);
    }

    render() {
        const { layouts } = this.state;

        return (
            <React.Fragment>
                <Container fluid={ false }>
                    <div className="mt-3 mb-5 d-flex align-items-center">
                        <span className="display-4 mr-3 mb-0 align-self-start">
                            CPU Monitor
                        </span>
                        <ButtonToolbar className="ml-auto">
                            <ButtonGroup className="align-self-start mr-2">
                                <UncontrolledButtonDropdown className="ml-auto flex-column">
                                    <DropdownToggle color="link" className="text-left pl-0 text-decoration-none mb-2">
                                        <i className="fa fa-calendar-o text-body mr-2"></i>
                                        {PERIOD_LABELS[this.state.selectedPeriod]}<i className="fa fa-angle-down text-body ml-2" />
                                    </DropdownToggle>
                                    <DropdownMenu>
                                        <DropdownItem header>
                                            Select Period:
                                        </DropdownItem>
                                        <DropdownItem
                                            active={this.state.selectedPeriod === PERIODS.LAST_MINUTE}
                                            onClick={() => this.setState({
                                                selectedPeriod: PERIODS.LAST_MINUTE,
                                            })}
                                        >
                                            Last Minute
                                        </DropdownItem>
                                        <DropdownItem
                                            active={this.state.selectedPeriod === PERIODS.LAST_10_MINUTES}
                                            onClick={() => this.setState({
                                                selectedPeriod: PERIODS.LAST_10_MINUTES,
                                            })}
                                        >
                                            Last 10 Minutes
                                        </DropdownItem>
                                        <DropdownItem
                                            active={this.state.selectedPeriod === PERIODS.LAST_HOUR}
                                            onClick={() => this.setState({
                                                selectedPeriod: PERIODS.LAST_HOUR,
                                            })}
                                        >
                                            Last Hour
                                        </DropdownItem>
                                        <DropdownItem
                                            active={this.state.selectedPeriod === PERIODS.LAST_DAY}
                                            onClick={() => this.setState({
                                                selectedPeriod: PERIODS.LAST_DAY,
                                            })}
                                        >
                                            Last Day
                                        </DropdownItem>
                                        <DropdownItem divider />
                                        <DropdownItem
                                            style={{
                                                display: 'none',
                                            }}
                                            active={this.state.selectedPeriod === PERIODS.CUSTOM}
                                            onClick={() => this.setState({
                                                selectedPeriod: PERIODS.CUSTOM,
                                            })}
                                        >
                                            Custom...
                                        </DropdownItem>
                                    </DropdownMenu>
                                </UncontrolledButtonDropdown>
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
                                    <i className="fa fa-ellipsis-v mr-2 text-body"></i> CPU Average load
                                </CardHeader>
                                <CardBody className="d-flex flex-column">
                                    <Grid.Ready>
                                        <CPUUsageMonitor height="100%" className="flex-fill" data={this.state.load} xAxis="timestamp" yAxis="load" />
                                    </Grid.Ready>
                                </CardBody>
                            </Card>
                        </Grid.Col>

                        <Grid.Col { ...(applyColumn('cpu-load', layouts)) }>
                            <Card>
                                <CardHeader className="bb-0 pt-3 pb-4 bg-none" tag="h6">
                                    <i className="fa fa-ellipsis-v mr-2 text-body"></i> CPU Usage Percentage
                                </CardHeader>
                                <CardBody className="d-flex flex-column">
                                    <Grid.Ready>
                                        <CPUUsageMonitor height="100%" className="flex-fill" data={this.state.usage} xAxis="timestamp" yAxis="usage" />
                                    </Grid.Ready>
                                </CardBody>
                            </Card>
                        </Grid.Col>
                    </Grid.Row>
                </Grid>
            </React.Fragment>
        );
    }
}
