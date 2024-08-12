package com.danstep.result.model.service;

import com.danstep.exception.UserNotFoundException;
import com.danstep.rank.model.dto.SaveRankDTO;
import com.danstep.rank.model.mapper.RankMapper;
import com.danstep.result.model.dto.GetResultInfoDTO;
import com.danstep.result.model.dto.ResultInfoDTO;
import com.danstep.result.model.dto.SaveResultDTO;
import com.danstep.result.model.dto.SaveResultPoseDTO;
import com.danstep.result.model.mapper.ResultMapper;
import com.danstep.util.S3Util;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class ResultServiceImpl implements ResultService {

    private final ResultMapper resultMapper;
    private final RankMapper rankMapper;
    private final S3Util s3Util;

    public ResultServiceImpl(ResultMapper resultMapper, RankMapper rankMapper, S3Util s3Util) {
        this.resultMapper = resultMapper;
        this.rankMapper = rankMapper;
        this.s3Util = s3Util;
    }

    @Override
    @Transactional
    public void saveResult(SaveResultDTO saveResultDTO) {
        System.out.println("saveResult Service 시작");
        // 게임 결과 저장
        resultMapper.insertResultInfo(saveResultDTO);
        System.out.println("게임 결과 저장");
        if (saveResultDTO.getId() == null) {
            throw new UserNotFoundException("User not found with username: " + saveResultDTO.getUsername());
        }
        System.out.println("최대 값 가져오기");
        // 유저 최대 값 가져오기
        Integer highScore = rankMapper.getUserHighScore(saveResultDTO);
        System.out.println("최대 점수: " + highScore);

        if (highScore == -1) {
            // 게임 최대 값 저장
            System.out.println("insertRankInfo 실행");
            rankMapper.insertRankInfo(saveResultDTO.getId());
            System.out.println("insertRankInfo 완료");

        } else if (saveResultDTO.getScore() > highScore) {
            // 게임 최대 값 수정
            SaveRankDTO saveRankDTO = SaveRankDTO.builder()
                    .resultInfoId(saveResultDTO.getId())
                    .oldScore(saveResultDTO.getScore())
                    .username(saveResultDTO.getUsername())
                    .gameInfoId(saveResultDTO.getGameInfoId())
                    .build();

            System.out.println("updateRankInfo 실행");
            rankMapper.updateRankInfo(saveRankDTO);
            System.out.println("updateRankInfo 완료");
        }

        if (saveResultDTO.getPoseData() != null) {
            // 포즈 저장
            System.out.println(saveResultDTO.getPoseData());
            saveResultPose(saveResultDTO);
        }
    }

    private void saveResultPose(SaveResultDTO saveResultDTO) {
        // UUID json 파일명
        String poseFilename = s3Util.getUUIDFilename("a.json");

        // s3에 업로드
        s3Util.uploadUserJson("users",
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
    }

    @Override
    @Transactional(readOnly = true)
    public List<GetResultInfoDTO> getUserResultsByUsername(String username) {
        List<ResultInfoDTO> list = resultMapper.getUserResultsByUsername(username);

        List<GetResultInfoDTO> results = new ArrayList<>();
        for (ResultInfoDTO resultInfoDTO : list) {
            GetResultInfoDTO getResultInfoDTO = new GetResultInfoDTO(resultInfoDTO);

            String poseData = s3Util.getPrivateJson("users", username,
                    resultInfoDTO.getGameInfoId() + "/" + resultInfoDTO.getPoseFilename());

            getResultInfoDTO.setPoseData(poseData);
        }

        return results;
    }
}
