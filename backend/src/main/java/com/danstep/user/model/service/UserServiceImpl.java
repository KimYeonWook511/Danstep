package com.danstep.user.model.service;

import com.danstep.user.model.dto.GetUserInfoDTO;
import com.danstep.user.model.dto.UpdateUserDTO;
import com.danstep.user.model.dto.UserInfoDTO;
import com.danstep.user.model.mapper.UserMapper;
import com.danstep.util.S3Util;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
public class UserServiceImpl implements UserService {

    private final UserMapper userMapper;
    private final S3Util s3Util;

    public UserServiceImpl(UserMapper userMapper, S3Util s3Util) {
        this.userMapper = userMapper;
        this.s3Util = s3Util;
    }

    @Override
    @Transactional(readOnly = true)
    public GetUserInfoDTO getUserInfoByUsername(String Username) {
        UserInfoDTO dto = userMapper.findByUsername(Username);

        if (dto == null) {
            return null;
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

        if (!profile.isEmpty()) { // empty로 해도 되는가!?
            // UUID 생성
            String UUIDFilename = s3Util.getUUIDFilename(profile.getOriginalFilename());
            updateUserDTO.setProfile(UUIDFilename);
        }

        // 정보 수정
        userMapper.updateUser(updateUserDTO);

        if (profile.isEmpty()) return;

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
