import { PoseDetector } from '@tensorflow-models/pose-detection';

// 팔과 다리 키포인트 인덱스



// 팔이 머리 위로 올라가는지 체크하는 함수
export const isArmsUp = (keypoints: any[]): boolean => {
    const leftShoulder = keypoints[11];
    const rightShoulder = keypoints[12];
    const leftElbow = keypoints[13];
    const rightElbow = keypoints[14];
    const leftWrist = keypoints[15];
    const rightWrist = keypoints[16];

    return (
        leftElbow.y < leftShoulder.y && leftWrist.y < leftShoulder.y &&
        rightElbow.y < rightShoulder.y && rightWrist.y < rightShoulder.y
    );
};

export const keypointsDetected = (keypoints: any[], requiredIndices: number[]): boolean => {
    return requiredIndices.every(index => keypoints[index] && keypoints[index].score > 0.8);
};

// export const detectFirstFrame = async (detector: PoseDetector, videoRef: React.RefObject<HTMLVideoElement>, firstFrameZ: React.MutableRefObject<number[]>) => {
//     if (videoRef.current) {
//         const poses = await detector.estimatePoses(videoRef.current);
//         if (poses[0]) {
//             firstFrameZ.current = poses[0].keypoints.map(kp => kp.z || 0);
//             videoRef.current.pause();
//         } else {
//             // console.log("Required keypoints not detected in the first frame.");
//         }
//     }
// };

export const detectFirstFrame = async (keypoints: any[], firstFrameY: React.MutableRefObject<number[]>) => {
    if (keypoints) {
        firstFrameY.current = keypoints.map(kp => kp.y || 0);
    }
};

export const checkInitialYAlignment = async (detector: PoseDetector, camRef: React.RefObject<HTMLVideoElement>, firstFrameY: React.MutableRefObject<number[]>): Promise<number> => {
    if (camRef.current) {
        const camposes = await detector.estimatePoses(camRef.current);
        if (camposes[0]) {
            const camY = camposes[0].keypoints.map(kp => kp.y || 0);
            const alignmentScore = calculateYAlignment(firstFrameY.current, camY);
            // console.log(`Initial Z alignment score: ${alignmentScore}`);
            return alignmentScore; // 유사도 임계값을 0.7로 설정
        } else {
            // console.log("Required keypoints not detected in the camera frame.");
        }
    }
    return 100;
};

const calculateYAlignment = (y1: number[], y2: number[]): number => {
    let sum = 0;
    const diff1 = (y1[27] / y1[11]) - (y2[27] / y2[11]);
    const diff2 = (y1[28] / y1[12]) - (y2[28] / y2[12]);
    sum = diff1 + diff2;
    return sum / 2;
};
