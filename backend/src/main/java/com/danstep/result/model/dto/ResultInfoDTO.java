package com.danstep.result.model.dto;

import com.danstep.game.model.dto.GameInfoDTO;
import com.danstep.user.model.dto.UserInfoDTO;
import lombok.*;

import java.util.Date;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
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
    private Integer maxCombo;

    // 내가 춤 춘거 저장한다고 할 경우
    private String poseData; // 포즈 Keypoint Json 객체
}
