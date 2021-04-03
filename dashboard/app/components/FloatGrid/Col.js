import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

export class Col extends React.Component {
    static propTypes = {
        children: PropTypes.node,
        className: PropTypes.string
    }

    render() {
        const { children, className, ...otherProps } = this.props;
        const floatColClasses = classNames(className, 'float-col',
            'float-column', `float-column--size-xl`);

        return (
            <div { ...otherProps } className={ floatColClasses }>
                { children }
            </div>
        );
    }
}
