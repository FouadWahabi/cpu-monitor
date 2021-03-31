// ReCharts styling configuration
import colors from './../../colors';

export default {
    grid: {
        stroke: colors['gray-400'],
        strokeWidth: 1,
        strokeDasharray: '1px'
    },
    polarGrid: {
        stroke: colors['gray-400'],
    },
    axis: {
        stroke: colors['gray-500'],
        strokeWidth: 1,
        style: {
            fontSize: '12px'
        },
        tick: {
            // Axis Labels color:
            fill: colors['gray-900']
        }
    },
    polarRadiusAxis: {
        stroke: colors['gray-400'],
        tick: {
            fill: colors['gray-900']
        }
    },
    polarAngleAxis: {
        tick: {
            fill: colors['gray-900']
        },
        style: {
            fontSize: '12px'
        }
    },
    label: {
        fontSize: 11,
        fill: colors['gray-900']
    },
    legend: {
        wrapperStyle: {
            color: colors['gray-900']
        }
    },
    pieLabel: {
        fontSize: 12,
        fill: colors[100]
    },
    tooltip: {
        cursor: {
            fill: colors['primary-01']
        },
        contentStyle: {
            background: colors['gray-900'],
            border: `1px solid ${colors['gray-900']}`,
            color: colors['white']
        }
    }
};