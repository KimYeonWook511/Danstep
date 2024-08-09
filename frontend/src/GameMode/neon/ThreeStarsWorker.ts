/*eslint-disable*/

import * as THREE from 'three';

let rotationX = 0;
let rotationY = 0;

self.onmessage = function (event) {
  const { action } = event.data;

  switch (action) {
    case 'start':
      animate();
      break;
    default:
      break;
  }
};

function animate() {
  rotationX += 0.0005;
  rotationY += 0.0005;
  self.postMessage({ action: 'updateStars', rotationX, rotationY });
  setTimeout(animate, 1000 / 60);
}

export {};
