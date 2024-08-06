import * as tf from '@tensorflow/tfjs';
import { createDetector, SupportedModels, Keypoint } from '@tensorflow-models/pose-detection';

// Disable no-restricted-globals lint rule for Web Workers
/* eslint-disable no-restricted-globals */

let detector: any = null;

self.onmessage = async (event) => {
  const { type, video } = event.data;

  if (type === 'init') {
    const modelConfig = {
      runtime: 'mediapipe',
      modelType: 'full',
      solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/pose/',
    };
    detector = await createDetector(SupportedModels.BlazePose, modelConfig);
    self.postMessage({ type: 'init_done' });
  } else if (type === 'detectFirstFrame') {
    const videoElement = new OffscreenCanvas(video.width, video.height);
    videoElement.width = video.width;
    videoElement.height = video.height;
    const ctx = videoElement.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0);

      const poses = await detector.estimatePoses(videoElement);
      const firstFrameZ = poses[0]?.keypoints.map((kp: Keypoint) => kp.z || 0) || [];
      self.postMessage({ firstFrameZ });
    } else {
      self.postMessage({ firstFrameZ: [] });
    }
  }
};

/* eslint-enable no-restricted-globals */
