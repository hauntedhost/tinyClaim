import React from 'react';
import classNames from 'classnames';
import humanize from 'string-humanize';

const Claim = ({ claim, start }) => {
  const classes = classNames('claim', claim.status);
  const isStartable = claim.status !== 'started';
  const startButton = (
    <button className='start' onClick={start}>Start</button>
  );

  return (
    <li className={classes}>
      <div className="left">
        <p><strong>Description:</strong> {claim.description}</p>
        <p><strong>Status:</strong> {humanize(claim.status)}</p>
      </div>
      <div className="right">
        {isStartable ? startButton : ''}
      </div>
    </li>
  );
}

Claim.propTypes = {
  claim: React.PropTypes.object.isRequired,
  start: React.PropTypes.func.isRequired
};

export default Claim;
