package com.danstep.result.model.service;

import com.danstep.result.model.dto.GetResultInfoDTO;
import com.danstep.result.model.dto.SaveResultDTO;

import java.util.List;

public interface ResultService {

    void saveResult(SaveResultDTO saveResultDTO);

    List<GetResultInfoDTO> getUserResultsByUsername(String username);

}
