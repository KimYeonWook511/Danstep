package com.danstep.user.model.service;

import com.danstep.exception.NicknameAlreadyExistsException;
import com.danstep.exception.UsernameAlreadyExistsException;
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

        if (userMapper.existsByUsername(username)) {
            throw new UsernameAlreadyExistsException("아이디가 이미 존재합니다.");
        }

        // 이름 중복!!
        if (userMapper.existsByNickname(nickname)) {
            throw new NicknameAlreadyExistsException("닉네임이 이미 존재합니다.");
        }

        UserInfoDTO data = UserInfoDTO.builder()
                .username(username)
                .password(bCryptPasswordEncoder.encode(password))
                .nickname(nickname)
                .build();

        userMapper.insertUser(data);
    }
}