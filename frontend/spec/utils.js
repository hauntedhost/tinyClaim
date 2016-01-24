import TestUtils from 'react-addons-test-utils';
import _ from 'lodash';

// non-fancy, quick-hack, mutable breadth-first search
export const findChildWith = (output, source) => {
  let queue = [];
  let next = output;
  let count = 0;
  let maxCount = 25;

  while (next && count <= maxCount) {
    count += 1;

    if (_.isMatch(next, source)) {
      return next;
    }

    if (_.isArray(next.props.children)) {
      queue = queue.concat(next.props.children);
    } else if (_.isObject(next.props.children)) {
      queue.push(next.props.children);
    }
    next = queue.shift();
  }
}

export const getRenderOutput = (jsx) => {
  const renderer = TestUtils.createRenderer();
  renderer.render(jsx);
  return renderer.getRenderOutput();
}
