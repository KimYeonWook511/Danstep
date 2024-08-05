package com.danstep.aws.dao;

import com.danstep.aws.dto.TempDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface S3Dao {

    void insertGameUUID(TempDto gameInfoDto);

    void insertProfileUUID(TempDto gameInfoDto);

    String getGameUUID(@Param("id") String id);

}
