import 'react-native';
import flatten from 'flat';
import React from 'react';
import renderer from 'react-test-renderer';

import ErrorMessage from '../../src/components/ErrorMessage';

test('renders ErrorMessage component', () => {
  const onCloseSpy = jest.fn();
  const message = 'This is a very dangerous sample error message.';

  const tree = renderer.create(
    <ErrorMessage
      message={message}
      onClose={onCloseSpy}
    />
  );

  expect(Object.values(flatten(tree.toJSON()))).toContain(message);
});

