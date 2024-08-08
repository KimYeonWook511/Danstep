package com.danstep.game.model.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@Builder
public class GameInfoDTO {
    private Integer id;
    private String title;
    private Date uploadDate;
    private Integer playtime;
    private String thumbnailUrl;
    private String audioUrl;
    private Object poseData;
    private Integer level;
}
