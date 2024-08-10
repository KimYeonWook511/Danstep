package com.danstep.result.model.mapper;

import com.danstep.result.model.dto.SaveResultDTO;
import com.danstep.result.model.dto.SaveResultPoseDTO;

public interface ResultMapper {

    Integer insertResultInfo(SaveResultDTO saveResultDTO);

    Integer insertResultPose(SaveResultPoseDTO saveResultPoseDTO);
}
