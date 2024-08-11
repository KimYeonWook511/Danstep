package com.danstep.user.model.dto;

import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UpdateUserDTO {
    private String username;
    private String currentPassword;
    private String newPassword;
    private String nickname;
    private String profile;
}
