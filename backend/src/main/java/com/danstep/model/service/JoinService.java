package com.danstep.model.service;

import com.danstep.model.dto.UserDTO;
import com.danstep.model.dto.JoinDTO;
import com.danstep.model.mapper.UserMapper;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Date;

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
        String profile = joinDTO.getProfile();

        Boolean isExist = userMapper.existsByUsername(username);

        if (isExist) {

            return;
        }

        UserDTO data = new UserDTO();

        data.setUsername(username);
        data.setPassword(bCryptPasswordEncoder.encode(password));
        data.setNickname(nickname);
        data.setProfile(profile);

        userMapper.insertUser(data);
    }
}