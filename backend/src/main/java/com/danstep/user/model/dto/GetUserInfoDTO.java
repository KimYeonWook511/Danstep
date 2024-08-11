package com.danstep.user.model.dto;

import lombok.*;

import java.util.Date;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class GetUserInfoDTO {
    private String username;
    private String nickname;
    private Date registDate;
    private String profile;
}
