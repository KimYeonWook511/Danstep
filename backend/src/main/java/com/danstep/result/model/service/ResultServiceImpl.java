package com.danstep.result.model.service;

import com.danstep.aws.model.service.S3Service;
import com.danstep.exception.UserNotFoundException;
import com.danstep.result.model.dto.GetResultInfoDTO;
import com.danstep.result.model.dto.ResultInfoDTO;
import com.danstep.result.model.dto.SaveResultDTO;
import com.danstep.result.model.dto.SaveResultPoseDTO;
import com.danstep.result.model.mapper.ResultMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class ResultServiceImpl implements ResultService {

    private final ResultMapper resultMapper;
    private final S3Service s3Service;

    public ResultServiceImpl(ResultMapper resultMapper, S3Service s3Service) {
        this.resultMapper = resultMapper;
        this.s3Service = s3Service;
    }

    @Override
    @Transactional
    public void saveResult(SaveResultDTO saveResultDTO) {
        resultMapper.insertResultInfo(saveResultDTO);

        if (saveResultDTO.getId() == null) {
            throw new UserNotFoundException("User not found with username: " + saveResultDTO.getUsername());
        }

        if (saveResultDTO.getPoseData() == null) {
            // 포즈 저장은 하지 않음
            return;
        }

        // UUID json 파일명
        String poseFilename = "UUID.json";

        // s3에 업로드
        s3Service.uploadUserJson("/users",
                saveResultDTO.getUsername(),
                Integer.toString(saveResultDTO.getGameInfoId()),
                poseFilename,
                saveResultDTO.getPoseData());

        // DB에 포즈 저장
        SaveResultPoseDTO saveResultPoseDTO = SaveResultPoseDTO.builder()
                .resultInfoId(saveResultDTO.getId())
                .poseFilename(poseFilename)
                .build();
        resultMapper.insertResultPose(saveResultPoseDTO);

        if (saveResultPoseDTO.getId() == null) {
            // 트랜잭션 처리
            throw new RuntimeException();
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<GetResultInfoDTO> getUserResultsByUsername(String username) {
        List<ResultInfoDTO> list = resultMapper.getUserResultsByUsername(username);

        List<GetResultInfoDTO> results = new ArrayList<>();
        for (ResultInfoDTO resultInfoDTO : list) {
            GetResultInfoDTO getResultInfoDTO = new GetResultInfoDTO(resultInfoDTO);

            String poseData = s3Service.getPrivateJson("users", username,
                    resultInfoDTO.getGameInfoId() + "/" + resultInfoDTO.getPoseFilename());

            getResultInfoDTO.setPoseData(poseData);
        }

        return results;
    }
}
