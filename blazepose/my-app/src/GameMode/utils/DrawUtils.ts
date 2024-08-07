import { Keypoint, SupportedModels, util } from '@tensorflow-models/pose-detection';

const drawKeypoints1 = (
  ctx: CanvasRenderingContext2D,
  keypoints: Keypoint[],
  color: string,
  neonColor: string,
  alpha: number = 0.3 // 투명도 값 추가 (기본값 0.5)
) => {
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.lineWidth = 20;
  // ctx.lineCap = 'round'; // 선의 끝을 둥글게 설정
  // ctx.lineJoin = 'round'; // 선의 연결 부분을 둥글게 설정

  

  ctx.save();
  ctx.scale(-1, 1);
  ctx.translate(-ctx.canvas.width, 0);

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
  ctx.restore();

  // const rightEyeLeft = Math.sqrt(
  //   Math.pow(keypoints[2].x - keypoints[1].x, 2) +
  //     Math.pow(keypoints[2].y - keypoints[1].y, 2) +
  //     Math.pow(keypoints[2].z! - keypoints[1].z!, 2)
  // );

  // const rightEyeRight = Math.sqrt(
  //   Math.pow(keypoints[2].x - keypoints[3].x, 2) +
  //     Math.pow(keypoints[2].y - keypoints[3].y, 2) +
  //     Math.pow(keypoints[2].z! - keypoints[3].z!, 2)
  // );

  // const rightEye = new Path2D();
  // rightEye.arc(
  //   (keypoints[1].x + keypoints[2].x + keypoints[3].x) / 3,
  //   (keypoints[1].y + keypoints[2].y + keypoints[3].y) / 3,
  //   1,
  //   0,
  //   Math.PI
  // );

  // ctx.fillStyle = `rgb(0,0,0)`;
  // ctx.fill(rightEye);
  // ctx.stroke(rightEye);

  // const leftEyeLeft = Math.sqrt(
  //   Math.pow(keypoints[5].x - keypoints[4].x, 2) +
  //     Math.pow(keypoints[5].y - keypoints[4].y, 2) +
  //     Math.pow(keypoints[5].z! - keypoints[4].z!, 2)
  // );

  // const leftEyeRight = Math.sqrt(
  //   Math.pow(keypoints[5].x - keypoints[6].x, 2) +
  //     Math.pow(keypoints[5].y - keypoints[6].y, 2) +
  //     Math.pow(keypoints[5].z! - keypoints[6].z!, 2)
  // );

  // const leftEye = new Path2D();
  // leftEye.arc(
  //   (keypoints[4].x + keypoints[5].x + keypoints[6].x) / 3,
  //   (keypoints[4].y + keypoints[5].y + keypoints[6].y) / 3,
  //   (leftEyeLeft + leftEyeRight) / 2,
  //   0,
  //   Math.PI
  // );

  // ctx.fillStyle = `rgb(0,0,0)`;
  // ctx.fill(leftEye);
  // ctx.stroke(leftEye);
  // ctx.restore();
};

const drawKeypoints2 = (
  ctx: CanvasRenderingContext2D,
  keypoints: Keypoint[],
  color: string,
  neonColor: string
) => {
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.lineWidth = 20;
  ctx.lineCap = 'round'; // 선의 끝을 둥글게 설정
  ctx.lineJoin = 'round'; // 선의 연결 부분을 둥글게 설정

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

    if (score1 >= scoreThreshold && score2 >= scoreThreshold && ((i > 14 && j > 14 && i < 23 && j < 23) || (i > 26 && j > 26))) {
      ctx.beginPath();
      ctx.moveTo(kp1.x, kp1.y);
      ctx.lineTo(kp2.x, kp2.y);
      ctx.stroke();
    }
  });
};

const drawKeypoints3 = (
  ctx: CanvasRenderingContext2D,
  keypoints: Keypoint[],
  color: string,
  neonColor: string
) => {
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.lineWidth = 20;
  ctx.lineCap = 'round'; // 선의 끝을 둥글게 설정
  ctx.lineJoin = 'round'; // 선의 연결 부분을 둥글게 설정

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
  ctx.restore();
};



export const drawHandFoot = (ctx: CanvasRenderingContext2D, keypoints: Keypoint[]) => {
  drawKeypoints2(ctx, keypoints, 'rgba(255,255,255,0.5)', 'rgba(255, 255, 255, 1)');
};

export const drawGreen = (ctx: CanvasRenderingContext2D, keypoints: Keypoint[]) => {
  drawKeypoints1(ctx, keypoints, 'rgba(0,255,0,0.5)', 'rgba(0, 255, 0, 1)');
};

export const drawRed = (ctx: CanvasRenderingContext2D, keypoints: Keypoint[]) => {
  drawKeypoints3(ctx, keypoints, 'rgba(255,0,0,0.5)', 'rgba(255, 0, 0, 1)');
};