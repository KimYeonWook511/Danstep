package com.danstep.user.model.mapper;

import jakarta.transaction.Transactional;
import org.apache.ibatis.annotations.Mapper;

import java.util.Map;

@Mapper
public interface RefreshMapper {

    Boolean existsByRefresh(Map<String, Object> param);

    @Transactional
    void deleteByRefresh(String refresh);

    void insertRefresh(Map<String, Object> param);
}
