import React from 'react';
import { render } from 'react-dom';
import App from './app';

const init = () => {
  render(<App />, document.getElementById('root'));
};

window.addEventListener('DOMContentLoaded', init);
