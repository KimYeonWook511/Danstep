package com.danstep.result.model.service;

import com.danstep.aws.model.service.S3Service;
import com.danstep.result.model.dto.ResultInfoDTO;
import com.danstep.result.model.dto.SaveResultDTO;
import com.danstep.result.model.dto.SaveResultPoseDTO;
import com.danstep.result.model.mapper.ResultMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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



//        resultMapper.insertResultInfo(saveResultDTO);

        if (saveResultDTO.getId() == null) {
            System.out.println("유저 정보 없음!");
            return;
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
    public ResultInfoDTO getResultByUsername(String username) {
        return null;
    }
}
