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
public class GetGameSelectBoxDTO {
    private Integer id; // 게임 ID
    private String title; // 게임 제목
    private Integer level;
}
