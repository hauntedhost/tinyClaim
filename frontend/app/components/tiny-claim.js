import React from 'react';
import _ from 'lodash';
import Claim from './claim';

// NOTE: as of 2016-01-22 the top-level component currently cannot be a
// a stateless component, otherwise hot reloading breaks.
// see: https://github.com/gaearon/babel-plugin-react-transform/issues/57

class TinyClaim extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startButtonDisabled: false,
      claims: props.claims.map((claim) =>  {
        claim.status = 'not_started';
        return claim;
      })
    }
  }

  handleClaimResult(index, result) {
    const claims = [...this.state.claims];
    const status = result ? 'passed' : 'failed';
    claims[index].status = status;
    this.setState({
      startButtonDisabled: this.isStartButtonDisabled(),
      claims: claims
    });
  };

  runClaim(index) {
    const claim = this.state.claims[index];
    const handler = this.handleClaimResult.bind(this, index)

    try {
      claim.run(handler);
    } catch(e) {
      handler(false);
    }
  }

  startAllClaims() {
    this.state.claims.map((claim, index) => {
      this.startClaim(index);
    });
  }

  startClaim(index) {
    if (this.isTodoStartable(index)) {
      const claims = [...this.state.claims];
      const claim = claims[index];

      claims[index].status = 'started';
      this.setState({
        claims: claims
      });

      this.runClaim(index);
    }
  }

  statusCounts() {
    return _.countBy(this.state.claims, 'status');
  }

  isTodoStartable(index) {
    return this.state.claims[index].status !== 'started';
  }

  isStartButtonDisabled() {
    const statusCounts = this.statusCounts();
    return statusCounts.started;
  }

  areAllClaimsRun() {
    const statusCounts = this.statusCounts();
    return(
      !statusCounts.not_started &&
      !statusCounts.started &&
      !statusCounts.in_progress
    );
  }

  render() {
    const { claims, runCount } = this.state;
    const statusCounts = this.statusCounts();
    const areAllClaimsRun = this.areAllClaimsRun();

    if (claims.length <= 0) {
      return(
        <p><strong>NO claimS!</strong></p>
      );
    }

    return(
      <div>
        <button
          disabled={this.state.startButtonDisabled}
          onClick={this.startAllClaims.bind(this)}>Start All
        </button>

        <p>Total running: {statusCounts.started || 'None'}</p>
        <p>Total passed: {statusCounts.passed || 'None'}</p>
        <p>Total failed: {statusCounts.failed || 'None'}</p>

        {areAllClaimsRun ? (<p><strong>ALL FINISHED!</strong></p>) : ''}

        <ul className="claims">
          {claims.map((claim, index) => {
            return(
              <Claim
                key={index}
                claim={claim}
                start={this.startClaim.bind(this, index)} />
            );
          })}
        </ul>
      </div>
    );
  }
}

TinyClaim.propTypes = {
  claims: React.PropTypes.array.isRequired
};

export default TinyClaim;
