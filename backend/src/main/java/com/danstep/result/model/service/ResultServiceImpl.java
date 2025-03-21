package com.danstep.result.model.service;

import com.danstep.exception.ReplayNotFoundException;
import com.danstep.exception.UserNotFoundException;
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
    private final S3Util s3Util;

    public ResultServiceImpl(ResultMapper resultMapper, RankMapper rankMapper, S3Util s3Util) {
        this.resultMapper = resultMapper;
        this.rankMapper = rankMapper;
        this.s3Util = s3Util;
    }

    @Override
    @Transactional
    public void saveResult(SaveResultDTO saveResultDTO) {

        if (saveResultDTO.getScore() < 0 || saveResultDTO.getScore() > 10000) {
            throw new IllegalArgumentException("Invalid Score.");
        }

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
    public List<GetUserResultDTO> getUserResults(String username) {
        List<UserResultDTO> list = resultMapper.getUserResults(username);

        List<GetUserResultDTO> userResults = new ArrayList<>();
        GetUserResultDTO getUserResultDTO;

        for (UserResultDTO userResultDTO : list) {
            getUserResultDTO = new GetUserResultDTO(userResultDTO);
            getUserResultDTO.setThumbnailUrl(s3Util.getPublicUrl("games", Integer.toString(userResultDTO.getGameInfoId()), userResultDTO.getThumbnailFilename()));

            userResults.add(getUserResultDTO);
        }

        return userResults;
    }

    @Override
    @Transactional(readOnly = true)
    public GetReplayDTO getUserReplay(ReplayDTO replayDTO) {
        ReplayDTO dto = resultMapper.getUserReplay(replayDTO);

        if (dto == null) {
            throw new ReplayNotFoundException("Replay not found with resultInfoId " + replayDTO.getResultInfoId());
        }

        GetReplayDTO getReplayDTO = GetReplayDTO.builder()
                .score(dto.getScore())
                .perfect(dto.getPerfect())
                .great(dto.getGreat())
                .good(dto.getGood())
                .bad(dto.getBad())
                .maxCombo(dto.getMaxCombo())
                .build();

        // mp3파일 url 가져오기
        getReplayDTO.setAudioUrl(s3Util.getPublicUrl("games", Integer.toString(dto.getGameInfoId()), dto.getAudioFilename()));

        // background mp4 url 가져오기
        getReplayDTO.setBackgroundUrl(s3Util.getPublicUrl("games", Integer.toString(dto.getGameInfoId()), dto.getBackgroundFilename()));

        // game poseData json 가져오기
        getReplayDTO.setGamePoseData(s3Util.getPublicJson("games", Integer.toString(dto.getGameInfoId()), dto.getGamePoseFilename()));

        // my poseData json 가져오기
        getReplayDTO.setMyPoseData(s3Util.getPrivateJson("users", replayDTO.getUsername(), dto.getGameInfoId() + "/" + dto.getMyPoseFilename()));

        return getReplayDTO;
    }

    @Override
    @Transactional
    public void deleteUserResultPost(ReplayDTO replayDTO) {

        ReplayDTO deleteDTO = resultMapper.getUserResultPose(replayDTO);

        if (deleteDTO == null) {
            throw new ReplayNotFoundException("Replay not found with resultInfoId " + replayDTO.getResultInfoId());
        }

        int result = resultMapper.deleteUserResultPose(replayDTO.getResultInfoId());

        if (result == 0) {
            System.out.println("result pose 삭제 실패!!");
            // 삭제 실패시 처리 로직
            // 현재 시간이 없으니 우선 트랜잭션 처리
            // 추후 스프링 스케쥴러와 같은걸 활용해서 S3 버킷을 비워보자!!

            return;
        }

        // S3에서도 삭제해야함
        // S3에서 삭제 실패하면? Spring Batch??
        // poseFilename을 이용해서 삭제하기
        s3Util.deleteUserJson("users",
                replayDTO.getUsername(),
                Integer.toString(deleteDTO.getGameInfoId()),
                deleteDTO.getMyPoseFilename());

    }

}
