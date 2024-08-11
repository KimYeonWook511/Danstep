package com.danstep.user.model.service;

import com.danstep.user.model.dto.UpdateUserDTO;

public interface UserService {

    void updateUserByUsername(UpdateUserDTO updateUserDTO);
}
