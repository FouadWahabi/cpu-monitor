import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { FloatGridContext } from './floatGridContext';
import '../../styles/float-grid.scss';

export class Grid extends React.Component {
    static propTypes = {
        children: PropTypes.node,
    }

    state = {
        gridSize: { w: 0, h: 0 },
        gridReady: false,
    }
    _gridRef = React.createRef();
    _resizeDebounceTimeout = 0;

    componentDidMount() {
        this.setState({
            gridSize: {
                w: this._gridRef.current.clientWidth,
                h: this._gridRef.current.clientHeight
            }
        });

        window.addEventListener('resize', this._resizeHandler);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this._resizeHandler);
    }

    render() {
        const { children, ...otherProps } = this.props;
        const { gridSize } = this.state;
        const modifiedChildren = React.Children.map(children, child => (
            React.cloneElement(child, {
                ...otherProps,
                active: true,
                gridSize
            })
        ));

        const floatWrapClasses = classNames('float-grid-parent__static', 'float-grid-parent');

        return(
            <FloatGridContext.Provider
                value={{
                    gridUnitsToPx: (w, h) => {
                        return {
                            wPx: w / 12 * gridSize.w,
                            hPx: h * 100
                        }
                    },
                    active: true,
                    gridReady: this.state.gridReady,
                    setGridReady: () => { this.setState({ gridReady: true }) }
                }}
            >
                {
                    <div
                        className={ floatWrapClasses }
                        ref={ this._gridRef }
                    >
                        { modifiedChildren }
                    </div>
                }
                
            </FloatGridContext.Provider>
        );
    }

    _resizeHandler = () => {
        clearInterval(this._resizeDebounceTimeout);

        this._resizeDebounceTimeout = setTimeout(() => {
            this.setState({
                gridSize: {
                    w: this._gridRef.current.clientWidth,
                    h: this._gridRef.current.clientHeight
                }
            });
        }, 1000 / 60 * 10); //Every 10 frames debounce
    }
}
