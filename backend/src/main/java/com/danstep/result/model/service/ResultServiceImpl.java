package com.danstep.result.model.service;

import com.danstep.exception.GameNotFoundException;
import com.danstep.exception.ReplayNotFoundException;
import com.danstep.exception.UserNotFoundException;
import com.danstep.game.model.dto.GameInfoDTO;
import com.danstep.game.model.service.GameService;
import com.danstep.rank.model.dto.SaveRankDTO;
import com.danstep.rank.model.mapper.RankMapper;
import com.danstep.result.model.dto.*;
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
    private final GameService gameService;
    private final S3Util s3Util;

    public ResultServiceImpl(ResultMapper resultMapper, RankMapper rankMapper,
                             GameService gameService, S3Util s3Util) {
        this.resultMapper = resultMapper;
        this.rankMapper = rankMapper;
        this.gameService = gameService;
        this.s3Util = s3Util;
    }

    @Override
    @Transactional
    public void saveResult(SaveResultDTO saveResultDTO) {

        // 게임 결과 저장
        resultMapper.insertResultInfo(saveResultDTO);

        if (saveResultDTO.getId() == null) {
            throw new UserNotFoundException("User not found with username: " + saveResultDTO.getUsername());
        }

        // 유저 최대 값 가져오기
        Integer highScore = rankMapper.getUserHighScore(saveResultDTO);

        if (highScore == -1) {
            // 게임 최대 값 저장
            rankMapper.insertRankInfo(saveResultDTO.getId());

        } else if (saveResultDTO.getScore() > highScore) {
            // 게임 최대 값 수정
            SaveRankDTO saveRankDTO = SaveRankDTO.builder()
                    .resultInfoId(saveResultDTO.getId())
                    .oldScore(saveResultDTO.getScore())
                    .username(saveResultDTO.getUsername())
                    .gameInfoId(saveResultDTO.getGameInfoId())
                    .build();

            rankMapper.updateRankInfo(saveRankDTO);
        }

        if (saveResultDTO.getPoseData() != null) {
            // 포즈 저장
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
    public List<GetResultInfoDTO> getUserResultsByGameInfoId(GetResultInfoDTO getResultInfoDTO) {
//        List<GetResultInfoDTO> results = resultMapper.getUserResultsByGameInfoId(getResultInfoDTO);
//
//        return results;

        return resultMapper.getUserResultsByGameInfoId(getResultInfoDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public GetReplayDTO getUserReplay(ReplayDTO replayDTO) {
        ReplayDTO dto = resultMapper.getUserReplay(replayDTO);

        System.out.println(replayDTO.toString());
        System.out.println(dto != null ? dto.toString() : "비어있음!");

        if (dto == null) {
            throw new ReplayNotFoundException("Replay not found with resultInfoId " + replayDTO.getResultInfoId());
        }

        GetReplayDTO getReplayDTO = new GetReplayDTO();

        // mp3파일 url 가져오기
        getReplayDTO.setAudioUrl(s3Util.getPublicUrl("games", Integer.toString(dto.getGameInfoId()), dto.getAudioFilename()));

        // background mp4 url 가져오기
        getReplayDTO.setBackgroundUrl(s3Util.getPublicUrl("games", Integer.toString(dto.getGameInfoId()), dto.getBackgroundFilename()));

        // game poseData json 가져오기
        getReplayDTO.setGamePoseData(gameService.getGamePose(dto.getGameInfoId()));

        // my poseData json 가져오기
        getReplayDTO.setMyPoseData(s3Util.getPrivateJson("users", dto.getUsername(), dto.getMyPoseFilename()));

        return getReplayDTO;
    }

}
