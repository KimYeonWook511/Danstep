/*eslint-disable */
import * as tf from '@tensorflow/tfjs';
import { createDetector, SupportedModels, PoseDetector } from '@tensorflow-models/pose-detection';
import { drawGreen, drawRed } from '../utils/DrawUtils';

let detector: PoseDetector;
let camdetector: PoseDetector;
let checkdetector: PoseDetector;

self.onmessage = async function (e) {
  const { type, data } = e.data;
  console.log(data);
  switch (type) {
    case 'INIT':
      await tf.setBackend('webgl');
      await tf.ready();

      const modelConfig = {
        runtime: 'mediapipe',
        modelType: 'full',
        solutionPath: data.solutionPath, // 데이터로 경로 전달
      };

      detector = await createDetector(SupportedModels.BlazePose, modelConfig);
      camdetector = await createDetector(SupportedModels.BlazePose, modelConfig);
      checkdetector = await createDetector(SupportedModels.BlazePose, modelConfig);
      self.postMessage({ type: 'INIT_DONE' });
      break;

    case 'DETECT_POSE':
      const videoElement = data.videoElement;
      const canvasElement = data.canvasElement;
      const ctx = canvasElement.getContext('2d');
      canvasElement.width = videoElement.videoWidth;
      canvasElement.height = videoElement.videoHeight;
      const poses = await detector.estimatePoses(videoElement);
      if (poses[0]) drawGreen(ctx, poses[0].keypoints);
      self.postMessage({ type: 'POSE_DETECTED', keypoints: poses[0]?.keypoints });
      break;

    case 'CAM_DETECT_POSE':
      const camVideoElement = data.videoElement;
      const camCanvasElement = data.canvasElement;
      const camCtx = camCanvasElement.getContext('2d');
      camCanvasElement.width = camVideoElement.videoWidth;
      camCanvasElement.height = camVideoElement.videoHeight;
      const camPoses = await camdetector.estimatePoses(camVideoElement);
      if (camPoses[0]) drawRed(camCtx, camPoses[0].keypoints);
      self.postMessage({ type: 'CAM_POSE_DETECTED', keypoints: camPoses[0]?.keypoints });
      break;

    case 'CHECK_DETECT_POSE':
      const checkVideoElement = data.videoElement;
      const checkCanvasElement = data.canvasElement;
      const checkCtx = checkCanvasElement.getContext('2d');
      checkCanvasElement.width = checkVideoElement.videoWidth;
      checkCanvasElement.height = checkVideoElement.videoHeight;
      const checkPoses = await checkdetector.estimatePoses(checkVideoElement);
      if (checkPoses[0]) drawRed(checkCtx, checkPoses[0].keypoints);
      self.postMessage({ type: 'CHECK_POSE_DETECTED', keypoints: checkPoses[0]?.keypoints });
      break;
  }
};

export {};
