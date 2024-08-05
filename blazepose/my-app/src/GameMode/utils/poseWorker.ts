import * as tf from '@tensorflow/tfjs';
import { createDetector, SupportedModels, PoseDetector } from '@tensorflow-models/pose-detection';

let detector: PoseDetector | null = null;

onmessage = async (event) => {
  const { type, video } = event.data;
  switch (type) {
    case 'init':
      await tf.setBackend('webgl');
      await tf.ready();
      const modelConfig = {
        runtime: 'mediapipe',
        modelType: 'full',
        solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/pose/',
      };
      detector = await createDetector(SupportedModels.BlazePose, modelConfig);
      postMessage({ type: 'initComplete' });
      break;
    case 'detectPose':
    case 'checkdetectPose':
      if (detector && video) {
        const poses = await detector.estimatePoses(video);
        postMessage({ type: 'poseDetected', poses });
      }
      break;
    default:
      break;
  }
};
