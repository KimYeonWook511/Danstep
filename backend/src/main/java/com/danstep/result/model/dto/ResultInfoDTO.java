package com.danstep.result.model.dto;

import com.danstep.game.model.dto.GameInfoDTO;
import com.danstep.user.model.dto.UserInfoDTO;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@Builder
public class ResultInfoDTO {
    private Integer id;
    private UserInfoDTO userInfoDTO;
    private GameInfoDTO gameInfoDTO;
    private Date resultDate;
    private Integer score;
    private Integer perfect;
    private Integer great;
    private Integer good;
    private Integer bad;
}
