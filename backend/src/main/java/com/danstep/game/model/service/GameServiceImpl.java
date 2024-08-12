package com.danstep.game.model.service;

import com.danstep.exception.GameNotFoundException;
import com.danstep.game.model.dto.GameInfoDTO;
import com.danstep.game.model.dto.GameRankTop3DTO;
import com.danstep.game.model.mapper.GameMapper;
import com.danstep.util.S3Util;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class GameServiceImpl implements GameService {

    private final GameMapper gameMapper;
    private final S3Util s3Util;

    public GameServiceImpl(S3Util s3Util, GameMapper gameMapper) {
        this.s3Util = s3Util;
        this.gameMapper = gameMapper;
    }

    @Override
    @Transactional(readOnly = true)
    public List<GameInfoDTO> getAllGames() {
        List<Integer> gamesIdList = gameMapper.getGamesId();

        if (gamesIdList == null || gamesIdList.isEmpty()) {
            throw new GameNotFoundException("Game does not exist");
        }

        List<GameInfoDTO> gameInfoDTOList = new ArrayList<>();
        for (Integer id : gamesIdList) {
            GameInfoDTO gameInfoDTO = this.getGameInfo(id);
            GameRankTop3DTO gameRankTop3DTO = new GameRankTop3DTO();

            gameInfoDTOList.add(getGameInfo(id));
        }

        return gameInfoDTOList;
    }

    @Override
    @Transactional(readOnly = true)
    public GameInfoDTO getGameInfo(Integer id) {
        GameInfoDTO gameInfo = gameMapper.getGameInfoById(id);

        if (gameInfo == null) {
            throw new GameNotFoundException("Game not found with id " + id);
        }

        GameInfoDTO gameInfoDTO = GameInfoDTO.builder()
                .id(id)
                .title(gameInfo.getTitle())
                .uploadDate(gameInfo.getUploadDate())
                .playtime(gameInfo.getPlaytime())
                .level(gameInfo.getLevel())
                .build();

        // 썸네일 url 가져오기
        gameInfoDTO.setThumbnailUrl(s3Util.getPublicUrl("games", Integer.toString(id), gameInfo.getThumbnailFilename()));

        // mp3파일 url 가져오기
        gameInfoDTO.setAudioUrl(s3Util.getPublicUrl("games", Integer.toString(id), gameInfo.getAudioFilename()));

        // background mp4 url 가져오기
        gameInfoDTO.setBackgroundUrl(s3Util.getPublicUrl("games", Integer.toString(id), gameInfo.getBackgroundFilename()));

        return gameInfoDTO;
    }

    @Override
    @Transactional(readOnly = true)
    public GameRankTop3DTO getGameRankTop3ById(Integer id) {
        GameRankTop3DTO gameRankTop3DTO = gameMapper.getGameRankTop3ById(id);

        return gameRankTop3DTO;
    }

    @Override
    public String getGamePose(Integer id) {
        GameInfoDTO gameInfo = gameMapper.getGameInfoById(id);

        try {
            // Json파일 가져오기
            return s3Util.getPublicJson("games", Integer.toString(id), gameInfo.getPoseFilename());

        } catch (RuntimeException e) {
            // GET 요청 보내면서 문제 생김
            // 처리할 로직 작성해야함!
            return null;
        }
    }
}
