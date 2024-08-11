package com.danstep.user.model.service;

import com.danstep.user.model.dto.GetUserInfoDTO;
import com.danstep.user.model.dto.UpdateUserDTO;
import org.springframework.web.multipart.MultipartFile;

public interface UserService {

    GetUserInfoDTO getUserInfoByUsername(String username);

    void updateUserByUsername(UpdateUserDTO updateUserDTO, MultipartFile profile);
}
