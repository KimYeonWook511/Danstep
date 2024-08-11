package com.danstep.user.model.mapper;

import com.danstep.user.model.dto.UpdateUserDTO;
import com.danstep.user.model.dto.UserInfoDTO;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface UserMapper {

    Boolean existsByUsername(String username);

    void insertUser(UserInfoDTO user);

    //username을 받아 DB 테이블에서 회원을 조회하는 메소드 작성
    UserInfoDTO findByUsername(String username);

    void updateUserByUsername(UpdateUserDTO updateUserDTO);

    Boolean existsByNicknameExcludingUsername(UpdateUserDTO updateUserDTO);
}