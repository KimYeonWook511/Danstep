package com.danstep.result.model.dto;

import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class GetReplayDTO {

    private String audioUrl; // 오디오(노래) CloudFront URL
    private String gamePoseData; // 게임 포즈 Keypoint Json
    private String backgroundUrl; // 배경 CloudFront URL
    private String myPoseData; // 내 포즈 Keypoint Json

    private Integer score;
    private Integer perfect;
    private Integer great;
    private Integer good;
    private Integer bad;
    private Integer maxCombo;

}
