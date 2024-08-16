package com.danstep.game.model.dto;

import lombok.*;

import java.util.Date;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class GameInfoDTO {
    private Integer id; // 게임 ID
    private String title; // 게임 제목
    private Date uploadDate; // 업로드 날짜
    private Integer playtime; // 플레이 시간
    private String thumbnailFilename; // 썸네일 파일 이름
    private String audioFilename; // 오디오 파일 이름
    private String poseFilename; // 포즈 파일 이름
    private String videoFilename; // 비디오 파일 이름
    private String backgroundFilename; // 배경 파일 이름
    private Integer level; // 게임 레벨

    // 게임 정보 조회 시
    private String thumbnailUrl; // 썸네일 CloudFront URL
    private String audioUrl; // 오디오(노래) CloudFront URL
    private String poseData; // 포즈 Keypoint Json
    private String backgroundUrl; // 배경 CloudFront URL
}
