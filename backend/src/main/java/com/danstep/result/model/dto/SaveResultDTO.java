package com.danstep.result.model.dto;

import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class SaveResultDTO {
    private Integer id;
    private Integer gameInfoId;
    private Integer score;
    private Integer perfect;
    private Integer great;
    private Integer good;
    private Integer bad;
    private Integer maxCombo;

    private String username;

    // json 저장 여부에 따라 null 가능
    private String poseData;
}
