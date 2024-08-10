package com.danstep.result.model.service;

import com.danstep.result.model.dto.ResultInfoDTO;
import com.danstep.result.model.dto.SaveResultDTO;

public interface ResultService {

    void saveResult(SaveResultDTO saveResultDTO);
    ResultInfoDTO getResultByUsername(String username);
}
