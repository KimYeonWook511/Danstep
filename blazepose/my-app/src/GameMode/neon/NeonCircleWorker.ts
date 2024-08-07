/* eslint-disable */
let position = { x: 0, y: 0 };
let isBursting = false;

self.onmessage = function (event) {
  const { action, data } = event.data;

  switch (action) {
    case 'updatePosition':
      position = data;
      break;
    case 'burst':
      isBursting = true;
      setTimeout(() => {
        isBursting = false;
        self.postMessage({ action: 'updateBurst', isBursting });
      }, 300); // 애니메이션 지속 시간에 맞춰서 복원
      break;
    case 'animate':
      self.postMessage({ action: 'animate', position });
      setTimeout(() => self.postMessage({ action: 'animate', position }), 1000 / 60);
      break;
    default:
      break;
  }
};

export {};

