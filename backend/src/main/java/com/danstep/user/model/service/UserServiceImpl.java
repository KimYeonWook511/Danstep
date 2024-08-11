package com.danstep.user.model.service;

import com.danstep.user.model.dto.UpdateUserDTO;
import com.danstep.user.model.mapper.UserMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserServiceImpl implements UserService {

    private final UserMapper userMapper;

    public UserServiceImpl(UserMapper userMapper) {
        this.userMapper = userMapper;
    }

    @Override
    @Transactional
    public void updateUserByUsername(UpdateUserDTO updateUserDTO) {

        // 정보 수정
        // 원래 profile 삭제
        // 새로운 profile 업로드

        userMapper.updateUser(updateUserDTO);
    }
}
