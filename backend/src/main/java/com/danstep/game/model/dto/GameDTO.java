package com.danstep.game.model.dto;

import lombok.Getter;
import lombok.Setter;
import org.springframework.core.io.ByteArrayResource;

@Getter
@Setter
public class GameDTO {
    private Integer gameId;
    private String fileUUID;
    private Integer fileLength;
    private String fileData;
}
