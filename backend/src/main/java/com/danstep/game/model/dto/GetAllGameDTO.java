package com.danstep.game.model.dto;

import lombok.*;

import java.util.Date;
import java.util.List;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class GetAllGameDTO {
    private Integer id; // 게임 ID
    private String title; // 게임 제목
    private Date uploadDate; // 업로드 날짜
    private Integer playtime; // 플레이 시간
    private Integer level; // 게임 레벨

    // 게임 정보 조회 시
    private String thumbnailUrl; // 썸네일 CloudFront URL
    private String audioUrl; // 오디오(노래) CloudFront URL
    private String poseData; // 포즈 Keypoint Json
    private String backgroundUrl; // 배경 CloudFront URL

    private List<GameRankTop3DTO> rankTop3List;

    public GetAllGameDTO(GameInfoDTO gameInfoDTO, List<GameRankTop3DTO> gameRankTop3List) {
        this.id = gameInfoDTO.getId();
        this.title = gameInfoDTO.getTitle();
        this.uploadDate = gameInfoDTO.getUploadDate();
        this.playtime = gameInfoDTO.getPlaytime();
        this.level = gameInfoDTO.getLevel();
        this.thumbnailUrl = gameInfoDTO.getThumbnailUrl();
        this.audioUrl = gameInfoDTO.getAudioUrl();
        this.poseData = gameInfoDTO.getPoseData();
        this.backgroundUrl = gameInfoDTO.getBackgroundUrl();

        this.rankTop3List = gameRankTop3List;
    }
}
