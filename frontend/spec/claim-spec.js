import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import { findChildWith, getRenderOutput } from './utils';
import expect from 'expect';
import expectJSX from  'expect-jsx';
expect.extend(expectJSX);

import humanize from 'string-humanize';
import Claim from '../app/components/claim';

describe('Claim', () => {
  let jsx;
  let claim = { description: 'Prove all the things', prove: (cb) => cb(true) };
  let start = () => {};

  beforeEach(() => {
    jsx = <Claim claim={claim} start={start} />;
  });

  it('includes the description', () => {
    const expected = claim.description;
    const actual = getRenderOutput(jsx);
    expect(actual).toIncludeJSX(expected);
  });

  it('includes the humanized status', () => {
    const expected = humanize(claim.status);
    const actual = getRenderOutput(jsx);
    expect(actual).toIncludeJSX(expected);
  });

  it('includes the start button', () => {
    const expected = (<button className='start' onClick={start}>Start</button>);
    const actual = getRenderOutput(jsx);
    expect(actual).toIncludeJSX(expected);
  });

  // NOTE: this is a bit loopy, maybe there is a better way
  // ideally shallow renderer eventually supports Simulate.click
  // https://github.com/facebook/react/issues/1445
  it('clicking the start button triggers the start callback', () => {
    let status = 'not_started';
    const start = () => { status = 'started'; };
    jsx = <Claim claim={claim} start={start} />;

    const actual = getRenderOutput(jsx);
    const button = findChildWith(actual, { type: 'button', props: { className: 'start' }});
    button.props.onClick();

    expect(status).toEqual('started');
  });

  context('when claim.status is not equal to started', () => {
    beforeEach(() => {
      claim.status = 'started';
      jsx = <Claim claim={claim} start={start} />;
    });

    it('does not include the start button', () => {
      const expected = (<button className='start' onClick={start}>Start</button>);
      const actual = getRenderOutput(jsx);
      expect(actual).toNotIncludeJSX(expected);
    });
  });
});
