package com.danstep.result.model.service;

import com.danstep.result.model.dto.GetReplayDTO;
import com.danstep.result.model.dto.GetResultInfoDTO;
import com.danstep.result.model.dto.ReplayDTO;
import com.danstep.result.model.dto.SaveResultDTO;

import java.util.List;

public interface ResultService {

    void saveResult(SaveResultDTO saveResultDTO);

    List<GetResultInfoDTO> getUserResultsByGameInfoId(GetResultInfoDTO getResultInfoDTO);

    GetReplayDTO getUserReplay(ReplayDTO replayDTO);

//    List<>

}
