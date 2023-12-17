const React = require('react');
const ReactDOM = require('react-dom');

const TestSSRComponent = require('../components/test.js');

ReactDOM.hydrate(React.createElement(TestSSRComponent), document.getElementById('react'));
