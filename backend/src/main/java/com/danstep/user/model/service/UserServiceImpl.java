package com.danstep.user.model.service;

import com.danstep.exception.NicknameAlreadyExistsException;
import com.danstep.exception.PasswordMismatchException;
import com.danstep.exception.UserNotFoundException;
import com.danstep.jwt.JWTUtil;
import com.danstep.user.model.dto.GetUserInfoDTO;
import com.danstep.user.model.dto.UpdateUserDTO;
import com.danstep.user.model.dto.UserInfoDTO;
import com.danstep.user.model.mapper.UserMapper;
import com.danstep.util.S3Util;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
public class UserServiceImpl implements UserService {

    private final UserMapper userMapper;
    private final S3Util s3Util;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    public UserServiceImpl(UserMapper userMapper, S3Util s3Util, BCryptPasswordEncoder bCryptPasswordEncoder) {
        this.userMapper = userMapper;
        this.s3Util = s3Util;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    }

    @Override
    @Transactional(readOnly = true)
    public GetUserInfoDTO getUserInfoByUsername(String username) {
        UserInfoDTO dto = userMapper.findByUsername(username);

        if (dto == null) {
            throw new UserNotFoundException("User not found with username: " + username);
        }

        GetUserInfoDTO result = GetUserInfoDTO.builder()
                .username(dto.getUsername())
                .nickname(dto.getNickname())
                .registDate(dto.getRegistDate())
                .profile(dto.getProfile())
                .build();

        return result;
    }

    @Override
    @Transactional
    public void updateUserByUsername(UpdateUserDTO updateUserDTO, MultipartFile profile) {

        UserInfoDTO dto = userMapper.findByUsername(updateUserDTO.getUsername());

        // 회원 정보 찾을 수 없음!!
        if (dto == null) {
            throw new UserNotFoundException("User not found with username: " + updateUserDTO.getUsername());
        }

        // 비밀번호 불일치!!
        if (!bCryptPasswordEncoder.matches(updateUserDTO.getCurrentPassword(), dto.getPassword())) {
            throw new PasswordMismatchException("비밀번호가 일치하지 않습니다.");
        }

        // 이름 중복!!
        if (userMapper.existsByNicknameExcludingUsername(updateUserDTO)) {
            throw new NicknameAlreadyExistsException("닉네임이 이미 존재합니다.");
        }

        // 프로필 사진 변경 시 UUID 생성
        if (profile != null && profile.getOriginalFilename() != null) {
            // profile에 null 이 들어 오는가?
            // isEmpty는 언제 되는가?
            // 등.. 여러 테스트를 해 봐야함
            String UUIDFilename = s3Util.getUUIDFilename(profile.getOriginalFilename());
            updateUserDTO.setProfile(UUIDFilename);
        }

        // 암호화
        if (updateUserDTO.getNewPassword() != null && !updateUserDTO.getNewPassword().isEmpty()) {
            updateUserDTO.setNewPassword(bCryptPasswordEncoder.encode(updateUserDTO.getNewPassword()));
        }

        // 정보 수정
        userMapper.updateUserByUsername(updateUserDTO);

        if (profile == null) return;

        // 새로운 profile 업로드
//        String temp = s3Util.uploadProfile(profile, updateUserDTO.getUsername(), updateUserDTO.getProfile());
//
//        try {
//            // 원래 profile 삭제
//            s3Util.
//
//        } catch () {
//            // 삭제 실패시 업로드 한거 삭제해야함!
//            // 그리고 다시 Exception 발생시켜서 Transaction해야한다는거 같음!
//        }

    }
}
