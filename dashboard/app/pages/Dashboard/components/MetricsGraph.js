import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import {  
    ResponsiveContainer,
    ComposedChart, 
    CartesianGrid, 
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    Area
} from './../../../components/recharts';
import colors from './../../../colors';

const MetricsGraph = ({ height, className, data, xAxis, yAxis }) => (
    <ResponsiveContainer
        width='100%'
        minHeight='250px'
        className={ className }
        {...(!_.isUndefined(height) ? {
            height
        } : {
            aspect: 2 / 1
        })}
    >
        <ComposedChart data={data}
            margin={{top: 20, right: 20, bottom: 20, left: 20}}>
          <CartesianGrid stroke={ colors['gray-200'] } strokeDasharray='none' vertical={ false }/>
          <XAxis dataKey={xAxis}/>
          <YAxis type="number" dataKey={v => {
              return parseFloat(v[yAxis]);
          }} />
          <Tooltip />
          <Legend />
          <Area dataKey={yAxis} fill={ colors['primary-04'] } stroke={ colors['primary'] } activeDot={{r: 5}} />
       </ComposedChart>
    </ResponsiveContainer>
);

MetricsGraph.propTypes = {
    height: PropTypes.string,
    className: PropTypes.string,
    data: PropTypes.array,
    xAxis: PropTypes.string,
    yAxis: PropTypes.string,
}

export default MetricsGraph;