import { Keypoint } from '@tensorflow-models/pose-detection';

const JOINTS = [
    [11, 13], [13, 15], [12, 14], [14, 16], // 팔
    [11, 12], [23, 24], // 몸통
    [23, 25], [25, 27], [24, 26], [26, 28]  // 다리
];

export const calculateScore = (
    keypoints1: Keypoint[],
    keypoints2: Keypoint[]
) => {
    let sum = 0;
    let pose1ConfidenceSum = 0;

    JOINTS.map((joint) => {
        const v1 = {
            x: keypoints1[joint[0]].x - keypoints1[joint[1]].x,
            y: keypoints1[joint[0]].y - keypoints1[joint[1]].y,
            z: keypoints1[joint[0]].z! - keypoints1[joint[1]].z!,
        };
        const v2 = {
            x: keypoints2[joint[0]].x - keypoints2[joint[1]].x,
            y: keypoints2[joint[0]].y - keypoints2[joint[1]].y,
            z: keypoints2[joint[0]].z! - keypoints2[joint[1]].z!,
        };

        const pose1Confidence =
            (keypoints1[joint[0]].score! + keypoints1[joint[1]].score!) / 2;
        const pose2Confidence =
            (keypoints2[joint[0]].score! + keypoints2[joint[1]].score!) / 2;
        const diffConfidence = Math.abs(pose1Confidence - pose2Confidence);

        const norm_v1 = l2_norm(v1);
        const norm_v2 = l2_norm(v2);
        let tempSum =
            diffConfidence > 0.3
                ? 0
                : similarity(v1, v2) * (1 - diffConfidence);
        pose1ConfidenceSum += 1 - diffConfidence;
        sum += tempSum;

        return sum;
    });

    let avg = sum / pose1ConfidenceSum;
    if (avg < 0) avg = 0;
    return avg * 100;
};

const l2_norm = (kpt: { x: number; y: number; z: number }) => {
    const norm = Math.sqrt(kpt.x * kpt.x + kpt.y * kpt.y + kpt.z * kpt.z);
    return { x: kpt.x / norm, y: kpt.y / norm, z: kpt.z / norm };
};

const similarity = (v1: { x: number, y: number, z: number }, v2: { x: number, y: number, z: number }) => {
    const dotProduct = v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
    const norm1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y + v1.z * v1.z);
    const norm2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y + v2.z * v2.z);
    return dotProduct / (norm1 * norm2);
};

export { l2_norm, similarity };
