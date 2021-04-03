import React from 'react';
import PropTypes from 'prop-types';
import { Media } from 'reactstrap';

import { ALERT_TYPES } from '../alertTypes';

const Alert = ({ type, startDate, endDate }) => {
  return (
    <React.Fragment>
        <Media>
            <Media left>
                <span className="fa-stack fa-lg fa-fw d-flex mr-3">
                    <i className={ `fa fa-fw fa-stack-2x fa-stack-2x ${ type === ALERT_TYPES.HIGH_LOAD ? 'danger' :'success' } fa-circle`}></i>
                    <i className={ `fa fa-stack-1x fa-fw white fa-${ type === ALERT_TYPES.HIGH_LOAD ? 'exclamation' :'check' }` }></i>
                </span>
            </Media>
            <Media body>
                <span className="h6">
                    {type === ALERT_TYPES.HIGH_LOAD ? 'High load detected.' : 'Recovered from high load.'}
                </span>
                <div className="small mt-2">
                    {startDate} - {endDate}
                </div>
            </Media>
        </Media>
    </React.Fragment>
  );
};

Alert.propTypes = {
  type: PropTypes.string,
  startDate: PropTypes.string,
  endDate: PropTypes.string,
};

export default Alert;
