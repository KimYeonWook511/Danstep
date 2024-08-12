package com.danstep.result.model.mapper;

import com.danstep.result.model.dto.GetResultInfoDTO;
import com.danstep.result.model.dto.ReplayDTO;
import com.danstep.result.model.dto.SaveResultDTO;
import com.danstep.result.model.dto.SaveResultPoseDTO;

import java.util.List;

public interface ResultMapper {

    void insertResultInfo(SaveResultDTO saveResultDTO);

    void insertResultPose(SaveResultPoseDTO saveResultPoseDTO);

    List<GetResultInfoDTO> getUserResultsByGameInfoId(GetResultInfoDTO getResultInfoDTO);

    ReplayDTO getUserReplay(ReplayDTO replayDTO);
}
