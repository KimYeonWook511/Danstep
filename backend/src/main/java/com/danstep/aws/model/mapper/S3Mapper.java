package com.danstep.aws.model.mapper;

import com.danstep.aws.model.dto.TempDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface S3Mapper {

    void insertGameUUID(TempDto gameInfoDto);

    void insertProfileUUID(TempDto gameInfoDto);

    String getGameUUID(@Param("id") String id);

}
