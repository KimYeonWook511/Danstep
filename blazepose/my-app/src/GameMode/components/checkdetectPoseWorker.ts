import * as tf from '@tensorflow/tfjs';
import { createDetector, SupportedModels, Keypoint } from '@tensorflow-models/pose-detection';

// Disable no-restricted-globals lint rule for Web Workers
/* eslint-disable no-restricted-globals */

let detector: any = null;

self.onmessage = async (event) => {
  const { type, videoFrame, modelConfig } = event.data;

  if (type === 'init') {
    detector = await createDetector(SupportedModels.BlazePose, modelConfig);
    self.postMessage({ type: 'init_done' });
  } else if (type === 'detect') {
    const offscreenCanvas = new OffscreenCanvas(videoFrame.width, videoFrame.height);
    const ctx = offscreenCanvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoFrame, 0, 0);
      const poses = await detector.estimatePoses(offscreenCanvas);
      self.postMessage({ keypoints: poses[0]?.keypoints || null });
    } else {
      self.postMessage({ keypoints: null });
    }
  }
};

/* eslint-enable no-restricted-globals */
