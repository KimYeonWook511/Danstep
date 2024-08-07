import * as tf from '@tensorflow/tfjs';
import { createDetector, SupportedModels, Keypoint } from '@tensorflow-models/pose-detection';

// Disable no-restricted-globals lint rule for Web Workers
/* eslint-disable no-restricted-globals */

let detector: any = null;

self.onmessage = async (event) => {
  const { type, videoFrame, firstFrameZ, modelConfig } = event.data;

  if (type === 'init') {
    detector = await createDetector(SupportedModels.BlazePose, modelConfig);
    self.postMessage({ type: 'init_done' });
  } else if (type === 'checkInitialZalignment') {
    const offscreenCanvas = new OffscreenCanvas(videoFrame.width, videoFrame.height);
    const ctx = offscreenCanvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoFrame, 0, 0);
      const poses = await detector.estimatePoses(offscreenCanvas);
      const camZ = poses[0]?.keypoints.map((kp: Keypoint) => kp.z || 0) || [];
      const alignmentScore = calculateZAlignment(firstFrameZ, camZ);
      self.postMessage({ isZAligned: alignmentScore > 0.7 });
    } else {
      self.postMessage({ isZAligned: false });
    }
  }
};

const calculateZAlignment = (z1: number[], z2: number[]): number => {
  let sum = 0;
  let count = 0;
  for (let i = 0; i < z1.length; i++) {
    if (z1[i] !== undefined && z2[i] !== undefined) {
      const diff = Math.abs(z1[i] - z2[i]);
      sum += diff;
      count++;
    }
  }
  return count > 0 ? 1 - (sum / count) : 0;
};

/* eslint-enable no-restricted-globals */
