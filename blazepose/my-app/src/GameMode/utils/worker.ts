// worker.ts
/*eslint-disable*/
import { Keypoint,createDetector, SupportedModels, util } from '@tensorflow-models/pose-detection';

self.onmessage = async (event) => {
  const { canvas, imageBitmap } = event.data;
  const offscreenCanvas = canvas as OffscreenCanvas;
  const ctx = offscreenCanvas.getContext('2d');

  if (ctx && imageBitmap) {
    ctx.clearRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);
    ctx.drawImage(imageBitmap, 0, 0);

    // 여기서 포즈를 감지하고 그림을 그립니다.
    const detector = await createDetector(SupportedModels.BlazePose);
    const poses = await detector.estimatePoses(imageBitmap);

    if (poses[0]) {
      drawRed(ctx, poses[0].keypoints);
      self.postMessage(poses[0].keypoints);
    }
  }
};

export const drawRed = (ctx: OffscreenCanvasRenderingContext2D, keypoints: Keypoint[]) => {
  const color = 'rgba(255,0,0,0.5)';
  const neonColor = 'rgba(255, 0, 0, 1)';

  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.lineWidth = 12;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  ctx.shadowColor = neonColor;
  ctx.shadowBlur = 30;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

  util.getAdjacentPairs(SupportedModels.BlazePose).forEach(([i, j]) => {
    const kp1 = keypoints[i];
    const kp2 = keypoints[j];

    const score1 = kp1.score != null ? kp1.score : 1;
    const score2 = kp2.score != null ? kp2.score : 1;
    const scoreThreshold = 0.1;

    if (score1 >= scoreThreshold && score2 >= scoreThreshold && i > 10 && j > 10) {
      ctx.beginPath();
      ctx.moveTo(kp1.x, kp1.y);
      ctx.lineTo(kp2.x, kp2.y);
      ctx.stroke();
    }
  });

  const left = Math.sqrt(
    Math.pow(keypoints[0].x - keypoints[8].x, 2) +
      Math.pow(keypoints[0].y - keypoints[8].y, 2) +
      Math.pow(keypoints[0].z! - keypoints[8].z!, 2)
  );

  const right = Math.sqrt(
    Math.pow(keypoints[0].x - keypoints[7].x, 2) +
      Math.pow(keypoints[0].y - keypoints[7].y, 2) +
      Math.pow(keypoints[0].z! - keypoints[7].z!, 2)
  );

  const circle = new Path2D();
  circle.arc(
    (keypoints[0].x + keypoints[7].x + keypoints[8].x) / 3,
    (keypoints[0].y + keypoints[7].y + keypoints[8].y) / 3,
    (left + right) / 2,
    0,
    2 * Math.PI
  );
  ctx.fill(circle);
  ctx.stroke(circle);
};
