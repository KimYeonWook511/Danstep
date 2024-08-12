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
    private Integer resultInfoId;

    private Integer gameInfoId;
    private Date resultDate;
    private Integer score;
    private Integer perfect;
    private Integer great;
    private Integer good;
    private Integer bad;
    private Integer maxCombo;

    // user_info join
    private String username;
    private String nickname;

    // game_info join
    private String title;
    private Integer playtime;
    private Integer level;
}
