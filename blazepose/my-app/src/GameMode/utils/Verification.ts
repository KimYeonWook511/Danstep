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
    return requiredIndices.every(index => keypoints[index] && keypoints[index].score > 0.1);
};

export const detectFirstFrame = async (detector: PoseDetector, videoRef: React.RefObject<HTMLVideoElement>, firstFrameZ: React.MutableRefObject<number[]>) => {
    if (videoRef.current) {
        const poses = await detector.estimatePoses(videoRef.current);
        if (poses[0]) {
            firstFrameZ.current = poses[0].keypoints.map(kp => kp.z || 0);
            videoRef.current.pause();
        } else {
            console.log("Required keypoints not detected in the first frame.");
        }
    }
};

export const checkInitialZAlignment = async (detector: PoseDetector, camRef: React.RefObject<HTMLVideoElement>, firstFrameZ: React.MutableRefObject<number[]>): Promise<boolean> => {
    if (camRef.current) {
        const camposes = await detector.estimatePoses(camRef.current);
        if (camposes[0]) {
            const camZ = camposes[0].keypoints.map(kp => kp.z || 0);
            const alignmentScore = calculateZAlignment(firstFrameZ.current, camZ);
            console.log(`Initial Z alignment score: ${alignmentScore}`);
            return alignmentScore > 0.7; // 유사도 임계값을 0.7로 설정
        } else {
            console.log("Required keypoints not detected in the camera frame.");
        }
    }
    return false;
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
