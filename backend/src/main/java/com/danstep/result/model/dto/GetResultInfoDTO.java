package com.danstep.result.model.dto;

import lombok.*;

import java.util.Date;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class GetResultInfoDTO {
    private Integer gameInfoId;
    private Date resultDate;
    private Integer score;
    private Integer perfect;
    private Integer great;
    private Integer good;
    private Integer bad;
    private Integer maxCombo;

    private String username;

    // 내가 춤 춘거 저장한게 있다면
    private String poseData; // 포즈 Keypoint Json 객체

    public GetResultInfoDTO(ResultInfoDTO resultInfoDTO) {
        this.gameInfoId = resultInfoDTO.getGameInfoId();
        this.resultDate = resultInfoDTO.getResultDate();
        this.score = resultInfoDTO.getScore();
        this.perfect = resultInfoDTO.getPerfect();
        this.great = resultInfoDTO.getGreat();
        this.good = resultInfoDTO.getGood();
        this.bad = resultInfoDTO.getBad();
        this.maxCombo = resultInfoDTO.getMaxCombo();
        this.username = resultInfoDTO.getUsername();
    }
}
