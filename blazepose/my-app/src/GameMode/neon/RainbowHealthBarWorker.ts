/* eslint-disable*/
let health = 100;

self.onmessage = function (event) {
  const { action, data } = event.data;

  switch (action) {
    case 'updateHealth':
      health = data;
      self.postMessage({ action: 'updateHealth', health });
      break;
    default:
      break;
  }
};

export {};
