package com.danstep.result.model.service;

import com.danstep.result.model.dto.ResultInfoDTO;
import com.danstep.result.model.mapper.ResultMapper;
import org.springframework.stereotype.Service;

@Service
public class ResultServiceImpl implements ResultService {

    private final ResultMapper resultMapper;

    public ResultServiceImpl(ResultMapper resultMapper) {
        this.resultMapper = resultMapper;
    }

    @Override
    public void saveResult(ResultInfoDTO resultInfoDTO) {

//        resultMapper.insertResultInfo(resultInfoDTO);
    }
}
