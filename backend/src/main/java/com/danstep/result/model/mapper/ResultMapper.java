package com.danstep.result.model.mapper;

import com.danstep.result.model.dto.*;

import java.util.List;

public interface ResultMapper {

    void insertResultInfo(SaveResultDTO saveResultDTO);

    void insertResultPose(SaveResultPoseDTO saveResultPoseDTO);

    List<UserResultDTO> getUserResults(String username);

    ReplayDTO getUserReplay(ReplayDTO replayDTO);

    ReplayDTO getUserResultPose(ReplayDTO replayDTO);

    int deleteUserResultPose(Integer resultInfoId);

}
