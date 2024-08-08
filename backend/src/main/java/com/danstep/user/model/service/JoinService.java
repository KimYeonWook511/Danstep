package com.danstep.user.model.service;

import com.danstep.user.model.dto.UserDTO;
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