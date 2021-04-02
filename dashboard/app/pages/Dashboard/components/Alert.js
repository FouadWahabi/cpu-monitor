import React from 'react';

import { Media } from 'reactstrap';

const Alert = ({ type, startDate, endDate }) => {
  return (
    <React.Fragment>
        <Media>
            <Media left>
                <span className="fa-stack fa-lg fa-fw d-flex mr-3">
                    <i className={ `fa fa-fw fa-stack-2x fa-stack-2x ${ type === 'high_load' ? 'danger' :'success' } fa-circle`}></i>
                    <i className={ `fa fa-stack-1x fa-fw white fa-${ type === 'high_load' ? 'exclamation' :'check' }` }></i>
                </span>
            </Media>
            <Media body>
                <span className="h6">
                    {type === 'high_load' ? 'High load detected.' : 'Recovered from high load.'}
                </span>
                <div className="small mt-2">
                    {startDate} - {endDate}
                </div>
            </Media>
        </Media>
    </React.Fragment>
  );
};

export default Alert;
