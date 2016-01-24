import React from 'react';
import { render } from 'react-dom';
import App from './containers/app';
import './styles/style.scss';
import faker from 'faker';
import _ from 'lodash';

const generateRandomClaim = () => {
  const description = faker.hacker.phrase();
  const claim = (callback) => {
    // const delay = 7000 + Math.random() * 7000;
    const delay = Math.random() * 3000;
    const claimProven = Math.random() > 0.5;

    setTimeout(() => {
      callback(claimProven);
    }, delay);
  };

  return {
    description: description,
    run: claim
  };
}

const generateRandomClaims = (num) => {
  return _.times(num, generateRandomClaim);
}

const claimProver = (claims = [], options = { id: 'app' }) => {
  render(<App claims={claims} />, document.getElementById(options.id));
}

window.tinyClaim = {
  generateRandomClaim: generateRandomClaim,
  generateRandomClaims: generateRandomClaims,
  prove: claimProver
}
