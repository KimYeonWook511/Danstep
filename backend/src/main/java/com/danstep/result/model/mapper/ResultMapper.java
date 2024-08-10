package com.danstep.result.model.mapper;

import com.danstep.result.model.dto.ResultInfoDTO;
import com.danstep.result.model.dto.SaveResultDTO;
import com.danstep.result.model.dto.SaveResultPoseDTO;

import java.util.List;

public interface ResultMapper {

    Integer insertResultInfo(SaveResultDTO saveResultDTO);

    Integer insertResultPose(SaveResultPoseDTO saveResultPoseDTO);

    List<ResultInfoDTO> getUserResultsByUsername(String username);
}
