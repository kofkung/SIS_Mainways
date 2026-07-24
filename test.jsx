import React from 'react';
import { renderToString } from 'react-dom/server';
import App from './src/App.jsx';

console.log("STARTING TEST...");

global.window = {
  location: { hash: '#home' },
  addEventListener: () => {},
  removeEventListener: () => {},
  scrollTo: () => {}
};
global.document = {
  body: { classList: { toggle: () => {}, remove: () => {} } },
  querySelectorAll: () => [],
  activeElement: { blur: () => {} }
};
global.IntersectionObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

try {
  const html = renderToString(React.createElement(App));
  console.log("RENDER SUCCESS HOME! Length:", html.length);
  
  global.window.location.hash = '#products';
  const html2 = renderToString(React.createElement(App));
  console.log("RENDER SUCCESS PRODUCTS! Length:", html2.length);
} catch (e) {
  console.error("RENDER ERROR:", e);
}
