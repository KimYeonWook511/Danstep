import * as tf from '@tensorflow/tfjs';
import * as poseDetection from '@tensorflow-models/pose-detection';

let detector: poseDetection.PoseDetector;

const init = async () => {
  await tf.setBackend('webgl');
  await tf.ready();
  const modelConfig = {
    runtime: 'mediapipe',
    modelType: 'lite',
    solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/pose/',
  };
  detector = await poseDetection.createDetector(poseDetection.SupportedModels.BlazePose, modelConfig);
  postMessage({ type: 'init' });
};

onmessage = async (event: MessageEvent) => {
  if (event.data.type === 'init') {
    await init();
  } else if (event.data.type === 'detectPose') {
    const imageData = event.data.imageData as ImageData;
    const poses = await detector.estimatePoses(imageData);
    postMessage({ type: 'pose', poses });
  }
};

init();
