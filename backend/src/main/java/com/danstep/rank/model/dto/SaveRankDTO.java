package com.danstep.rank.model.dto;

import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class SaveRankDTO {
    private Integer id;
    private Integer resultInfoId;
    private Integer oldScore;
    private String username;
    private Integer gameInfoId;
}
