// Add custom jest matchers from jest-dom
require('@testing-library/jest-dom');

// Polyfill TextEncoder/TextDecoder for React Router
const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock scrollIntoView which is not available in jsdom
Element.prototype.scrollIntoView = jest.fn();
