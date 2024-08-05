package com.danstep.model.mapper;

import com.danstep.model.dto.UserDTO;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.HashMap;

@Mapper
public interface UserMapper {

    Boolean existsByUsername(String username);

    void insertUser(UserDTO user);

    //username을 받아 DB 테이블에서 회원을 조회하는 메소드 작성
    UserDTO findByUsername(String username);
}