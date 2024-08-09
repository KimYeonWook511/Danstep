/*eslint-disable*/
self.onmessage = function (event) {
    const { action, score } = event.data;
  
    switch (action) {
      case 'updateScore':
        self.postMessage({ action: 'updateScore', score });
        break;
      default:
        break;
    }
  };
  
  export {};
  