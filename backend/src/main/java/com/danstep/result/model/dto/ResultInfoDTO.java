package com.danstep.result.model.dto;

import lombok.*;

import java.util.Date;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class ResultInfoDTO {
    private Integer id;
//    private Integer userInfoId;
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
    private String poseFilename;
}
