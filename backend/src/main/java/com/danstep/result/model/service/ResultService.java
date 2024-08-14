package com.danstep.result.model.service;

import com.danstep.result.model.dto.GetReplayDTO;
import com.danstep.result.model.dto.GetUserResultDTO;
import com.danstep.result.model.dto.ReplayDTO;
import com.danstep.result.model.dto.SaveResultDTO;

import java.util.List;

public interface ResultService {

    void saveResult(SaveResultDTO saveResultDTO);

    List<GetUserResultDTO> getUserResults(String username);

    GetReplayDTO getUserReplay(ReplayDTO replayDTO);

    void deleteUserResultPost(ReplayDTO replayDTO);

}
