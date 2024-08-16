package com.danstep.result.model.dto;

import lombok.*;

import java.util.Date;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class ReplayDTO {

    private Integer resultInfoId;
    private String username;

    private Integer gameInfoId;
    private String audioFilename;
    private String gamePoseFilename;
    private String backgroundFilename;

    private String myPoseFilename;

    private Integer score;
    private Integer perfect;
    private Integer great;
    private Integer good;
    private Integer bad;
    private Integer maxCombo;

}
