package com.danstep.game.model.dto;

import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class GameRankTop3DTO {

    private Integer game_info_id;
    private String username;
    private String nickname;
    private Integer score;
    private Integer rank;
}
