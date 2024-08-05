package com.danstep.aws.model.mapper;

import com.danstep.aws.model.dto.TempDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface S3Mapper {

    void insertGameUUID(TempDTO gameInfoDto);

    void insertProfileUUID(TempDTO gameInfoDto);

    String getGameUUID(@Param("id") String id);

}
