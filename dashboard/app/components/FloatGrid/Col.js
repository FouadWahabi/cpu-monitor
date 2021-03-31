import React from 'react';
import _ from 'lodash';
import classNames from 'classnames';

import { Col as BootstrapCol } from 'reactstrap';

const breakPoints = [
    { id: 'xl', min: 600 },
    { id: 'lg', min: 496, max: 600 },
    { id: 'md', min: 384, max: 496 },
    { id: 'sm', min: 288, max: 384 },
    { id: 'xs', max: 288 }
];

const getCurrentbreakPoint = (width, breakPoints) => {
    let output = 'xl';
    for (let bp of breakPoints) {
        if (
            (_.isUndefined(bp.min) || bp.min <= width) &&
            (_.isUndefined(bp.max) || bp.max > width)
        ) {
            output = bp.id;
        }
    }
    return output;
};

export class Col extends React.Component {

    render() {
        const { active, children, className, trueSize } = this.props;
        const bsColumnProps = _.pick(this.props, ['xl', 'lg', 'md', 'sm', 'xs']);
        const otherProps = _.omit(this.props, [..._.keys(Col.propTypes),
            'minW', 'maxW', 'minH', 'maxH', 'moved', 'static', 'isDraggable', 'isResizable']);
        const floatColBpId = trueSize ? getCurrentbreakPoint(trueSize.wPx, breakPoints) : 'xl';
        const floatColClasses = classNames(className, 'float-col',
            'float-column', `float-column--size-${floatColBpId}`);

        return active ? (
            <div { ...otherProps } className={ floatColClasses }>
                { children }
            </div>
        ) : (
            <BootstrapCol
                { ...(_.extend(bsColumnProps, otherProps)) }
                className={ classNames(className, 'pb-3') }
            >
                { children }
            </BootstrapCol>
        );
    }
}
