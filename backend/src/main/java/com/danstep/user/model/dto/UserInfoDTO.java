package com.danstep.user.model.dto;

import lombok.*;

import java.util.Date;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserInfoDTO {
    private Integer id;
    private String username;
    private String password;
    private String nickname;
    private Date registDate;
    private String refresh;
    private String role;
    private String profile;
}
