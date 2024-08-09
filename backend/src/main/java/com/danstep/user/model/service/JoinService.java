package com.danstep.user.model.service;

import com.danstep.user.model.dto.UserInfoDTO;
import com.danstep.user.model.mapper.UserMapper;
import com.danstep.user.model.dto.JoinDTO;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class JoinService {

    private final UserMapper userMapper;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    public JoinService(UserMapper userMapper, BCryptPasswordEncoder bCryptPasswordEncoder) {

        this.userMapper = userMapper;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    }

    public void joinProcess(JoinDTO joinDTO) {

        String username = joinDTO.getUsername();
        String password = joinDTO.getPassword();
        String nickname = joinDTO.getNickname();

        Boolean isExist = userMapper.existsByUsername(username);

        if (isExist) {

            return;
        }

        UserInfoDTO data = UserInfoDTO.builder()
                .username(username)
                .password(bCryptPasswordEncoder.encode((password)))
                .nickname(nickname)
                .build();

        userMapper.insertUser(data);
    }
}