package com.danstep.result.model.dto;

import lombok.*;

import java.util.Date;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class GetUserResultDTO {
    private Integer resultInfoId;
    private Integer gameInfoId;
    private Date resultDate;

    private Integer score;

    // user_info join
    private String username;
    private String nickname;

    // game_info join
    private String title;
}
