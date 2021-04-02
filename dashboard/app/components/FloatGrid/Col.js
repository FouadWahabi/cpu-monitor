import React from 'react';
import _ from 'lodash';
import classNames from 'classnames';

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
        const { children, className, trueSize } = this.props;
        const otherProps = _.omit(this.props, [..._.keys(Col.propTypes),
            'minW', 'maxW', 'minH', 'maxH', 'moved', 'static', 'isDraggable', 'isResizable']);
        const floatColBpId = trueSize ? getCurrentbreakPoint(trueSize.wPx, breakPoints) : 'xl';
        const floatColClasses = classNames(className, 'float-col',
            'float-column', `float-column--size-${floatColBpId}`);

        return (
            <div { ...otherProps } className={ floatColClasses }>
                { children }
            </div>
        );
    }
}
