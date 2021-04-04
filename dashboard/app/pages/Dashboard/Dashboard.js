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
    ListGroup,
    ListGroupItem,
} from 'reactstrap';

import Alert from './components/Alert';
import MetricsGraph from "./components/MetricsGraph";
import Grid, { applyColumn } from './../../components/FloatGrid';
import { ALERT_TYPES } from './alertTypes';

const LAYOUT = {
    'live-cpu-usage': { h: 4, md: 6 },
    'alerts': { h: 8, md: 6 },
    'live-cpu-load': { h: 4, md: 6 },
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

const HIGH_LOAD_THRESHOLD = process.env.HIGH_LOAD_THRESHOLD || 1;

export class Dashboard extends React.Component {
    state = {
        layouts: _.clone(LAYOUT),
        loading: false,
        selectedPeriod: 1,
        load: [],
        usage : [],
        alerts: [],
    }

    dataLoadInterval = null;
    maxDataSize = 600;
    
    _getStatusColor(value, maxValue) {
        if (value < maxValue / 3) {
            return 'success';
        }
        if (value < 2 * maxValue / 3) {
            return 'warning';
        }
        return 'danger';
    }

    _resetLayout = () => {
        this.setState({
            layouts: _.clone(LAYOUT)
        })
    }

    /**
     * Normalize the data by spliting it into mutiple slots and coomputing the average
     * so that it doesn't exceed the maxDataSize.
     */
    _normalizeData(data) {
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

    /**
     * Extracts the alerts from the metrics.
     */
    _findAlerts(data) {
        let alert = {};
        const alerts = [];
        for (let index = 0 ; index < data.length ; index += 1) {
            if (data[index].load >= HIGH_LOAD_THRESHOLD) {
                if (alert.type !== ALERT_TYPES.HIGH_LOAD) {
                    alert = {
                        start: new Date(data[index].timestamp),
                        type: ALERT_TYPES.HIGH_LOAD,
                    };
                    alerts.push(alert);
                } else {
                    alert.end = new Date(data[index].timestamp);
                }
            } else {
                if (alert.type === ALERT_TYPES.HIGH_LOAD) {
                    alert = {
                        start: new Date(data[index].timestamp),
                        type: ALERT_TYPES.RECOVER,
                    };
                    alerts.push(alert);
                } else if (alert.type === ALERT_TYPES.RECOVER) {
                    alert.end = new Date(data[index].timestamp);
                }
            }
        }
        const filteredAlerts = alerts.filter(alert => {
            if (alert.start && alert.end && (alert.end - alert.start) >= 120000) {
                return true;
            }
            return false;
        });
        while (filteredAlerts.length > 0 && filteredAlerts[0].type === ALERT_TYPES.RECOVER) {
            filteredAlerts.splice(0, 1);
        }
        return filteredAlerts;
    }

    /**
     * Loads the CPU metrics from the backend
     */
    _loadCPUMetrics = () => {
        const endDate = new Date().getTime();
        const startDate = endDate - PERIOD_DIFF[this.state.selectedPeriod];
        fetch(`${process.env.BACKEND_URL}/cpu_monitor?start=${startDate}&end=${endDate}`)
        .then(res => res.json())
        .then(res => {
            // convert and format the data
            const load = res.load.map(d => ({
                timestamp: moment(parseInt(d[0])).format('YYYY/MM/DD HH:mm:ss'),
                load: parseFloat(d[1]).toFixed(4),
            }));
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

            const normalizedLoad = this._normalizeData(load);
            const normalizedUssage = this._normalizeData(usage);

            const alerts = this._findAlerts(normalizedLoad);

            this.setState({
                load: normalizedLoad,
                usage: normalizedUssage,
                alerts,
            });
        })
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.selectedPeriod !== this.state.selectedPeriod) {
            this._loadCPUMetrics();
        }
    }

    componentDidMount() {
        this._loadCPUMetrics();
        this.dataLoadInterval = setInterval(this._loadCPUMetrics, 5000);
    }

    componentWillUnmount() {
        clearInterval(this.dataLoadInterval);
    }

    render() {
        const { layouts } = this.state;
        const cpuUsagePercentage = parseFloat(this.state.usage[this.state.usage.length - 1] ?
            this.state.usage[this.state.usage.length - 1].usage : '').toFixed(2);
        const cpuLoad = parseFloat(this.state.load[this.state.load.length - 1] ?
            this.state.load[this.state.load.length - 1].load : '').toFixed(2);
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
                        <Grid.Col { ...(applyColumn('live-cpu-usage', layouts)) }>
                            <Card>
                                <CardHeader className="bb-0 pt-3 pb-4 bg-none" tag="h6">
                                    <i className="fa fa-ellipsis-v text-body mr-2"></i> Live CPU Usage
                                </CardHeader>
                                <CardBody className="pt-2 d-flex align-items-center justify-content-center">
                                    <h1 className={`pt-4 pb-2 ${this._getStatusColor(cpuUsagePercentage, 100)}`}>
                                        {cpuUsagePercentage}{' %'}
                                    </h1>
                                </CardBody>
                            </Card>
                        </Grid.Col>
                        <Grid.Col { ...(applyColumn('alerts', layouts)) }>
                            <Card>
                                <CardHeader className="bb-0 pt-3 pb-4 bg-none" tag="h6">
                                    <i className="fa fa-ellipsis-v text-body mr-2"></i> Alerts
                                </CardHeader>
                                <CardBody className="pt-2">
                                    <ListGroup style={{ height: '100%', overflow: 'scroll' }}>
                                        {this.state.alerts.length > 0 && this.state.alerts.map((alert, idx) => (
                                            <ListGroupItem key={idx}>
                                                <Alert
                                                    type={alert.type}
                                                    startDate={moment(alert.start).format('YYYY/MM/DD HH:mm:ss')}
                                                    endDate={moment(alert.end).format('YYYY/MM/DD HH:mm:ss')}
                                                />
                                            </ListGroupItem>
                                        ))}
                                        {this.state.alerts.length === 0 && 'There is no alerts.'}
                                    </ListGroup>
                                </CardBody>
                            </Card>
                        </Grid.Col>
                        <Grid.Col { ...(applyColumn('live-cpu-load', layouts)) }>
                            <Card>
                                <CardHeader className="bb-0 pt-3 pb-4 bg-none" tag="h6">
                                    <i className="fa fa-ellipsis-v text-body mr-2"></i> Live CPU Load
                                </CardHeader>
                                <CardBody className="pt-2 d-flex align-items-center justify-content-center">
                                    <h1 className="pt-4 pb-2">
                                        {cpuLoad}
                                    </h1>
                                </CardBody>
                            </Card>
                        </Grid.Col>

                        <Grid.Col { ...(applyColumn('cpu-usage', layouts)) }>
                            <Card>
                                <CardHeader className="bb-0 pt-3 pb-4 bg-none" tag="h6">
                                    <i className="fa fa-ellipsis-v mr-2 text-body"></i> CPU Average load
                                </CardHeader>
                                <CardBody className="d-flex flex-column">
                                    <Grid.Ready>
                                        <MetricsGraph height="100%" className="flex-fill" data={this.state.load} xAxis="timestamp" yAxis="load" />
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
                                        <MetricsGraph height="100%" className="flex-fill" data={this.state.usage} xAxis="timestamp" yAxis="usage" />
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
